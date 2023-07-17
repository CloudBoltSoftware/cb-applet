<template>
  <!-- We're using v-if again here to show a loading spinner if the api is loading -->
  <VProgressCircular v-if="versionLoading" indeterminate />
  <!-- Otherwise we'll show the product version using double-curly-braces -->
  <p v-else>CloudBolt Version: {{ version }}</p>
</template>

<script setup>
/**
 * Vuetify has a rich ecosystem of pre-built components that you can use in your applets.
 * We use them throughout the CloudBolt UI, so they'll help your applet fit in.
 * This one in particular is a simple loading spinner.
 * https://vuetifyjs.com/en/components/progress-circular/
 */
import { onMounted, ref } from "vue";
import { VProgressCircular } from "vuetify/components";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
});

/**
 * Lets use a combination of what we learned in TheApplet.vue to load and report the CloudBolt version
 * when the applet loads. We'll use the `api` prop to make an API call to get the version.
 * We'll also use a few refs to reactively store the version and loading state.
 *
 * You can see the template above uses the version and versionLoading refs. Because they're
 * refs rather than bare variables, Vue will automatically update the DOM when they change.
 */
const version = ref();
const versionLoading = ref(false);
async function fetchVersion() {
  try {
    // When referencing `ref`s or `computed`s in the `script` section, you need to use `.value`.
    // This isn't necessary in the template - you can directly use `version` and `versionLoading` there.
    // https://vuejs.org/api/reactivity-core.html#ref
    versionLoading.value = true;

    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const productInfo = await props.api.v3.cmp.productInfo.getProductInfo();

    // Set the version ref to the version we got from the API.
    version.value = productInfo.version;

    // Set the loading ref back to false.
    versionLoading.value = false;
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
  }
}

// Run the function when the component is mounted.
onMounted(fetchVersion);
</script>

<!-- These styles won't affect anything outside this component -->
<style scoped>
p {
  font-size: 1.5em;
  color: red;
}
</style>
