import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    csp: {
      directives: {
        "script-src": ["self"],
      },
      // must be specified with either the `report-uri` or `report-to` directives, or both
      reportOnly: {
        "script-src": ["self"],
        "report-uri": ["/"],
      },
    },
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: null,
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
