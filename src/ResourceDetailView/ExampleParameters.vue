<template>
  <ApiActionButton
    text="Fetch Parameters"
    :button-action="fetchResourceParameters"
  />
</template>

<script setup>
import { defineEmits, ref } from "vue";
import ApiActionButton from "./ApiActionButton.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.resourceId - The Id of the current resource
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
});
// Duplicated emit code snippet. See ExampleWebhook
const emit = defineEmits(["update:responseLoading", "update:lastResponse"]);

const parametersList = ref();
async function fetchResourceParameters() {
  try {
    // Emitting an update to the shared `apiResponseLoading` ref to indicate the start of the api request
    emit("update:responseLoading", true);

    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.v3.cmp.resourcesStructured.get(
      props.resourceId,
      { attributes: "grouped_attributes" }
    );
    // Emitting to indicate the api request is done
    emit("update:responseLoading", false);
    // Logging the api response
    console.log("fetchResourceParameters", { response });

    // Filter response for the information we are specifically interested in
    const attributesList = response.groupedAttributes.filter(
      (entry) => entry.name === "parameters"
    )[0].attributes;

    // Storing the filtered response to ref for potential future use
    // When referencing `ref`s or `computed`s in the `script` section, you need to use `.value`.
    // This isn't necessary in the template - you can directly use `version` and `versionLoading` there.
    // https://vuejs.org/api/reactivity-core.html#ref
    parametersList.value = attributesList;

    // Emitting an update the shared `lastResponse` ref with this latest api response
    emit("update:lastResponse", attributesList);
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
