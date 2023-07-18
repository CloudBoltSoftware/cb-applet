import { loadEnv } from "vite";
import load from "load-pkg";
import fs from "fs/promises";

/**
 * This plugin copies built applet files to a temporary folder structure for chrome devtools source overrides.
 *
 * This is a custom plugin for Vite that helps automate dev-mode.
 * Do not modify or remove this file unless you know what you're doing.
 */
export function chromeDevtoolsOverrides(options) {
  let cbUrl = "";
  let xuiName = "";

  return {
    name: "chrome-devtools-overrides",

    // Only run this plugin when building for development.
    apply: (config, { command }) =>
      command === "build" && config.mode === "development",

    enforce: "post",

    /**
     * Fail fast if there is no VITE_CB_URL set or no xui name.
     * @param {import('vite').UserConfig} config
     * @param {import('vite').BuildOptions} options
     */
    async options({ mode }) {
      cbUrl = loadEnv(mode, process.cwd()).VITE_CB_URL;
      try {
        new URL(cbUrl);
      } catch (error) {
        this.error(
          `VITE_CB_URL environment variable is not a valid URL: ${cbUrl}\nAborting. See README.md for more information.`
        );
      }

      const packageJson = (await load()) || {};
      xuiName = packageJson.xuiConfig.name;
      if (!xuiName) {
        this.error(
          `Missing xuiConfig.name in package.json. Aborting. See README.md for more information.`
        );
      }
    },

    /**
     * Copy files.
     * @param {import('rollup').OutputOptions} options
     * @param {Object} bundle
     */
    async writeBundle(options, bundle) {
      const url = new URL(cbUrl);
      const urlAsPath = `${url.host}${url.pathname}`;
      const sourceDir = options.dir;
      const sourceFileNames = Object.keys(bundle);
      const targetDir = `xui/tmp/devtools/${urlAsPath}/static/uploads/applets/${xuiName}/${xuiName}/static/`;

      this.info(`Copying applet files from ${sourceDir} to ${targetDir}`);

      await fs.mkdir(targetDir, { recursive: true });

      const copyPromises = sourceFileNames.map((fileName) => {
        const sourceFilePath = `${sourceDir}/${fileName}`;
        const targetFilePath = `${targetDir}/${fileName}`;
        return fs.copyFile(sourceFilePath, targetFilePath);
      });

      await Promise.all(copyPromises);

      this.info(`Copied ${sourceFileNames.length} files`);
    },
  };
}
