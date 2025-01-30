import {Accessor, Component, Setter, Show} from "solid-js";
import {FilterClick} from "./HeaderRow";
import GridDropdown from "./GridComponents/GridDropdown";
import {FilterStore} from "./App";
import {QuerySelector} from "./Grid";
export type Column = { name: string }

type HeaderCellProps = { col: Accessor<Column>, index: number, width: number, filterClick: Setter<FilterClick>, filterAccessor: Accessor<FilterClick>, filterStore: FilterStore,
    selectQuerySetter: Setter<QuerySelector>, selectQueryAccessor: Accessor<QuerySelector> };
export const HeaderCell: Component<HeaderCellProps> = (props) => {
    const handleSelect = (column: string, value: string, clear: boolean) => {
        const currentSelections = props.selectQueryAccessor().selections.get(column) ?? new Set();
        if (clear) {
            props.selectQuerySetter({selections: props.selectQueryAccessor().selections.set(column, new Set())});
            return
        }
        if (currentSelections.has(value)) {
            const newSelections = new Set([...currentSelections].filter(v => v !== value));
            props.selectQuerySetter({selections: props.selectQueryAccessor().selections.set(column, newSelections)});
            return
        }
        const newSelections = currentSelections.add(value);
        props.selectQuerySetter({selections: props.selectQueryAccessor().selections.set(column, newSelections)});
    };
    // SVG is CC0 Public Domain from https://www.svgrepo.com/page/licensing/#CC0
    return (
        <>
            <div class="flex flex-col">
                <div class="border-solid border-2 border-red-500 text-center" style={`width: ${props.width}px`}>
                    <div class="flex flex-row">
                        <div class="basis-11/12">
                            <h1>{props.col().name}</h1>
                        </div>
                        <div class="basis-1/12 p-1 flex justify-end" onClick={() => {props.filterClick({ clicked: !props.filterAccessor().clicked, columnLocation: props.index }); console.log(props.filterAccessor().clicked)}}>
                            <svg fill="#000000" height="10px" width="10px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                 viewBox="0 0 407.437 407.437">
                                    <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 "/>
                            </svg>
                        </div>
                    </div>
                </div>
                <Show when={props.filterAccessor().clicked && props.filterAccessor().columnLocation === props.index}>
                    <div class="absolute border-solid border-2 border-red-500 bg-amber-50" style={`width: 7%; margin-left:calc(${props.width}px - 7%);`}>
                        <GridDropdown options={props.filterStore.store.get(props.col().name)?.values ?? []} onSelect={handleSelect} filterClick={props.filterClick} index={props.index} columnName={props.col().name} selectQuerySetter={props.selectQuerySetter}/>
                    </div>
                </Show>
            </div>
        </>
    );
}