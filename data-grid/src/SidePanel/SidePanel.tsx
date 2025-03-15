import { Accessor, Component, Setter } from "solid-js";

export type SidePanelProps = {
  selectedFile: Accessor<File>, setSelectedFile: Setter<File>, handleFileChange: (event: any) => void,
  builtQuery: Accessor<string>, handleQuery: () => void,
  setShowSidebar: Setter<boolean>, updateForm: (e: Event) => void };


export const SidePanel: Component<SidePanelProps> = (props) => {
  return (
    <div class="fixed top-0 left-0 h-full mt-6 bg-amber-50 w-1/5 p-2 z-10 overflow-y-auto">
      <div class="flex-row flex">
        <div class="flex-col basis-11/12">
          {props.selectedFile() && <p>Selected file: {props.selectedFile().name}</p>}
          <input
            type="file"
            class="text-sm text-stone-500
                                           file:mr-5 file:py-1 file:px-3 file:border-[1px]
                                           file:text-xs file:font-medium
                                           file:bg-stone-50 file:text-stone-700
                                           hover:file:cursor-pointer hover:file:bg-blue-50
                                           hover:file:text-blue-700"
            onChange={props.handleFileChange}
          />
        </div>
        <div class="flex-col basis-1/12 content-end">
          <button class="button" onClick={() => props.setShowSidebar(false)}>x</button>
        </div>
      </div>
      <form class="w-full max-w-lg" onSubmit={(e) => {e.preventDefault(); props.handleQuery();}}>
        <div class="flex items-center border-b border-teal-500 py-2">
          <input
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-hidden"
            type="text" placeholder="Enter Query Clause"
            aria-label="where clause for grid" onChange={props.updateForm} />
          <button
            class="shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded-sm"
            type="button" onClick={props.handleQuery}>
            Submit
          </button>
        </div>
      </form>
      <div>
        <h1>Filters:</h1>
        <div style="font-size: 0.9em" innerHTML={props.builtQuery()}></div>
      </div>
    </div>
  );
}