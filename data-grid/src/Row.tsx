import {Accessor, Component, Index} from 'solid-js';
import {Cell} from "./Cell";

type RowProps = { cells: Accessor<{id: number, value: any[]}>, columns: Accessor<number[]> };
export const Row: Component<RowProps> = (props) => {
  return (
      <>
          <div class="grid grid-flow-col auto-cols-max bg-amber-50 ">
            <Index each={props.cells().value}>{(cell, i) =>
                <Cell cell={cell} width={props.columns()[i]}></Cell>
                }
            </Index>
          </div>
      </>
  )
}