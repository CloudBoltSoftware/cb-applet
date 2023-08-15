<template>
  <NavbarView v-if="area.includes('Nav')" />
  <div v-else-if="removed" />
  <VProgressCircular v-else-if="loading" indeterminate class="ma-3" />
  <div v-else class="ma-3">
    <S3Widget :api="api" :context="context" />
  </div>
</template>

<script setup>
import { onUnmounted, ref } from "vue";
import { VProgressCircular } from "vuetify/lib/components/index.mjs";
import NavbarView from "./NavbarView/NavbarView.vue";
import S3Widget from "./S3Bucket/S3Widget.vue";

/**
 * JSDoc is a great way to document your code and help your IDE provide better autocomplete.
 * https://jsdoc.app/
 * @typedef {Object} Props
 * @property {User} Props.user - User details
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {String} Props.page - The currently loaded page name
 * @property {String} Props.area - The page area where the component is being rendered
 * @property {Object} Props.context - Individual Applet targets might pass in contextual information that only makes sense for applets in that context.
 */

/**
 * @typedef {Object} User
 * @property {String} user.username - The user's username
 * @property {String} user.email - The user's email address
 * @property {String} user.firstName - The user's first name
 * @property {String} user.lastName - The user's last name
 * @property {String} user.id - The user's id
 * @property {String} user.globalId - The user's global id
 * @property {Boolean} user.cmpAdmin - Whether the user is a CMP admin
 * @property {Boolean} user.globalViewer - Whether the user is a global viewer
 */

/**
 * Props are how Vue components pass data down the heirarchy.
 *
 * CloudBolt provides these props when loading this component.
 * https://vuejs.org/guide/components/props.html
 * @type {Props}
 */
defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  api: {
    type: Object,
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    default: "",
  },
  theme: {
    type: Object,
    default: () => ({}),
  },
  context: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
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
