# CB Applet

CB Applets extend the CloudBolt CUI using Vue.js with Vuetify and Syncfusion component libraries. They can target specific pages and areas of the CUI to render custom components. They receive data from the CUI via props, including the current page and area, an authenticated api accessor object, logged in user information, and any contextual data passed back from the CUI.

This project can be used as a starting point for CloudBolt customers who want to develop their own Applets.

## Getting Started

With Node.js installed, clone this repo locally and run `npm install` to install dependencies. Build a production version of the applet with the command `npm run build`. This will create a zip file in the `xui/dist` folder that can be uploaded to CloudBolt via the UI Extensions interface.

If you've never written a Vue.js app before, it is recommended that you read the [Vue.js documentation](https://.vuejs.org/guide/introduction.html) (or at least a little of it) before continuing. It's a powerful, approachable framework that is easy to learn.

Conventions in this project are based on the [Vue.js style guide](https://vuejs.org/style-guide/). It is recommended that you read it before continuing. Though you are welcome to adapt it as you wish, we use the Composition API and the `<script setup>` syntax.

## Development Cycle

After any change, re-build the applet with `npm run build`. Then, upload the zip file to CloudBolt via the UI Extensions interface. Refresh the `cui` to see your changes.

You can put auto-build on changes with the command `npm run build -- --watch`.

The repo has been set up with some basic developer tooling as well:

- [ESLint](https://eslint.org/) for linting (`npm run lint`)
- [Prettier](https://prettier.io/) for code formatting (`npm run format`)
- [Vite](https://vitejs.dev/) for bundling (`npm run build`)

TODO: In the near future, we will support `npm run dev` to create a hot-reloading development environment. To do so, we will add a proper index.html and add `vite dev` to the npm scripts to allow for a standalone dev environment. Alternately, we may create a set of instructions for using native browser dev tools to load the locally created applet from the `dist` folder. Or possibly another approach.
See [One potential approach here](https://vitejs.dev/guide/build.html#library-mode)

### package.json configuration

Near the top of package.json is `xuiConfig`. This is used for metadata in the built Applet zip file. It looks something like this:

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

- Configurable:
  - `name`: Should be unique to this applet and contain only alphanumerics and `-` characters. Used as a programatic reference to the base component name. The page may throw warnings if they are not unique.
  - `id`: **MUST BE UNIQUE** to this applet. It should be in the form `APL-xxxxxxxx` where x alphanumeric. The applet will overwrite any existing applet with the same id. This is used as a programatic reference to the applet.
  - `icon`: The relative path of the icon file to use on the management page in the HUI.
  - `met_description`: The description seen on the management page in the HUI.
  - `met_label`: The label seen on the management page in the HUI.
  - `met_minimum_version_required`: The minimum CloudBolt version compatible with this Applet.
  - `met_maximum_version_required`: The maximum CloudBolt version compatible with this Applet.
  - `met_required_ui_extensions`: The UI extensions required for this Applet to function. See the example above for the required format.
  - `met_targets`: Where you want this applet to be loaded. See the example above and the extra note below.
- Not Configurable (leave as-is):
  - `met_is_applet`: **MUST** be `true`.
  - `met_entry_point`: **MUST** be `static/main.es.js`

#### `met_targets` note

CloudBolt applications interpret this field to determine where to render applets. For the CUI, the following format should be used:

```json
{
  "cui": {
    "pageName": ["target1", "target2"],
    "all": ["target3"]
  }
}
```

In this example, the page called `pageName` will have the applet rendered in the `target1` and `target2` targets. All pages will have the applet rendered in the `target3` target if the page has a `target3`.

There will be a documented list of targets for the CUI in official documentation. However, all targets are discoverable by creating a simple applet that runs console.logs out the `page` and `area` props of the `TheApplet` component and setting the `met_targets` to `{"cui": {"all": ["all"]}}`.

## Repo Contents

### Files

TODO: List main files and what they do
Waiting to document until after implementation is settled.

### Dependencies

TODO: List the dependencies and what they do
Waiting to document until after the implementation is settled.

## Documentation

- [Vue](https://vuejs.org/guide/introduction.html)
- [Vuetify](https://vuetifyjs.com/en/introduction/why-vuetify/#guide)
- [Syncfusion](https://ej2.syncfusion.com/vue/documentation/introduction/)
- [Vite](https://vitejs.dev/guide/)
- [ESLint](https://eslint.org/docs/user-guide/getting-started)
- [Prettier](https://prettier.io/docs/en/index.html)

## Reccomendations for more tools/libraries to use in advanced applets

TODO: Recommend pinia, vitest, etc.
