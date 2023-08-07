<template>
  <VDialog v-model="uploadDialog" width="1024">
  <!-- <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
  <div class="modal-dialog modal-sm">
  <div class="modal-content"> -->
    <template #activator="{ props: uploadProps }" >
      <!-- id="upload_btn" -->
      <VBtn v-bind="uploadProps" icon="mdi-file-upload" title="Upload New File" size="x-large"/>
    </template>
    <VCard class="py-2">
      <VCardActions class="d-flex justify-center ma-2">
        <!-- <VBtn prepend-icon="mdi-file-upload" id="file_btn" class="btn btn-primary" title="Upload New File">Upload a File</VBtn> -->
        <FileUpload @click="uploadDialog = false"/>
        <!-- <VBtn prepend-icon="mdi-folder-upload" id="folder_btn" class="btn btn-primary" title="Upload New Folder">Upload a Folder</VBtn> -->
        <FolderUpload @click="uploadDialog = false"/>
      </VCardActions>
    </VCard>
  <!-- </div>
  </div>
  </div> -->
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "./FileUpload.vue";
import FolderUpload from "./FolderUpload.vue";

const uploadDialog=ref(false)
</script>
<style scoped></style>