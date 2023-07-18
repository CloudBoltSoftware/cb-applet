<template>
  <!-- 
    VCard comes from Vuetify: https://vuetifyjs.com/en/components/cards/
    and provide a great way to wrap related content together
    max-width and the vuetify margin class "mb-2" provide simple css customization
  -->
  <VCard
    :loading="apiResponseLoading"
    title="API Examples"
    max-width="25%"
    class="mb-2"
  >
    <VCardActions class="d-flex flex-column">
      <!-- API Example for Inbound Webhooks -->
      <SimpleButton
        text="Fetch Inbound Webhook"
        disabled-text="Update Webhook ID to enable"
        :button-action="fetchInboundWebHook"
        :disabled="!Boolean(webHookId)"
      />
    </VCardActions>
  </VCard>
</template>

<script setup>
/**
 * Here we are using our custom SimpleButton in multiple iterations
 */
import { ref } from "vue";
import SimpleButton from "./SimpleButton.vue";

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
 * Similar to the first NestedComponent, we'll use the `api` prop to make a variety of API calls.
 * We'll also reactively store the loading state while each call is fetching.
 * Each call will be handled separately and triggered by their individual buttons.
 */
const apiResponseLoading = ref(false);

// Use the ID provided by the URL of your webhook.
// Ex. /api/v3/cmp/inboundWebHooks/IWH-f7gfst8e/run/ results in webHookId = 'IWH-f7gfst8e'
// Using the ref allows disabling the SimpleButton component when value is not set
const webHookId = "";
async function fetchInboundWebHook() {
  try {
    // Webhook ID must be correctly set for this function to work.
    // Optional Parameters Object
    const options = { value: "Your parameters" };
    apiResponseLoading.value = true;
    // Another Async call to the api
    // Use `.then()` and `.catch()` to handle the response
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const webHook = await props.api.v3.cmp.inboundWebHooks.runGet(
      webHookId,
      options
    );
    // Logging the response for this example
    console.log({ webHook });
    apiResponseLoading.value = false;
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
  }
}
</script>

<!-- These styles won't affect anything outside this component -->
<style scoped></style>
