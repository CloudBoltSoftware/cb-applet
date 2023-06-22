<!-- 
  The `template` is where you write vue-powered HTML
  https://vuejs.org/guide/essentials/template-syntax.html
-->
<template>
  <!-- 
    Vue templates have a couple of super-powers over regular HTML. The first used here is `v-if`.
    This is a conditional that only renders the element if the condition is true.
    In this case, we're only rendering the "HelloWorld in the Navbar" message if the area includes "Nav".
    (we'll get to the `area` prop in the below `script` section)
   -->
  <div class="ml-4" v-if="area.includes('Nav')">HelloWorld in the Navbar</div>

  <!-- v-else is v-if's counterpart, rendering if the v-if resolves to `false` -->
  <div v-else>
    <h2>CB Applet Hello World Example</h2>
    <p>
      This is a simple example of a CloudBolt Applet. It's a Vue component that
      is loaded into the CloudBolt UI and can be used to add functionality to
      CloudBolt.

      <!-- 
        Use double-curly-braces to render a variable from the `script` section in the template. 
        You can use any valid javascript expression in the double-curly-braces.
       -->
      {{ message + "!" }}
    </p>

    <!-- 
      If you prepend an attribute with `:` (short for `v-bind:`), vue will treat the attribute's
      value as javascript. This loads the imageUrl as imported in the below `script` section.
    -->
    <img :src="imageUrl" alt="CloudBolt logo" />
    <p>Time: {{ time }}</p>

    <!-- 
      One of the other main super-powers of Vue templates is its composability. You can nest
      components inside of each other to build up complex UIs. This is a nested component that
      is defined in the `src/NestedComponent.vue` file. It has its own internal state and props.
      We're passing in the `api` prop from this component to the nested component.
     -->
    <NestedComponent :api="api" />
  </div>
</template>

<!--
  The `script` is where you write your javascript, defining any imports and interactivity
  This is using the "setup" syntax: https://vuejs.org/api/sfc-script-setup.html 
-->
<script setup>
/**
 * Import any libraries, assets, and other components you'd like to use.
 * The <script setup> syntax automatically imports defineProps and other define* macros.
 * Everything else should be explicitly imported to make sure everything is bundled correctly.
 */
import camelCase from "camelCase";
import {
  computed,
  defineProps,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
} from "vue";
import NestedComponent from "./NestedComponent.vue";
import imageUrl from "./assets/cb_logo_255x60.png";

/**
 * You can use any third-party library you'd like to install via npm
 * Any libraries you import and use get bundled into the applet.
 */
const greeting = camelCase("hello-world");
// Everything defined in <script setup> (like this normal variable) is available in the template above.
const message = `The string "${greeting}" is processed by an installed npm package`;

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
   * User details
   * See the in-ide documentation or the above JSDoc typedef for more details.
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
   */
  area: {
    type: String,
    required: true,
  },

  /**
   * Individual Applet targets might pass in contextual information that only makes sense for applets in that context.
   * For example, an applet in a Resource panel may receive the resource id. Console.log(props.context) to see what's
   * available for your applet.
   **/
  context: {
    type: Object,
    default: () => ({}),
  },
});

/**
 * You can use these props like you'd use regular JS variables.
 * However, they won't be reactive to any changes they receive. We'll get to that next.
 */
console.log(
  `This applet is being loaded on the ${props.page} page in the ${props.area} area by ${props.user.username}`
);

/**
 * The only problem with the above code is that it's not reactive. If I were to change the value of props.page,
 * the console.log wouldn't run again or understand that props.page has changed since the applet first loaded.
 *
 * Vue provides a few ways to make values reactive. The two most common are:
 *  - `ref` - a reactive value that can be changed. https://vuejs.org/guide/essentials/reactivity-fundamentals.html
 *  - `computed` - a reactive value that is derived from other reactive values. https://vuejs.org/guide/essentials/computed.html
 *
 * The vue documentation is excellent and worth reading, but let's explore this with a simple example.
 */

// create a reactive value, initialized to the current date and time
const currentDateTime = ref(new Date());
// Create a computed value by defining a function that returns the current time as a string
const time = computed(() => currentDateTime.value.toLocaleTimeString());
// We  reference `time` in the template above.

// Let's update the time every second.
function updateCurrentDateTime() {
  currentDateTime.value = new Date();
}
const timeUpdateInternal = setInterval(updateCurrentDateTime, 1000);
// As the time changes, the template will update to reflect the new value.

/**
 * Vue also provides lifecycle hooks to run code at different points in the component's lifecycle.
 * These can be used to load data, set up event listeners, clean up, etc.
 * See https://vuejs.org/guide/essentials/lifecycle.html#registering-lifecycle-hooks
 */
console.log("I run on setup");
onBeforeMount(() => console.log("I run before the component is mounted"));
onMounted(() => console.log("I run after the component is mounted"));
onBeforeUpdate(() => console.log("I run before the component is updated"));
onUpdated(() => console.log("I run after the component is updated"));
onBeforeUnmount(() => console.log("I run before the component is unmounted"));
onUnmounted(() => console.log("I run after the component is unmounted"));

// Let's use one of these to clean up the interval we created earlier when we unmount the component.
onUnmounted(() => clearInterval(timeUpdateInternal));
</script>

<!-- The `style` is where you write your CSS. "scoped" styles only apply to this component. -->
<style scoped>
h2 {
  color: #1e88e5;
}
</style>
