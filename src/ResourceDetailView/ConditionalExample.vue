<template> 
  <!-- 
    VCard comes from Vuetify: https://vuetifyjs.com/en/components/cards/
    and provide a great way to wrap related content together
    The vuetify margin class "mb-2" provide simple css border to the bottom of the card
  -->
  <VCard
    title="Conditional Example"
    class="mb-2"
  >
  <!-- 
    VChip comes from Vuetify: https://vuetifyjs.com/en/components/chips/
    and are used to convey small pieces of information.
    VChipGroup https://vuetifyjs.com/en/components/chip-groups/ provides groupable functionality to the chips
    The vuetify padding class "px-2" provide simple css padding to the left and right of the group
    -->
    <VChipGroup class="px-2">
      <!-- 
      Each chip is conditionally rendered with a specific icon and text. 
      These properties are built into the VChip component
      The first two chips will alternately render different chips, the third alternates the details of a single chip 
      -->
      <VChip v-if="isServerOn" prepend-icon="mdi-checkbox-marked-circle" size="small">Server is on</VChip>
      <VChip v-else prepend-icon="mdi-alert-circle" size="small">Server is off</VChip>

      <VChip v-if="isUserAdmin" prepend-icon="mdi-checkbox-marked-circle" size="small">User is admin</VChip>
      <VChip v-else prepend-icon="mdi-alert-circle" size="small">User is not admin</VChip>

      <VChip :prepend-icon="datadogParam ? 'mdi-checkbox-marked-circle' : 'mdi-alert-circle'" size="small">
        {{ datadogParam ? 'Datadog param exists' : 'Datadog param does not exist' }}
      </VChip>
    </VChipGroup>
    <!-- 
    Look inside `BasicTextCard` for a brief explanation of this use of Vue `template` (and Vue Slots)
    -->
    <BasicTextCard v-if="isServerOn && isUserAdmin && datadogParam" :title="datadogParam.label"> 
      <template #default>
        <!-- 
        The vuetify margin class ""ma-3" provides a simple css margin to all sides of the paragraph
        -->
        <p class="ma-3">{{ datadogParam.value }}</p>
      </template>
    </BasicTextCard>
  </VCard>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import BasicTextCard from "./BasicTextCard.vue";
/**
 * Recommend starting at src/MainView/MainView.vue for a more in-depth explanation of component parts
 */

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
  /**
   * Additional contextual information for an applet in a Resource panel. Contains the current resource info
   **/
  resource: {
    type: Object,
    default: () => ({}),
  },
});

/**
 * Leveraging information provided by the resource context to create a conditionals for an example.  
 * You can always console.log(props.resource) to see what is available to work with.
 * For this example, we want to render a particular parameter only 
 * 1) if the parameter exists, 2) the user is admin, and 3) the server is on
 */

/**
 * We will have the user stored as a reactive `ref` that is will be updated by api call
 */
const currentUser = ref()
/**
 * This reactive value will check the resource context being passed for a custom parameter added to the resource 
 * whose name matches the desired value of "Datadog Parameter", and then displays this information in another VCard component
 * Custom Parameters can be created at `admin/customfields/` then added to the resource on the Parameters tab
 */
const datadogParam = computed(() => props.resource?.groupedAttributesMap?.parameters?.attributes.filter((each) => each.label === "Datadog Parameter")[0])
// This reactive value uses the already-provided resource context to check if the server is powered on. 
const isServerOn = computed(() => props.resource?.powerStatus === "POWERON")
// This reactive value will check our `currentUser` ref and determine if the user is a superAdmin
const isUserAdmin = computed(() => currentUser.value?.superAdmin === true)

async function fetchUser() {
  try {
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.v3.cmp.users.getCurrentUser()
    // Saving the user response to our local ref
    currentUser.value = response
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
  }
}

// Run the function when the component is mounted.
onMounted(fetchUser);
</script>
