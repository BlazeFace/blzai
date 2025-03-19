import { Accessor, Component, Setter } from "solid-js";

export type SidePanelProps = {
  selectedFile: Accessor<File>, setSelectedFile: Setter<File>, handleFileChange: (event: any) => void,
  builtQuery: Accessor<string>, handleQuery: () => void,
  setShowSidebar: Setter<boolean>, updateForm: (e: Event) => void };


export const SidePanel: Component<SidePanelProps> = (props) => {
  return (
    <div class="fixed top-0 left-0 h-full mt-6 bg-base-100 p w-1/5 p-2 z-10 border-r border-r-secondary overflow-y-auto">
      <div class="flex-row flex">
        <div class="w-7/8">
        </div>
        <button
          class="p-1  m-1 hover:bg-primary hover:text-primary-content rounded"
          onClick={() => props.setShowSidebar(false)}
        >
          ✕
        </button>
      </div>
      <div>
        <div class="flex flex-col">
          <input type="file" class="file-input file-input-primary file-input-sm w-full"
                 onChange={props.handleFileChange} />
        </div>
      </div>
      <form class="mt-2 w-full" onSubmit={(e) => {
        e.preventDefault();
        props.handleQuery();
      }}>
          <textarea
            placeholder="Enter Query Clause"
            class="textarea textarea-primary w-full resize-y min-h-[100px]"
            aria-label="where clause for grid"
            onChange={props.updateForm}
          />
        <div class="flex items-end justify-end border-b border-teal-500 py-2">
          <button
            class="mr-1 shrink-0 bg-primary hover:bg-secondary border-primary hover:border-secondary text-sm border-4 text-white py-1 px-2 rounded-sm"
            type="button" onClick={props.handleQuery}>
            Show Query Plan
          </button>
          <button
            class="ml-1 shrink-0 bg-accent hover:bg-teal-700 border-accent hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded-sm"
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