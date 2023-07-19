<template>
  <ApiActionButton
    text="Fetch Server Labels"
    :button-action="fetchServerLabels"
    disabled-text="Labels available for server only"
    :disabled="!isServer"
  />
</template>

<script setup>
import { defineEmits, ref } from "vue";
import ApiActionButton from "./ApiActionButton.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {string} Props.resourceId - The Id of the current resource
 * @property {boolean} Props.isServer - Boolean describing if the current resource is a server. Enables button
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  resourceId: {
    type: String,
    required: true,
  },
  isServer: {
    type: Boolean,
    default: false,
  },
});

// Duplicated emit code snippet. See ExampleWebhook
const emit = defineEmits(["update:responseLoading", "update:lastResponse"]);

const serverLabels = ref();
async function fetchServerLabels() {
  try {
    // Emitting an update to the shared `apiResponseLoading` ref to indicate the start of the api request
    emit("update:responseLoading", true);

    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.v3.cmp.servers.get(props.resourceId);
    // Emitting to indicate the api request is done
    emit("update:responseLoading", false);
    // Logging the full response for this example
    console.log("fetchServerLabels", { response });

    // Storing the labels response to ref for potential future use
    // When referencing `ref`s or `computed`s in the `script` section, you need to use `.value`.
    // This isn't necessary in the template - you can directly use `version` and `versionLoading` there.
    // https://vuejs.org/api/reactivity-core.html#ref
    serverLabels.value = response.labels;

    // Emitting an update the shared `lastResponse` ref with this latest api response
    emit("update:lastResponse", response.labels);
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
    // If the api fetch errors, its good to update the loader to indicate it has cancelled
    emit("update:responseLoading", false);
  }
}
</script>

<!-- These styles won't affect anything outside this component -->
<style scoped></style>
