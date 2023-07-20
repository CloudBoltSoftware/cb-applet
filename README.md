# CB Applet

CB Applets extend the CloudBolt UI using Vue.js with Vuetify component library. Currently these only work for the Consumer UI (aka CUI). Applets can target multiple/specific areas/pages to render custom components. They receive data from CloudBolt via props and are developed using modern, standard UI development workflows.

This project can be used as a starting point for CloudBolt customers who want to develop their own Applets.

## Getting Started

1. Install Node.js (see `.nvmrc` for the recommended version).
1. Create a copy of this repo. Three options:
   - Create a local clone of this repo
   - Use [Github's template feature](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) to create a new repo
   - [Fork this repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo) to create a new linked repo. (This is recommended in order to easily receive future changes from this repo) 
1. Run `npm install` to install dependencies.
1. Set a unique name and ID for the applet in `package.json` (see the [Metadata Configuration](#metadata-packagejson-configuration) section below).
1. Build a production version of the applet with the command `npm run build`.
1. Upload the built zip from the `xui/dist` folder to CloudBolt in the Admin UI Extensions interface.
1. Visit the CUI to see your new Applet at the top of the page. Congratulations! You've built and installed a CB Applet from scratch!

## Customizing the Applet

The main component is [TheApplet.vue](./src/TheApplet.vue). Start there to see some inline documentation for the highlights of CB Applets and Vue features. If you've never written a Vue app before, reference the [Vue.js documentation](https://.vuejs.org/guide/introduction.html) as you go. It's a powerful, approachable framework that is easy to learn.

Conventions in this project are based on the [Vue.js style guide](https://vuejs.org/style-guide/) using the Composition API and the `<script setup>` syntax. This is vue's recommended approach for new projects.

## Development

Build the applet with `npm run build`. Then, upload the zip file to CloudBolt via the UI Extensions interface. Refresh the `cui` to see your changes.

### Dev Mode

When developing, it's useful to have the applet auto-build and to see your changes locally without having to upload the zip to CloudBolt or affect other users. This workflow replaces a live version of the applet with a local version using Chrome's devtools.

Prerequisites:

- Google Chrome
- An environment variable "VITE_CB_URL" set to the url for your cloudbolt instance. The easiest way to do this is by creating a file in this project root called `.env.local` with the line: `export VITE_CB_URL=https://my.cloudbolt.url`
- A version of this applet must be uploaded to CloudBolt and enabled for your user.

Run the script `npm run build:dev`. This watches for file changes and auto-builds the applet when changes are saved. It then copies files to subfolders in `xui/src/tmp/devtools`. To use use these files:

1. In Chrome, navigate to the CUI.
1. Open the devtools and navigate to the Sources tab's Overrides panel.
1. Click "Select folder for overrides".
1. Select the `xui/src/tmp/devtools` folder.
1. Click "Allow" when prompted.
1. Navigate to the CUI and refresh the page.

You should see your local version of the applet. You can now make changes to the applet and see them reflected in the CUI upon a page refresh without having to upload a new zip to CloudBolt.

See [this article](https://developer.chrome.com/blog/new-in-devtools-65/#overrides) for more information on how Chrome overrides work.

NOTE: This does not automatically upload the applet to CloudBolt. You will need to do that manually once you are done with your changes.

### Development Tooling

The repo has been set up with some basic developer tooling as well:

- Dev Mode (see above) (`npm run build:dev [url]`)
- [ESLint](https://eslint.org/) for linting (`npm run lint`)
- [Prettier](https://prettier.io/) for code formatting (`npm run format`)
- [Vite](https://vitejs.dev/) for bundling (`npm run build`)

### Metadata (package.json) configuration

Near the top of package.json is `xuiConfig`. This is used for metadata in the built Applet zip file. Some fields should not be changed for xui bundling to work - others must be updated for each new Applet. A fragment of the file looks something like this:

```json
{
  ...
  "xuiConfig": {
    "name": "cui-applet",
    "id": "APL-12345678",
    "icon": "xui/cui-applet.png",
    "met_description": "Hello World applet for extending the CloudBolt CUI",
    "met_label": "CUI Applet Hello World",
    "met_is_applet": true,
    "met_entry_point": "static/main.es.js",
    "met_maximum_version_required": "",
    "met_minimum_version_required": "2023.1.1",
    "met_required_ui_extensions": [
      {
        "name": "cui",
        "minimum_version": "2023.1.0",
        "maximum_version": ""
      }
    ],
    "met_targets": {
      "cui": {
        "resourceDetail": [
          "postActions"
        ],
        "all": [
          "preNavItems",
          "header"
        ]
      }
    }
  },
}
```

Fields of note:

- Configurable Fields:
  - `name`: Should be unique to this applet and contain only alphanumerics and `-` characters. Used as a programatic reference to the base component name. The page may throw warnings if they are not unique.
  - `id`: **MUST BE UNIQUE** to this applet. It should be in the form `APL-xxxxxxxx` where x is alphanumeric. The applet will overwrite any existing applet with the same id when uploading applets. This is used as a programatic reference to the applet.
  - `icon`: The relative path of the icon file to use on the management page in the HUI.
  - `met_description`: The description seen on the management page in the HUI.
  - `met_label`: The label seen on the management page in the HUI.
  - `met_minimum_version_required`: The optional minimum CloudBolt version compatible with this Applet.
  - `met_maximum_version_required`: The optional maximum CloudBolt version compatible with this Applet.
  - `met_required_ui_extensions`: The UI extensions required for this Applet to function. See the example above for the required format (NOTE: versions are optional).
  - `met_targets`: Which applications, pages, and page areas you want to load this applet. See the example above and the extra note below. \*
- Non-Configurable Fields (leave as-is):
  - `met_is_applet`: **MUST** be `true`.
  - `met_entry_point`: **MUST** be `static/main.es.js`

#### \* `met_targets` note

CloudBolt applications interpret this field to determine where to render applets. The CUI uses the following format:

```json
{
  "cui": {
    "pageName": ["target1", "target2"],
    "anotherPageName": ["all"],
    "all": ["target3"]
  }
}
```

In this example, the page called `pageName` will render in the `target1` and `target2` targets. the page called `anotherPageName` will render the applet in all targets. All pages will have the applet rendered in the `target3` target if the page has a `target3`. This is especially useful for cross-app additions, like footers or navigation items added to every page.

There will be a list of targets for the CUI in official documentation. However, all targets are discoverable by creating a simple applet that runs console.logs out the `page` and `area` props of the `TheApplet` component and setting the `met_targets` to `{"cui": {"all": ["all"]}}`.

One exception to this target discoverability is represented by this example:

```json
{
  "cui": {
    "resourceDetailsTabs": [
      {
        "resourceTypes": ["service"],
        "label": "Additional Info"
      }
    ]
  }
}
```

`resourceDetailsTabs` is a special target that will render the applet as a tab on the resource details page. It should be an array of a single configuration object with two optional fields:

- `resourceTypes` is an array of resource type names that the tab should be rendered for (defaults to `['all']`).
- `label` is the label that will be displayed on the tab (defaults to the applet's `met_label`).

## Repo Contents

### Files

- `dist`: The output of Vite's build process.
- `node_modules`: The output of `npm install`.
- `src`: The source code for the applet.
  - `plugins`: Any plugin configuration. Starts with a single custom Vite plugin to automate bundling the xui.
  - `TheApplet.vue`: The main applet component.
  - `NestedComponent.vue`: A component that is nested inside the main applet component.
- `xui`:
  - `dist`: The output of the xui bundling process. The zip in here is what you upload to CloudBolt.
  - `src`: Used as a staging directory when bundling the xui.
- `.eslintrc.js`: Configuration for ESLint.
- `.gitignore`: Files to ignore in git.
- `.nvmrc`: Node version information.
- `index.html`: The HTML used by Vite for dev mode (not used in the bundled applet).
- `jsconfig.json`: Configuration for VSCode's intellisense.
- `package.json`: Configuration for npm and the xui metadata.
- `package-lock.json`: Lock file for npm (don't edit this directly).
- `README.md`: This file.
- `vite.config.js`: Configuration for Vite.

### Dependencies

We use a few libraries to make development easier and add features to the applet. These are listed in `package.json` ande are installed with `npm install ...`. The most important ones are:

- `vuetify`: [Vuetify](https://vuetifyjs.com/en/introduction/why-vuetify/#guide) component library. Community-level components.
- `vue`: [Vue](https://vuejs.org/guide/introduction.html) Used to build the applet.
- `vite`: [Vite](https://vitejs.dev/guide/) Used to build the applet.
- `eslint`: [ESLint](https://eslint.org/docs/user-guide/getting-started) Linting to help keep code clean. Run it with `npm run lint`.
- `prettier`: [Prettier](https://prettier.io/docs/en/index.html) Code formatting to help keep code clean. Run it with `npm run format`.
- `@cloudbolt/js-sdk`: [CloudBolt JS SDK](https://github.com/CloudBoltSoftware/js-sdk) A library to make API calls to CloudBolt easier.

In addition to these, you're welcome to add anything you want to the applet or the development environment. Some recommendations are:

- `pinia`: [Pinia](https://pinia.esm.dev/) A Vue state management library for complex application state.
- `vitest`: [Vitest](https://vitest.dev/) A fast testing suite that re-uses the vite setup and is api-compatible with Jest.
