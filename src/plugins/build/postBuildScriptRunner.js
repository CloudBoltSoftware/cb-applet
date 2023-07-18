import { spawn } from "child_process";

/**
 * Run a script after each build. This works on all changes with build --watch too.
 *
 * This is a custom plugin for Vite that helps automate some build-time tasks.
 * Do not modify or remove this file unless you know what you're doing.
 *
 * @param {object} options
 * @param {string} options.script terminal script to run after each build
 * @param {string} [options.apply='build'] vite plugin apply option
 * @param {string} [options.enforce='post'] vite plugin enforce option
 * @param {string} [options.hook='writeBundle'] vite plugin hook option
 */
export function postBuildScriptRunner(options) {
  return {
    name: "post-build-plugin",
    apply: options.apply || "build",
    enforce: options.enforce || "post",
    // By default, run on the writeBundle hook. This is after each build has written
    // its files to disk. This ensures all the `dist` files are available to the script.
    async [options.hook || "writeBundle"]() {
      this.info(`Running post build script: "${options.script}"`);
      const [command, ...args] = options.script.split(" ");
      const child = spawn(command, args, { stdio: "inherit" });
      child.on("error", (error) => console.error(error));
      child.on("close", (code) =>
        this.info(
          `post build script "${options.script}" exited with code ${code}`
        )
      );
    },
  };
}
