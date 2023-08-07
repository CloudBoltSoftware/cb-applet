<template>
  <VDialog v-model="folderDialog" width="1024">
<!-- <div class="modal fade" id="uploadFolderModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
  <div class="modal-dialog modal-sm"> -->
    <template #activator="{ props: folderProps }" >
      <!-- <VBtn  v-bind="folderProps" prepend-icon="mdi-folder-upload" id="folder_btn" class="btn btn-primary" title="Upload New Folder">Upload a Folder</VBtn> -->
      <VBtn v-bind="folderProps" prepend-icon="mdi-folder-upload" variant="flat" color="primary" size="x-large" title="Upload New Folder" class="px-4">Upload a Folder</VBtn>
    </template>
    <VCard class="py-3">
      <!-- id="uploadFolderForm" action="#" method="post" enctype="multipart/form-data" -->
      <VForm @submit.prevent="submitModal">
        <VCardTitle class="d-flex justify-space-between text-h5">
          <!-- {{  `Upload Folder to ${state.full_path}` }} -->
          Upload Folder to -path-
          <VBtn icon="mdi-close" title="Close" variant="text" data-dismiss="modal" @click="folderDialog = false" />
          <!-- <span aria-hidden="true">&times;</span> -->
        </VCardTitle>
        <VCardText>
          <!--  name="object_folder" id="object_folder" -->
          <VFileInput v-model="uploadFolderForm.oobject_folder" :rules="requiredRule" clearable label="Upload Folder" />
          <!-- webkitdirectory mozdirectory on file input above -->
          <!-- <p class="error-message" id="object_folder_message">This field is required</p> -->

        </VCardText>
        <VCardActions class="d-flex justify-end px-3">
          <!--  data-dismiss="modal"  -->
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="folderDialog = false">Cancel</VBtn>
          <!-- id="submit-folder" -->
          <VBtn prepend-icon="mdi-folder-upload" variant="flat" color="primary" size="large" class="px-4" @click="folderDialog = false">Upload to S3</VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  <!-- </div>
</div> -->
  </VDialog>
</template>

<script setup>
import { ref } from "vue";

const uploadFolderForm = ref({
  object_folder: ''
}) 
const folderDialog=ref(false)
const requiredRule = [(value) => !!value || 'This field is required']

async function submitModal() {
  try {
    folderDialog.value = false
    // TODO Handle Submission
    console.log('Lets submit! FileUpload go!', uploadFolderForm.value)
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    // await props.api.v3.cmp.productInfo.getProductInfo();
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
  }
}
</script>
<style scoped></style>