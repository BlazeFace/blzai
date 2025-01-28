import {Component, createSignal, For, Setter} from 'solid-js';
import {FilterClick} from "../HeaderRow";
import {QuerySelector} from "../Grid";

type GridDropdownProps = {
    options: any[];
    onSelect: (column: string, value: string) => void;
    filterClick: Setter<FilterClick>;
    index: number;
    columnName: string,
    selectQuerySetter: Setter<QuerySelector>;
};

const GridDropdown: Component<GridDropdownProps> = (props) => {
    const [search, setSearch] = createSignal('');
    const [filteredOptions, setFilteredOptions] = createSignal(props.options);

    const handleSearch = (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        setSearch(value);
        setFilteredOptions(props.options.filter(option => option.toLowerCase().includes(value.toLowerCase())));
    };
    // SVG is CC0 Public Domain from https://www.svgrepo.com/page/licensing/#CC0
    return (
        <div class="flex flex-col">
            <div class="flex flex-row">
                <div class="w-10/12">
                    <input
                        type="text"
                        value={search()}
                        onInput={handleSearch}
                        placeholder="Filter"
                        class="w-full"
                    />
                </div>
                <div class="w-2/12 pr-1 pt-1 flex justify-end" onClick={() =>
                    props.filterClick({clicked: false, columnLocation: props.index})
                }>
                    <svg fill="#000000" height="10px" width="10px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                         viewBox="0 0 407.437 407.437">
                        <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 "/>
                    </svg>
                </div>
            </div>
            <div class="flex-row">
                <ul class="border mt-2 max-h-40 overflow-y-auto">
                    <For each={filteredOptions()}>
                        {(option) => (
                            <li class="p-2 cursor-pointer hover:bg-gray-200">
                                <label>
                                    <input
                                        type="checkbox"
                                        class="mr-2"
                                        onChange={() => props.onSelect(props.columnName, option)}
                                    />
                                    {option}
                                </label>
                            </li>
                        )}
                    </For>
                </ul>
            </div>
        </div>
    );
};

export default GridDropdown;