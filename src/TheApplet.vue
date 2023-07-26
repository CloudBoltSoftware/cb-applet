<!-- 
  The `template` is where you write vue-powered HTML
  https://vuejs.org/guide/essentials/template-syntax.html
-->
<template>
  <!-- 
    Vue templates have a couple of super-powers over regular HTML.
    
    The first here is a custom component NavbarView (imported in <script setup> below). This
    one is simple, but you can build up complex UIs with nested components with internal states.
      
    The second used here is the vue directive `v-if`. This is a conditional that only renders 
    the element if the condition is true. In this case, we're only rendering the NavbarView 
    component if the area includes "Nav".
    (we'll get to the `area` prop in the below `script` section)
   -->
  <NavbarView v-if="area.includes('Nav')" />

  <!-- 
    v-else-if is v-if's counterpart, rendering if the v-if resolves to `false`
    You can add directives to normal HTML elements too, like this div.

    In this case, we're just rendering an empty div if the ref "removed" is true.
    (see MainView.vue for more information on refs - they're vue's reactive variables)
   -->
  <div v-else-if="removed" />

  <!-- 
    Applets have access to any Vue component library you'd like to add. We suggest Vuetify,
    which is included here and in the CUI and will make your applet look at home in the CUI.
    It has a lot of great components, including this loading indicator.
    See more in Vuetify's Documentation: https://vuetifyjs.com/en/components/progress-circular/

    This class (ma-3) is a Vuetify utility class that adds some spacing.
    Vuetify is a great UI library that's included in the CUI.
    For more information on this class and others: https://vuetifyjs.com/en/styles/spacing/
   -->
  <VProgressCircular v-else-if="loading" indeterminate class="ma-3" />

  <!-- 
    v-else is v-if's other counterpart, rendering if the v-if and v-if-else's all resolve to `false`
  -->
  <div v-else class="ma-3">
    <!-- We're binding the api prop to MainVue (see more in the `script` section and in MainView.vue) -->
    <MainView :api="api" />
    <!-- We're binding the api and context prop to ResourceDetailView and conditionally rendering on resource detail tabs-->
    <ResourceDetailView
      v-if="area.includes('tab') && page.includes('resourceDetailsTabs')"
      :api="api"
      :context="context"
    />
  </div>
</template>

<!--
  The `script` is where you write your javascript, defining any imports and interactivity
  This is using the "setup" syntax: https://vuejs.org/api/sfc-script-setup.html 
-->
<script setup>
/**
 * Import any libraries, assets, and other components you'd like to use.
 * The <script setup> syntax automatically imports defineProps and other defineStuff macros.
 * Everything else should be explicitly imported to make sure everything is bundled correctly.
 */
import { onUnmounted, ref } from "vue";
import { VProgressCircular } from "vuetify/lib/components/index.mjs";
import MainView from "./MainView/MainView.vue";
import NavbarView from "./NavbarView/NavbarView.vue";
import ResourceDetailView from "./ResourceDetailView/ResourceDetailView.vue";
/**
 * Note the current folder and file structure has been created for this example (organized around the view).
 * Please feel free to adjust this as you create your own applet
 * Just make sure that the component imports still correctly reference the right files
 */

/**
 * JSDoc is a great way to document your code and help your IDE provide better autocomplete.
 * https://jsdoc.app/
 *
 * It's used here to define the props that CloudBolt passes to your applet. This will give you
 * autocomplete for the props in your IDE. This is especially helpful for `user` and `api` that
 * have nested properties.
 *
 * @typedef {object} Props
 * @property {User} Props.user - User details
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {string} Props.page - The currently loaded page name
 * @property {string} Props.area - The page area where the component is being rendered
 * @property {object} Props.context - Individual Applet targets might pass in contextual information that only makes sense for applets in that context.
 */

/**
 * @typedef {object} User
 * @property {string} user.username - The user's username
 * @property {string} user.email - The user's email address
 * @property {string} user.firstName - The user's first name
 * @property {string} user.lastName - The user's last name
 * @property {string} user.id - The user's id
 * @property {string} user.globalId - The user's global id
 * @property {boolean} user.cmpAdmin - Whether the user is a CMP admin
 * @property {boolean} user.globalViewer - Whether the user is a global viewer
 */

/**
 * Props are how Vue components pass data down the heirarchy.
 *
 * CloudBolt provides these props when loading this component.
 * https://vuejs.org/guide/components/props.html
 * @type {Props}
 */
const props = defineProps({
  /**
   * User details (as a pinia store instance)
   * (see https://pinia.vuejs.org/introduction.html for more information on pinia stores)
   * See the in-ide documentation, the above JSDoc typedef, or console.log the prop for more details.
   */
  user: {
    type: Object,
    default: () => ({}),
  },

  /**
   * The authenticated API instance
   * Use this in the `script` section to make API calls as the logged-in user.
   * It has full in-ide autocomplete. See https://github.com/CloudBoltSoftware/api-helper/.
   *
   */
  api: {
    type: Object,
    required: true,
  },

  /**
   * The currently loaded page name
   * You can use this and `v-if` in the template to render different content on different pages.
   */
  page: {
    type: String,
    required: true,
  },

  /**
   * The page area where the component is being rendered
   * You can use this and `v-if` in the template to render different content in different areas.
   * In a few cases (like Resource Detail Tab Applets), it's not used at all.
   */
  area: {
    type: String,
    default: "",
  },

  /**
   * Theme Information (as a pinia store instance)
   * (see https://pinia.vuejs.org/introduction.html for more information on pinia stores)
   * console.log the prop for more details.
   */
  theme: {
    type: Object,
    default: () => ({}),
  },

  /**
   * Individual Applet targets might pass in contextual information that only makes sense for
   * applets in that context. For example, an applet in a Resource panel may receive the
   * resource id. console.log(props.context) to see what's available for your applet.
   **/
  context: {
    type: Object,
    default: () => ({}),
  },
});

/**
 * You can use these props like you'd use regular JS variables.
 * However, they won't be reactive to any changes they receive. Read more about that in MainView.vue.
 * Any code run at this level will only run once when the applet is loaded.
 */
console.log(
  `This applet is being loaded on the ${props.page} page in the ${props.area} area by ${props.user.username}`
);

/**
 * While props are how data is passed down the heirarchy, events are how data is passed up.
 * You can emit events from components and listen for them in the parent component.
 * Think of them as custom version of HTML Dom events, like click or mouseover.
 * https://vuejs.org/guide/essentials/event-handling.html
 *
 * Just like there's a set of props that CloudBolt passes into Applets, there's a set of events
 * that Applets can emit that CloudBolt listens for. Currently, there is only one event:
 */
const emit = defineEmits([
  /**
   * This is used to configure the applet's tab and other content related to this applet. This is
   * the counterpoint to the `context` prop. It's useful for running arbitrary code in context to
   * determine if the applet should be configured, possibly asynchronously.
   *
   * This event takes one configuration object as an argument. The expected values can change depending
   * on the page and area. To discover the possible values, emit `configure` event without an argument.
   *
   * A notable use of this is with the page ResourceDetailsTabs. The configuration object can include:
   * - `loadingTab`: A boolean to indicate if the applet's tab is loading (defaults to false)
   * - `visibleTab`: A boolean to indicate if the applet's tab is visible (defaults to true)
   */
  "configure",
]);

/**
 * Example for how to emit the configure event. (uses `ref` - read more about that in MainView.vue)
 * Change shouldRemove to `true` to see it in action.
 */
const shouldRemove = false;

// Set up some variables
const removed = ref(false);
const loading = ref(false);
const delay = 5 * 1000;
const removeTimeout = ref(null);

// See what values are expected for the target/page by emitting it without an argument
// The result will appear in the page's console.
emit("configure");

// Trigger the remove event after a delay
if (shouldRemove) {
  // Set up the loading indicator
  emit("configure", { loadingTab: true });
  loading.value = true;

  removeTimeout.value = setTimeout(() => {
    console.log(`Removing the applet's tab after a ${delay}ms Delay!`);
    emit("configure", { loadingTab: false, visibleTab: false });
    loading.value = false;
    removed.value = true;
  }, delay);
}
onUnmounted(() => clearTimeout(removeTimeout.value));
</script>
