<template>
  <VDialog v-model="uploadDialog" width="1024">
    <template #activator="{ props: uploadProps }" >
      <VBtn v-bind="uploadProps" icon="mdi-file-upload" title="Upload New File" size="x-large"/>
    </template>
    <VCard class="pa-3">
      <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
        <div>
          Upload file or folder to <span class="font-italic">{{ path ? path : 'Root folder'}}</span>
        </div>
        <VBtn icon="mdi-close" title="Close this dialog" data-dismiss="modal" variant="text" @click="uploadDialog = false"/>
      </VCardTitle>
      <VCardActions class="d-flex justify-center ma-2">
        <FileUpload :api="api" :resource="resource" :path="path" @update:closeDialog="uploadDialog = false" @update:submitted="refreshResource" />
        <FolderUpload :api="api" :resource="resource" :path="path" @update:closeDialog="uploadDialog = false" @update:submitted="refreshResource"/>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "../Components/FileUpload.vue";
import FolderUpload from "../Components/FolderUpload.vue";

/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {String} Props.path - The S3 Bucket item's full path
 * @property {Object} Props.resource - The S3 Bucket resource
 * @property {Function} Props.refreshResource - Function to re-fetch the S3 Bucket data
 */
/** @type {Props} */
defineProps({
  api: {
    type: Object,
    required: true,
  },
  path: {
    type: String,
    default: ''
  },
  resource: {
    type: Object,
    default: () => {}
  },
  refreshResource: {
    type: Function,
    default: () => {},
  },
});

const uploadDialog = ref(false)
</script>
<style scoped></style>
