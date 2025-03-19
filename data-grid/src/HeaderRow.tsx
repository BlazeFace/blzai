import {Accessor, Component, createSignal, Index, Setter} from 'solid-js';
import {Column, HeaderCell} from "./HeaderCell";
import {FilterStore} from "./App";
import {QuerySelector} from "./Grid";

export type FilterClick = { clicked: boolean, columnLocation: number };
type HeaderRowProps = { cols: Accessor<Column[]>, columnWidths: Accessor<number[]>, filterStore: FilterStore, selectQuerySetter: Setter<QuerySelector>, selectQueryAccessor: Accessor<QuerySelector> };
export const HeaderRow: Component<HeaderRowProps> = (props) => {
    const [sort, setSort] = createSignal<FilterClick>({clicked: false, columnLocation: 0});
    return (
        <>
            <div class="grid grid-flow-col auto-cols-max resize-x bg-base-300">
                <Index each={props.cols()}>{(col, i) =>
                    <HeaderCell col={col} index={i} width={props.columnWidths()[i]} filterClick={setSort} filterAccessor={sort} filterStore={props.filterStore} selectQuerySetter={props.selectQuerySetter} selectQueryAccessor={props.selectQueryAccessor}></HeaderCell>
                }
                </Index>
            </div>
        </>
    )
}