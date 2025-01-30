import {Component, createSignal, For, Setter} from 'solid-js';
import {FilterClick} from "../HeaderRow";
import {QuerySelector} from "../Grid";

type GridDropdownProps = {
    options: any[];
    onSelect: (column: string, value: string, clear: boolean) => void;
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
    // SVG are attributed in the order in code
    // Vectors and icons by https://orchid.software/en/docs/icons/?ref=svgrepo.com in MIT License via SVG Repo
    // SVG is CC0 Public Domain from https://www.svgrepo.com/page/licensing/#CC0
    return (
        <div class="flex flex-col">
            <div class="flex flex-row">
                <div class="w-2/12 pl-1 pt-2 flex justify-start" onClick={  () => {props.onSelect(props.columnName, "", true)}}>
                    <svg fill="#000000" width="12x" height="12px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM2 16c0-3.508 1.3-6.717 3.441-9.177l19.745 19.745c-2.46 2.152-5.673 3.463-9.186 3.463-7.72 0-14-6.312-14-14.032v0zM26.594 25.15l-19.738-19.738c2.456-2.123 5.651-3.412 9.143-3.412 7.72 0 14 6.28 14 14 0 3.489-1.286 6.689-3.406 9.149z"></path>
                    </svg>
                </div>
                <div class="w-8/12">
                    <input
                        type="text"
                        value={search()}
                        onInput={handleSearch}
                        placeholder="Filter"
                        class="w-full ml-2 mt-2"
                    />
                </div>
                <div class="w-2/12 pr-1 pt-2 flex justify-end" onClick={() =>
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
                                        onChange={() => props.onSelect(props.columnName, option, false)}
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