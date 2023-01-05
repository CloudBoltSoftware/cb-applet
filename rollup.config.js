import vue from "rollup-plugin-vue";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import camelCase from "camelcase";

// The name of the applet from package.json in PascalCase.
const options = { pascalCase: true };
const pascalPackageName = camelCase(process.env.npm_package_name, options);

export default {
  // The main component that contains all the applet functionality.
  input: "src/Main.vue",

  output: {
    // Global variables that are available in the CUI.
    globals: { vue: "vue" },

    // global variable name for the exported iife and umd bundles.
    name: pascalPackageName,
  },

  plugins: [
    // Vue plugin. See for more information:
    // https://rollup-plugin-vue.vuejs.org/options.html
    vue(/* options */),

    // Resolves node modules. See for more information:
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    nodeResolve(),
  ],
};
