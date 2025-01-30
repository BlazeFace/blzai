import { Component, createEffect, createSignal, Show } from "solid-js";
import {Grid, QuerySelector} from "./Grid";
import {AsyncDuckDB, AsyncDuckDBConnection} from "@duckdb/duckdb-wasm";
import {Table} from "apache-arrow";
import * as utils from "./utils";
import {createStore} from "solid-js/store";

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

    const [filterStore, setFilterStore] = createStore<FilterStore>({store: new Map<string, FilterStoreValue>()});
    const [querySelector, setQuerySelector] = createSignal<QuerySelector>({selections: new Map<string, Set<string>>()});

    const [showSidebar, setShowSidebar] = createSignal<boolean>(true);
    const [table, setTable] = createSignal<string>("");
    const [selectedFile, setSelectedFile] = createSignal<File>(new File([], ""));
    const [stateKey, setStateKey] = createSignal<number>(0);
    const [queryForm, setQueryForm] = createSignal<QueryForm>({query: ""});
    const [notBuiltQuery, setNotBuiltQuery] = createSignal<string>("");

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
        const query = `SELECT * FROM "${table}" ${queryString.length > 0 ? 'WHERE' : ''} ${queryString} LIMIT 2000`;
        console.log(query);
        const result = await c.query(query);
        console.log(result.get(0)?.toArray());
        // @ts-ignore
        setData(result);
        setStateKey(stateKey() + 1);
        // Calculate initial column widths
        let info = result.schema.names as string[];
        const fontSize = utils.getFontSize();
        const runeSize = utils.calculateTextWidth("A", `${fontSize} monospace`);
        setWidths(utils.rowWidths(info, runeSize));
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
            const q = `${baseQuery} ${utils.buildWhereIn(querySelector().selections)}`;
            await buildFilters(table(), q);
            await runQuery(table(), q);
            return;
        }
        else {
            await buildFilters(table(), baseQuery);
            await runQuery(table(), baseQuery);
        }
    });

    async function buildFilters(table: string, query: string = "") {
        const columns = await c.query(`SHOW "${table}";`);
        let filterValues: FilterStoreValue[] = [];
        const lookup: Record<string, number> = {};
        for (let i = 0; i  < columns.numRows; i++) {
            const colName = columns.get(i)?.toArray()[0];
            lookup[colName] = i;
        }
        for (let i = 0; i < columns.numRows; i++) {
            const columnName = columns.get(i)?.toArray()[0];
            const columnType = columns.get(i)?.toArray()[1];
            const queryString = query.length > 0 ? `WHERE ${query}` : "";
            const sql = `SELECT DISTINCT "${columnName}" FROM "${table}" ${queryString}`;
            const resp = await c.query(sql);
            let values: any[] = [];

            // Accumulate Values
            for (let j = 0; j < resp.numRows; j++) {
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
                          </div>
                          </Show>
                          <div class="flex-initial bg-gray-200 basis-full">
                              <Grid tbl={tbl()} state={stateKey()} widths={widths()} filterStore={filterStore}
                                                                                querySelector={querySelector} setQuerySelector={setQuerySelector}>

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
    const table = `${cleanTbl}.${extension}`;
    await db.dropFile(table);
    await db.registerFileText(
        table,
        str
    );
    await c.insertCSVFromPath(table, {schema: 'main', name: cleanTbl, delimiter: ","});
}