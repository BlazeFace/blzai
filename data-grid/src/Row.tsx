import { Accessor, Component, Index, Setter } from "solid-js";
import {Cell} from "./Cell";

type RowProps = {
  cells: Accessor<{id: bigint, value: any[]}>,
  columns: Accessor<number[]>,
  selectedCells: Accessor<Map<bigint, Set<number>>>,
  setSelectedCells: Setter<Map<bigint, Set<number>>>
  onUpdate: (value: any, rowId: bigint, colIndex: number) => void,
};
export const Row: Component<RowProps> = (props) => {
  return (
      <>
          <div class="grid grid-flow-col auto-cols-max bg-amber-50 ">
            <Index each={props.cells().value}>{(cell, i) =>
                <Cell
                  cell={cell}
                  width={props.columns()[i]}
                  onUpdate={props.onUpdate}
                  rowId={props.cells().id}
                  colIndex={i}
                  selectedCells={props.selectedCells}
                  setSelectedCells={props.setSelectedCells}
                />
                }
            </Index>
          </div>
      </>
  )
}