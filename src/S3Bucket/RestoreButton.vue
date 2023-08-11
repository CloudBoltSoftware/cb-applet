<template>
  <VBtn icon="mdi-file-undo" title="Restore File" @click="restoreItem"  />
</template>
    
<script setup>
import { computed } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.item - The selected S3 Bucket item
 * @property {object} Props.id - The selected S3 Bucket resource id
 */
/** @type {Props} */

const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  item: {
    type: Object,
    default: () => {}
  },
  id: {
    type: Object,
    default: () => {},
  }
});

const emit = defineEmits(["update:refreshResource"]);
const retoreItemForm = computed(() => ({
  state: {},  // TODO: Example?
  item: {},  // TODO: Possible Value
  restore: 'True'
}))

const restoreItem = async () => {
  // TODO - Backend issue
  try {
    const formData = convertObjectToFormData(retoreItemForm.value)
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-promote-version/${props.id}/`, formData)
    console.log('Restore Version ',{response})
    emit("update:refreshResource");
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }

}
</script>
<style scoped></style>
