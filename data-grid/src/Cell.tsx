import {Accessor, Component} from "solid-js";

type CellProps = { cell: Accessor<any>, width: number };
export const Cell: Component<CellProps> = (props) => {
    return (
      <>
        <div class="border-solid border-2 border-sky-500 text-center" style={`width: ${props.width}px`}>
            <h1>{(props.cell() ?? "").toString()}</h1>
        </div>
      </>
    );
}