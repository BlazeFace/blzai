import {Row} from "./Row";
import {Accessor, Component, createSignal, Index, Setter} from "solid-js";
import { Table } from "apache-arrow";
import * as utils from "./utils";
import {HeaderRow} from "./HeaderRow";
import {Column} from "./HeaderCell";
import {FilterStore} from "./App";

export type Ordering = {column: string, dir: number};
export type QuerySelector = {selections: Map<string, Set<string>>, ordering: Ordering};

type GridProps = {tbl: Table<any>, widths: number[], state: number,
    filterStore: FilterStore,
    querySelector: Accessor<QuerySelector>, setQuerySelector: Setter<QuerySelector>
    onCellUpdate: (value: any, rowId: bigint, colIndex: number) => void,
};
export const Grid: Component<GridProps> = (props) => {
    const [columns, setColumns] = createSignal<Column[]>([]);
    const [selectedCells, setSelectedCells] = createSignal<Map<bigint, Set<number>>>(new Map());

    const columnInformation = (tbl: Table<any>) => {
        const info = (tbl.schema.names as string[]).slice(1);
        // Set Header Names
        const columnObjs = Array.from({length: info.length}, (_, i) => {
          return {name: info[i]} as Column;
        });
        setColumns(columnObjs);
        return columns;
    }

    const [widths, setWidths] = createSignal<number[]>([]);
    const transformTable = (tbl: Table<any>) => {
        let width: number[] = props.widths;
        const values: any[] = [];
        const fontSize = utils.getFontSize();
        const runeSize = utils.calculateTextWidth("A", `${fontSize} monospace`);

        for (let i = 0; i < tbl.numRows; i++) {
            values.push(tbl.get(i)?.toArray());
            const w = utils.rowWidths(values[i], runeSize);
            width = utils.replaceIfGreater(width, w)
        }

        setWidths(width);
        return Array.from({length: tbl.numRows}, (_, i) => {
            return {id: values[i][0], value: values[i].slice(1)};
        });
    }

    return (
        <>
            <div class="flex items-center justify-center pt-0.5">
                <div class="grid grid-flow-row auto-row-max " style = "font-family: monospace">
                    <HeaderRow cols={columnInformation(props.tbl)} columnWidths={widths} filterStore={props.filterStore} selectQuerySetter={props.setQuerySelector} selectQueryAccessor={props.querySelector}></HeaderRow>
                    <Index each={transformTable(props.tbl)}>{(row) =>
                        <Row cells={row} columns={widths} selectedCells={selectedCells}
                             setSelectedCells={setSelectedCells} onUpdate={props.onCellUpdate}/>
                        }
                    </Index>
            </div>
            </div>
        </>
    );
}