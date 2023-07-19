<template>
  <ApiActionButton
    text="Run Inbound Webhook"
    disabled-text="Update Webhook ID to enable"
    :button-action="fetchInboundWebHook"
    :disabled="!Boolean(webHookId)"
  />
</template>

<script setup>
import { defineEmits } from "vue";
import ApiActionButton from "./ApiActionButton.vue";

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
 * This emit code snippet will be repeated in all the API Examples
 * Emits allow the nested component to communicate values to the parent component
 * The emits are named in the `defineEMits` statement,
 * then called by the correct name and passed the relevant values to be handled in the parent component
 */
const emit = defineEmits(["update:responseLoading", "update:lastResponse"]);
/**
 * Use the ID provided by the URL of your webhook (Start at /actions/inbound_web_hooks/).
 * Ex. /api/v3/cmp/inboundWebHooks/IWH-f7gfst8e/run/ results in webHookId = 'IWH-f7gfst8e'
 * Using the ref here allows disabling the ApiActionButton component when value is not set
 */
const webHookId = "IWH-f7gfst8e";
async function fetchInboundWebHook() {
  try {
    /**
     * Webhook ID must be correctly set for this function to work.
     * Optional Parameters Object where you can pass whatever object you need for your webhook
     * The current value key is just an example.
     * Data current not available to this component can be passed in as props to be included here.
     */
    const options = { value: "Your parameters" };
    // Emitting an update to the shared `apiResponseLoading` ref to indicate the start of the api request
    emit("update:responseLoading", true);
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const webHook = await props.api.v3.cmp.inboundWebHooks.runGet(
      webHookId,
      options
    );
    // Emitting an update to the shared `apiResponseLoading` ref to indicate the api request finished
    emit("update:responseLoading", false);
    // Logging the response for this example
    console.log({ webHook });
    // Emitting an update the shared `lastResponse` ref with this latest api response
    emit("update:lastResponse", webHook);
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
    // If the api fetch errors, its good to update the shared `apiResponseLoading` ref to indicate it is cancelled
    emit("update:responseLoading", false);
  }
}
</script>

<!-- These styles won't affect anything outside this component -->
<style scoped></style>
