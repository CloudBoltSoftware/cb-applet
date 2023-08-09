<template>
  <VForm 
    @submit.prevent="fetchSelection(selectionForm)">
    <VBtn
      variant="text"
      :title="item.name"
      type="submit"
      class="text-none font-weight-regular px-2 text-body-1"
      color="blue-darken-3"
    >{{ item.name }}</VBtn>
  </VForm>
</template>

<script setup>
import { computed, onUpdated, ref } from "vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.item - The current S3 Bucket item
 * @property {string} Props.id - The current S3 Bucket id
 * @property {function} Props.fetchSelection - Function to fetch the selected S3 Bucket path
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  item: {
    type: Object,
    default: () => {},
  },
  id: {
    type: String,
    required: true
  },
  fetchSelection: {
    type: Function,
    default: () => {},
  }
});

const selectedPath = ref('')
const selectedName = ref('')
const selectionForm = computed(() => ({
  path: selectedPath.value,  // Encoding path early leads to double encoding '/'
  name: encodeURIComponent(selectedName.value)
  })
)
onUpdated(() => {
  selectedPath.value = encodeURIComponent(props.item.url)
  selectedName.value = encodeURIComponent(props.item.name)

});

</script>
<style scoped></style>
