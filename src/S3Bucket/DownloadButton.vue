<template>
  <VBtn icon="mdi-file-download" :disabled="isDisabled" size="x-large" title="Download" @click="downloadFiles"/>
</template>
    
<script setup>
import { computed } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {object} Props.selectedItems - The selected S3 Bucket items
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
  location: {
    type: String,
    default: '',
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
});

const isDisabled = computed(() => {
  if (props.selectedItems.length === 0 || props.selectedItems.findIndex((entry) => !entry.is_file) !== -1) {
    return true
  }
  return false
})
const filePaths = computed(() => {
  const allFiles = []
  props.selectedItems.forEach((item) => {
    allFiles.push({
      path: item.url,
      location: props.location
    })
  })

  return allFiles
})

async function downloadFiles() {
  filePaths.value.forEach(async (entry) => {
    try {
      const formData = convertObjectToFormData(entry)
      // Because this function is `async`, we can use `await` to wait for the API call to finish.
      // Alternatively, we could use `.then()` and `.catch()` to handle the response.
      // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
      const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-download-file/${props.resource.id}/`,  formData)
      console.log("Download Files ", {response})
      if (response.status === 200) {
        window.open(response.data.url, "_blank")
      }
    } catch (error) {
      // When using API calls, it's a good idea to catch errors and meaningfully display them.
      // In this case, we'll just log the error to the console.
      console.error(error);
    }
  })
}
</script>
<style scoped></style>
