<template>
  <VBtn icon="mdi-file-undo" title="Restore File" @click="restoreItem"  />
</template>
    
<script setup>
import { computed } from "vue";
import { convertObjectToFormData } from '../../helpers/axiosHelper';

/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {Object} Props.item - The S3 Bucket file item
 * @property {Object} Props.resourceId - The S3 Bucket resource id
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
  resourceId: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(["update:refreshResource"]);
// TODO CMP-127 - This button requires versioning and additional work 
// Currently is disabled in the example
const retoreItemForm = computed(() => ({
  key: props.item.key,
  path: props.item.path,
  version_id:  props.item.version_id,
  restore: 'True'
}))

const restoreItem = async () => {
  // TODO - Backend issue
  try {
    const formData = convertObjectToFormData(retoreItemForm.value)
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-promote-version/${props.resourceId}/`, formData)
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
