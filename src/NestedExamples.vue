<template>
  <!-- 
    VCard comes from Vuetify: https://vuetifyjs.com/en/components/cards/
    and provide a great way to wrap related content together
    max-width and the vuetify margin class "mb-2" provide simple css customization
  -->
  <VCard
    :loading="apiResponseLoading"
    title="API Examples"
    max-width="50%"
    class="mb-2"
  >
    <VCardText>
      Last API Response:
      <p v-if="lastResponseDisplay" class="code_block" >{{lastResponseDisplay}}</p>
    </VCardText>
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
import { computed, ref } from "vue";
import SimpleButton from "./SimpleButton.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.resource - The resource context provided to the component
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  resource: {
    type: Object,
    required: true,
  }
});

/**
 * Similar to the first NestedComponent, we'll use the `api` prop to make a variety of API calls.
 * We'll also reactively store the loading state while each call is fetching.
 * Each call will be handled separately and triggered by their individual buttons.
 */
const apiResponseLoading = ref(false);
/**
 * Our component displays the last api call by using a reactive `ref` that is updated by each api call
 * The `computed` display value reacts to the changes of the ref to compose the text to display
 */
const lastResponse = ref()
const lastResponseDisplay = computed(() => JSON.stringify(lastResponse.value))
/**
 * To identify and work with the resource provided, we will pull specific attributes from the resource prop.
 */
const resourceId = computed(() => props.resource.id)
const resourceIsServer = computed(() => props.resource.rawType === 'SERVER')

/**
 * Use the ID provided by the URL of your webhook.
 * Ex. /api/v3/cmp/inboundWebHooks/IWH-f7gfst8e/run/ results in webHookId = 'IWH-f7gfst8e'
 * Using the ref here allows disabling the SimpleButton component when value is not set
 */
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
    apiResponseLoading.value = false;
    // Logging the response for this example
    console.log({ webHook });
    // Update the shared lastResponse ref for the latest api response
    lastResponse.value = webHook
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
    apiResponseLoading.value = false;
  }
}
</script>

<!-- These styles won't affect anything outside this component -->
<style scoped>
.code_block {
  background-color: rgba(176, 196, 222, 0.75);
  padding: 4px;
  border-radius: 2px;
}
</style>
