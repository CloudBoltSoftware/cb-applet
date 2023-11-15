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
    <!-- 
    VCardText slot sits below the header and can be considered the main body of the card
    visit the Vuetify Cards page for more information. 
    -->
    <VCardText>
      Last API Response:
      <!-- 
      Double brackets to render the `lastResponseDisplay` if it exists, using our custom css "code_block"
      defined in the scoped styles at the end of the file
      -->
      <p v-if="lastResponseDisplay" class="code_block">
        {{ lastResponseDisplay }}
      </p>
    </VCardText>
    <!-- 
    VCardActions slot sits at the bottom of the card and typically contains one or more buttons
    Here we are using our custom ApiActionButton in multiple iterations
    -->
    <VCardActions class="d-flex flex-column">
      <!-- 
      View the Webhook example for the most complete code commentary 
      Each sub-component is passed the necessary props for their code execution
      which varies depending on component. All the components are passed the two update 
      functions for the shared refs
      -->
      <ExampleWebhook
        :api="api"
        @update:responseLoading="(val) => updateResponseLoading(val)"
        @update:lastResponse="(response) => updateLastResponse(response)"
      />
      <ExampleLabels
        :api="api"
        :resource-id="resourceId"
        :is-server="resourceIsServer"
        @update:responseLoading="(val) => updateResponseLoading(val)"
        @update:lastResponse="(response) => updateLastResponse(response)"
      />
      <ExampleParameters
        :api="api"
        :resource-id="resourceId"
        @update:responseLoading="(val) => updateResponseLoading(val)"
        @update:lastResponse="(response) => updateLastResponse(response)"
      />
    </VCardActions>
  </VCard>
</template>

<script setup>
import { computed, ref } from "vue";
import ExampleLabels from "./ExampleLabels.vue";
import ExampleParameters from "./ExampleParameters.vue";
import ExampleWebhook from "./ExampleWebhook.vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.resource - The resource provided to the component, fetched at the parent component
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
  },
});

/**
 * Similar to the VersionInfo component, we'll use the `api` prop to make a variety of API calls.
 * We'll also reactively store the loading state while each call is fetching, which will be used to
 * render a progress bar on the card.
 */
const apiResponseLoading = ref(false);
/**
 * Our component displays the last api call by using a reactive `ref` that is updated by each api call
 * The `computed` display value reacts to the changes of the ref to compose the text to display
 */
const lastResponse = ref();
const lastResponseDisplay = computed(() => JSON.stringify(lastResponse.value));
/**
 * With the two refs `apiResponseLoading` and `lastResponse` defined above, we want to allow each of our
 * sub-components to share the ability to update these values
 * so we create update functions that can be shared with each component
 */
const updateLastResponse = (newValue) => {
  lastResponse.value = newValue;
};
const updateResponseLoading = (newValue) => {
  apiResponseLoading.value = newValue;
};
/**
 * To identify and work with the resource provided, we will pull specific attributes from the resource prop.
 */
const resourceId = computed(() => props.resource.id);
const resourceIsServer = computed(() => props.resource.type === "SERVER");
</script>

<!-- These styles won't affect anything outside this component -->
<style scoped>
.code_block {
  background-color: rgba(176, 196, 222, 0.75);
  padding: 4px;
  border-radius: 2px;
}
</style>
