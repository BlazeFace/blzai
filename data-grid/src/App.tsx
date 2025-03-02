import { Component, createEffect, createSignal, Show } from "solid-js";
import { Grid, Ordering, QuerySelector } from "./Grid";
import {AsyncDuckDB, AsyncDuckDBConnection} from "@duckdb/duckdb-wasm";
import {Table} from "apache-arrow";
import * as utils from "./utils";
import {createStore} from "solid-js/store";
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';

// Database References
let db: AsyncDuckDB;
let c: AsyncDuckDBConnection;

export type FilterStoreValue = {hc: boolean, type: string, name: string, values: any[]};
export type FilterStore = {store: Map<string, FilterStoreValue>};
type AppProps = {db: AsyncDuckDB, c: AsyncDuckDBConnection};
export type QueryForm = {query: string};

const App: Component<AppProps> = (props) => {
    const [tbl, setData] = createSignal<Table<any>>(new Table<any>());
    const [widths, setWidths] = createSignal<number[]>([]);
    db = props.db;
    c = props.c;

    hljs.registerLanguage('sql', sql);

    const [filterStore, setFilterStore] = createStore<FilterStore>({store: new Map<string, FilterStoreValue>()});
    const [querySelector, setQuerySelector] = createSignal<QuerySelector>({selections: new Map<string, Set<string>>(), ordering: {column: "", dir: 0}});
    const [showSidebar, setShowSidebar] = createSignal<boolean>(true);
    const [table, setTable] = createSignal<string>("");
    const [selectedFile, setSelectedFile] = createSignal<File>(new File([], ""));
    const [stateKey, setStateKey] = createSignal<number>(0);
    const [queryForm, setQueryForm] = createSignal<QueryForm>({query: ""});
    const [notBuiltQuery, setNotBuiltQuery] = createSignal<string>("");
    const [builtQuery, setBuiltQuery] = createSignal<string>("");

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);

        const reader = new FileReader();
        reader.onload = async function(e) {
            const fileParts: string[] = event.target.files[0].name.split(".");
            const file = fileParts.slice(0, -1).join(".");
            const fileExtension = fileParts[fileParts.length - 1];
            const fileContent = e.target?.result?.toString();
            if (fileContent) {
                await update(file, fileExtension, fileContent);
            }
            setTable(cleanTableName(file));
            await buildFilters(cleanTableName(file));
        };
        reader.readAsText(event.target.files[0]);
    };

    const runQuery = async (table: string, queryString: string) => {
        if (table.length === 0) {
            console.log("Table not selected");
            return;
        }
        const query = `SELECT * FROM "${table}_with_edits" ${queryString.length > 0 ? 'WHERE' : ''} ${queryString} LIMIT 2000`;
        const formatedQuery = hljs.highlight(
          query,
          { language: 'sql' }
        ).value;
        setBuiltQuery(formatedQuery);
        const result = await c.query(query);
        // @ts-ignore
        setData(result);
        setStateKey(stateKey() + 1);
        // Calculate initial column widths, skipping rowid
        let info = result.schema.names as string[];

        const fontSize = utils.getFontSize();
        const runeSize = utils.calculateTextWidth("A", `${fontSize} monospace`);
        setWidths(utils.rowWidths(info.slice(1), runeSize));
    }


    const updateForm = (e: any) => { setNotBuiltQuery(e.target.value); };

    const handleQuery = async () => {
        setQueryForm({query: notBuiltQuery()});
    };

    createEffect(async () => {
        if (table().length === 0) {
            return;
        }
        const baseQuery = queryForm().query.length > 0 ? queryForm().query : "1=1";
        if (querySelector().selections.size > 0) {
            const q = `${baseQuery} ${utils.buildWhereIn(querySelector().selections)} ${addOrderBy(querySelector().ordering)}`;
            await buildFilters(table(), q);
            await runQuery(table(), q);
            return;
        }
        else {
            await buildFilters(table(), baseQuery);
            await runQuery(table(), `${baseQuery} ${addOrderBy(querySelector().ordering)}`);
        }
    });

    async function buildFilters(table: string, query: string = "") {
        const columns = await c.query(`select column_name, data_type from information_schema.columns where column_name != 'rowid' and table_name = '${table}_with_edits'`);
        let filterValues: FilterStoreValue[] = [];
        const lookup: Record<string, number> = {};
        for (let i = 0; i  < columns.numRows; i++) {
            const colName = columns.get(i)?.toArray()[0];
            lookup[colName] = i;
        }
        for (let i = 0; i < columns.numRows; i++) {
            const columnName = columns.get(i)?.toArray()[0];
            const columnType = columns.get(i)?.toArray()[1];
            // Skip rowid
            if (columnName === "rowid") {
                continue;
            }
            const queryString = query.length > 0 ? `WHERE ${query}` : "";
            const sql = `SELECT DISTINCT "${columnName}" FROM "${table}_with_edits" ${queryString}`;
            const resp = await c.query(sql);
            let values: any[] = [];

            // Accumulate Values
            for (let j = 0; j < resp.numRows; j++) {
                console.log(columnType);
                if (columnType == "BIGINT") {
                    values.push(resp.get(j)?.toArray()[0].toString());
                    continue;
                }
                values.push(resp.get(j)?.toArray()[0]);
            }

            const fv: FilterStoreValue = {
                hc: true,
                type: columnType,
                name: columnName,
                values: values
            };
            filterValues.push(fv);
        }
        const store = filterStore;
        const mapping = store.store;
        filterValues.forEach(fv => mapping.set(fv.name, fv));
        setFilterStore(store);
    }


    function addOrderBy(ordering: Ordering) {
        const column = ordering.column;
        const dir = ordering.dir;
        return dir != 0 && column != "" ? `ORDER BY "${column}" ${dir === 1 ? 'ASC' : 'DESC'}` : '';
    }

    async function onCellUpdate(value: any, rowId: bigint, colIndex: number) {
        await c.query(`INSERT INTO edits.${table()} VALUES (${rowId.toString()}, ${colIndex}, '${value}')`);
    }

  return (
      <>
          <div class="container w-screen">
                  <div class="flex flex-col bg-amber-500 w-screen">
                      <div class="flex flex-row">
                          <h1>DataGrid</h1>
                      </div>
                      <div class="flex flex-row h-screen">
                          <Show when={showSidebar()}>
                          <div class="flex-auto h-full bg-amber-50 basis-1/5 p-2">
                              <div class="flex-row flex">
                                  <div class="flex-col basis-11/12">
                                    {selectedFile() && <p>Selected file: {selectedFile().name}</p>}
                                      <input
                                        type="file"
                                        class="text-sm text-stone-500
                                           file:mr-5 file:py-1 file:px-3 file:border-[1px]
                                           file:text-xs file:font-medium
                                           file:bg-stone-50 file:text-stone-700
                                           hover:file:cursor-pointer hover:file:bg-blue-50
                                           hover:file:text-blue-700"
                                        onChange={handleFileChange}
                                      />
                                  </div>
                                  <div class="flex-col basis-1/12 content-end">
                                      <button class="button" onClick={ () => setShowSidebar(false)}>x</button>
                                  </div>
                              </div>
                              <form class="w-full max-w-lg" onSubmit={handleQuery}>
                                  <div class="flex items-center border-b border-teal-500 py-2">
                                      <input
                                          class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-hidden"
                                          type="text" placeholder="Enter Query Clause"
                                          aria-label="where clause for grid" onChange={updateForm}/>
                                      <button
                                          class="shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded-sm"
                                          type="button" onClick={handleQuery}>
                                          Submit
                                      </button>
                                  </div>
                              </form>
                              <div>
                                  <h1>Filters:</h1>
                                  <div style="font-size: 0.9em" innerHTML={builtQuery()}></div>
                              </div>
                          </div>
                          </Show>
                          <Show when={!showSidebar()}>
                              <button
                                class="p-2 bg-amber-100 hover:bg-amber-200 rounded-r"
                                onClick={() => setShowSidebar(true)}
                              >
                                  ≡
                              </button>
                          </Show>
                          <div class="flex-initial bg-gray-200 basis-full">
                              <Grid tbl={tbl()} state={stateKey()} widths={widths()} filterStore={filterStore}
                                    querySelector={querySelector} setQuerySelector={setQuerySelector} onCellUpdate={onCellUpdate}>
                              </Grid>
                          </div>
                      </div>
                  </div>
          </div>
      </>
  );
};

export default App;

const cleanTableName = (tbl: string) => {
    return tbl.replace(/[^a-zA-Z0-9]/g, "_");
}
async function update(tbl: string, extension: string, str: string) {
    // Remove Special Characters from Table Name
    const cleanTbl = cleanTableName(tbl);
    const tablePath = `${cleanTbl}.${extension}`;
    await db.dropFile(tablePath);
    await db.registerFileText(
      tablePath,
        str
    );
    await c.query(`DROP TABLE IF EXISTS "${cleanTbl}"`);
    await c.insertCSVFromPath(tablePath, {schema: 'main', name: cleanTbl, delimiter: ","});

    await c.query(`
      CREATE OR REPLACE TABLE "${cleanTbl}_with_rowid" AS 
      SELECT row_number() OVER() - 1 AS rowid, * 
      FROM "${cleanTbl}"
    `);

    // Replace the original table with the new one
    await c.query(`DROP TABLE "${cleanTbl}"`);
    await c.query(`ALTER TABLE "${cleanTbl}_with_rowid" RENAME TO "${cleanTbl}"`);

    await c.query(`ATTACH IF NOT EXISTS 'edits.db' (TYPE sqlite)`);
    await c.query(`CREATE TABLE IF NOT EXISTS edits.${cleanTbl} (rowId INTEGER, colId INTEGER, cellValue TEXT)`);

    // Get column names from the base table
    const columnInfo = await c.query(`DESCRIBE "${cleanTbl}";`);
    const columns = [];
    for (let i = 0; i < columnInfo.numRows; i++) {
        // Cannot include rowid in view
        if (columnInfo.get(i)?.toArray()[0] === "rowid") {
            continue;
        }
        const columnData = columnInfo.get(i)?.toArray();
        if (columnData) {
            columns.push({
                name: columnData[0],
                type: columnData[1]
            });
        }
    }

    let viewSQL = `CREATE OR REPLACE VIEW "${cleanTbl}_with_edits" AS SELECT rowid, `;

    // Build case expressions for each column with proper casting
    const caseExpressions = columns.map((col, idx) => {
        return `CASE WHEN EXISTS (
            SELECT 1 FROM edits.${cleanTbl}
            WHERE rowId = t.rowid AND colId = ${idx}
        ) THEN 
            CAST((SELECT cellValue FROM edits.${cleanTbl}
            WHERE rowId = t.rowid AND colId = ${idx}
            ORDER BY rowId DESC LIMIT 1) AS ${col.type})
        ELSE t."${col.name}" END AS "${col.name}"`;
    }).join(", ");

    viewSQL += caseExpressions;
    viewSQL += `FROM "${cleanTbl}" t`;
    await c.query(viewSQL);
}