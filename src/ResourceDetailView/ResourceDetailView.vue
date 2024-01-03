<template>
  <ConditionalExample :api="api" :resource="currentResource" />
  <ApiExamples :api="api" :resource="currentResource" />
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import ApiExamples from "./ApiExamples.vue";
import ConditionalExample from "./ConditionalExample.vue";
/**
 * Recommend starting at src/MainView/MainView.vue for a more in-depth explanation of component parts
 */

/**
 * @typedef {object} resource
 * @property {string} resource.name - The name of the current resource
 * @property {string} resource.id - The global id of the current resource
 */

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.context - Individual Applet targets might pass in contextual information that only makes sense for applets in that context.
 * @property {resource} Props.context.resource - Basic info for the current resource which is passed to the applet context at resource targets
 */

/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  /**
   * Additional contextual information for an applet in a Resource panel. Contains the current resource info
   **/
  context: {
    type: Object,
    default: () => ({}),
  },
});

/**
 * Using the resource id prop provided we will fetch and store the resource to a ref that will be updated by api call
 */
const currentResource = ref({});
async function fetchResource() {
  const resource = props.context?.resource;
  if (!resource) return;
  try {
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.v3.cmp.resourcesStructured.get(
      resource.id,
      {
        attributes: "grouped_attributes,server.power_status,id",
      }
    );
    // Logging and saving the combined props resource and response to our local ref
    console.log("Fetch resource response:", { ...resource, ...response });
    currentResource.value = { ...resource, ...response };
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
  }
}
// Run the function when the component is mounted.
onMounted(fetchResource);
</script>
