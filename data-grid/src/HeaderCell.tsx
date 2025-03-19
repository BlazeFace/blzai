import { Accessor, Component, Setter, Show } from "solid-js";
import { FilterClick } from "./HeaderRow";
import GridDropdown from "./GridComponents/GridDropdown";
import { FilterStore } from "./App";
import { QuerySelector } from "./Grid";

export type Column = { name: string }

type HeaderCellProps = {
  col: Accessor<Column>,
  index: number,
  width: number,
  filterClick: Setter<FilterClick>,
  filterAccessor: Accessor<FilterClick>,
  filterStore: FilterStore,
  selectQuerySetter: Setter<QuerySelector>,
  selectQueryAccessor: Accessor<QuerySelector>
};
export const HeaderCell: Component<HeaderCellProps> = (props) => {
  const handleFilterSelect = (column: string, value: string, clear: boolean) => {
    const currentSelections = props.selectQueryAccessor().selections.get(column) ?? new Set();
    if (clear) {
      props.selectQuerySetter({
        selections: props.selectQueryAccessor().selections.set(column, new Set()),
        ordering: { "column": "", "dir": 0 }
      });
      return;
    }
    if (currentSelections.has(value)) {
      const newSelections = new Set([...currentSelections].filter(v => v !== value));
      props.selectQuerySetter({
        selections: props.selectQueryAccessor().selections.set(column, newSelections),
        ordering: props.selectQueryAccessor().ordering
      });
      return;
    }
    const newSelections = currentSelections.add(value);
    props.selectQuerySetter({
      selections: props.selectQueryAccessor().selections.set(column, newSelections),
      ordering: props.selectQueryAccessor().ordering
    });
  };
  const handleSortSelect = (column: string) => {
    const currentOrdering = props.selectQueryAccessor().ordering;
    if (currentOrdering.column === column) {
      // Cycle through ordering, 0 = none, 1 = asc, -1 = desc
      const newOrdering = currentOrdering.dir === 1 ? -1 : (currentOrdering.dir === -1 ? 0 : 1);
      props.selectQuerySetter({
        selections: props.selectQueryAccessor().selections,
        ordering: { column: column, dir: newOrdering }
      });
      return;
    }
    props.selectQuerySetter({
      selections: props.selectQueryAccessor().selections,
      ordering: { column: column, dir: 1 }
    });
  };

  // SVG are attributed in the order in code
  // SVG arrows are MIT Licensed
  // THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  // SVG is CC0 Public Domain from https://www.svgrepo.com/page/licensing/#CC0
  return (
    <>
      <div class="flex flex-col">
        <div class="bg-base-100 border-1 border-base-300 border-b border-b-secondary text-center" style={`width: ${props.width}px`}>
          <div class="flex flex-row">
            <div class="basis-1/12 p-1 flex justify-start" onClick={() => {
              handleSortSelect(props.col().name);
            }}>
              {props.selectQueryAccessor().ordering.column === props.col().name ? (
                  props.selectQueryAccessor().ordering.dir === 1 ? (
                    <svg height="15px" width="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                      <path class="stroke-primary" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 20V4m0 0l6 6m-6-6l-6 6" />
                    </svg>
                  ) : props.selectQueryAccessor().ordering.dir === -1 ? (
                      <svg height="15px" width="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"
                           class="stroke-primary">
                        <g stroke-linecap="round" stroke-width="2">
                          <path d="M12 4v16" />
                          <path d="M6 14l6 6 6-6" />
                        </g>
                      </svg>) :
                    <svg height="15px" width="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                      <path class="stroke-primary" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 17l3 3m0 0l3-3m-3 3V4m3 3l-3-3m0 0L9 7" />
                    </svg>
                ) :
                (
                  <svg height="15px" width="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <path class="stroke-primary" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 17l3 3m0 0l3-3m-3 3V4m3 3l-3-3m0 0L9 7" />
                  </svg>
                )}
            </div>
            <div class="basis-10/12">
              <h1>{props.col().name}</h1>
            </div>
            <div class="basis-1/12 p-1 flex justify-end" onClick={() => {
              props.filterClick({
                clicked: !props.filterAccessor().clicked,
                columnLocation: props.index
              });
            }}>
              <svg class="fill-secondary" height="10px" width="10px" version="1.1" id="Layer_1"
                   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                   viewBox="0 0 407.437 407.437">
                <polygon
                  points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 " />
              </svg>
            </div>
          </div>
        </div>
        <Show when={props.filterAccessor().clicked && props.filterAccessor().columnLocation === props.index}>
          <div class="absolute border-solid border-2 border-base-300 bg-base-100"
               style={`width: 7%; margin-left:calc(${props.width}px - 7%);`}>
            <GridDropdown options={props.filterStore.store.get(props.col().name)?.values ?? []}
                          onSelect={handleFilterSelect} filterClick={props.filterClick} index={props.index}
                          columnName={props.col().name} selectQuerySetter={props.selectQuerySetter} />
          </div>
        </Show>
      </div>
    </>
  );
};