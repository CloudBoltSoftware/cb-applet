import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { postBuildScriptRunner } from "./src/plugins/build/postBuildScriptRunner";
import { chromeDevtoolsOverrides } from "./src/plugins/build/chromeDevToolOverrides";

/**
 * This is the Vite configuration file. It's used to configure the Vite bundler.
 * https://vitejs.dev/config/
 */
export default defineConfig({
  /**
   * Plugins extend Vite. Each can be configured with options.
   * https://vitejs.dev/guide/using-plugins.html
   */
  plugins: [
    // Handle .vue files
    vue({
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#image-loading
      template: {
        transformAssetUrls,
      },
    }),

    // Add Vuetify Components, directives, etc. This is required for Vuetify to work.
    vuetify(),

    // Resolves installed node modules into the bundler. See for more information:
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    nodeResolve(),

    // If in dev mode, copies the built applet to folders for Chrome Devtools Overrides
    chromeDevtoolsOverrides(),

    // Runs a script that triggers the custom xui bundler when a build finishes.
    postBuildScriptRunner({ script: "npm run post-build" }),
  ],

  /**
   * Build-time configuration.
   * https://vitejs.dev/config/build-options.html
   */
  build: {
    /**
     * Applets are essentially packaged Vue components. Putting Vite into library mode
     * builds a library of 1 component that can be loaded by the SSP.
     * https://vitejs.dev/guide/build.html#library-mode
     */
    lib: {
      // CloudBolt loads Applets as ES Modules - the browser's native module format.
      formats: ["es"],

      // The root component the SSP should load.
      entry: "src/TheApplet.vue",

      // The name of the js bundle the SSP will use to load the component.
      // This should match package.json's "module" field and "xuiConfig.met_entry_point"
      fileName: "main.es",
    },

    rollupOptions: {
      /**
       * CloudBolt provides some of this applet's dependencies via an import map.
       * This allows multiple applets to share the same dependencies, users to not
       * have to download the same dependencies multiple times, and for the SSP to
       * centralize the version of dependencies it uses.
       * This configuration shouldn't change unless CloudBolt changes the import map
       * to provide more/fewer/different dependencies.
       */
      external: (id) => /^(vue|vuetify)$/.test(id),
    },
  },
});
