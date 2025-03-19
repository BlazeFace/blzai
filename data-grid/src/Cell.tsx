import { Accessor, Component, createSignal, Setter, onCleanup, createEffect } from "solid-js";

type CellProps = {
    cell: Accessor<any>,
    width: number,
    onUpdate?: (value: any, rowId: bigint, colIndex: number) => void,
    rowId: bigint,
    colIndex: number,
    selectedCells: Accessor<Map<bigint, Set<number>>>,
    setSelectedCells: Setter<Map<bigint, Set<number>>>
};

export const Cell: Component<CellProps> = (props) => {
    const [isEditing, setIsEditing] = createSignal(false);
    const [value, setValue] = createSignal((props.cell() ?? "").toString());
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    // Sync local state with parent props when cell data changes
    createEffect(() => {
        setValue((props.cell() ?? "").toString());
        setIsEditing(false);
    });

    const isSelected = () => {
        const selectedCells = props.selectedCells().get(props.rowId);
        return selectedCells ? selectedCells.has(props.colIndex) : false;
    };

    const handleClick = (e: MouseEvent) => {
        const selectedCells = props.selectedCells();

        // Check if shift is pressed
        if (e.shiftKey) {
            // Add to selection without clearing existing selections
            if (!selectedCells.has(props.rowId)) {
                selectedCells.set(props.rowId, new Set([props.colIndex]));
            } else {
                selectedCells.get(props.rowId)?.add(props.colIndex);
            }
        } else {
            // Regular click - clear previous selections and select only this cell
            selectedCells.clear();
            selectedCells.set(props.rowId, new Set([props.colIndex]));
        }

        props.setSelectedCells(new Map(selectedCells));
        setIsEditing(true);
    };

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setValue(target.value);

        // Clear any existing timeout
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set new timeout to submit after 500ms of inactivity
        debounceTimer = setTimeout(() => {
            if (props.onUpdate && value() !== (props.cell() ?? "").toString()) {
                props.onUpdate(value(), props.rowId, props.colIndex);
            }
        }, 500);
    };

    onCleanup(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
    });

    return (
      <>
          <div
            classList={{
                "border-solid border-1 text-center": true,
                "border-neutral-content bg-primary text-primary-content": isSelected(),
                "border-base-300 bg-base-100 text-base-content": !isSelected()
            }}
            style={`width: ${props.width}px`}
            onClick={(e) => handleClick(e)}
          >
              {isEditing() ? (
                <input
                  type="text"
                  value={value()}
                  onInput={handleInput}
                  class="w-full text-center focus:outline-none"
                  autofocus
                />
              ) : (
                <h1>{(props.cell() ?? "").toString()}</h1>
              )}
          </div>
      </>
    );
}