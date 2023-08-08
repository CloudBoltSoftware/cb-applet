<template>
  <VDialog v-model="uploadDialog" width="1024">
    <template #activator="{ props: uploadProps }" >
      <VBtn v-bind="uploadProps" icon="mdi-file-upload" title="Upload New File" size="x-large"/>
    </template>
    <VCard class="py-2">
      <VCardActions class="d-flex justify-center ma-2">
        <!-- TODO - after submitted refresh content, @update:submitted does nothing -->
        <FileUpload :api="api" :resource="resource" :state="state" @update:closeDialog="uploadDialog = false" @update:submitted="() => handleResourceSelection(resource)" />
        <FolderUpload :api="api" :resource="resource" :state="state" @update:closeDialog="uploadDialog = false" @update:submitted="() => handleResourceSelection(resource)"/>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "./FileUpload.vue";
import FolderUpload from "./FolderUpload.vue";
// TODO Update post upload not working
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {function} Props.handleResourceSelection - Function to fetch the selected S3 Bucket
 */
/** @type {Props} */
defineProps({
  api: {
    type: Object,
    required: true,
  },
  state: {
    type: Object,
    default: () => {}
  },
  resource: {
    type: Object,
    default: () => {}
  },
  handleResourceSelection: {
    type: Function,
    default: () => {},
  },
});

const uploadDialog=ref(false)
</script>
<style scoped></style>