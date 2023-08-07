<template>
  <VDialog v-model="createDialog" width="1024">
  <!-- <div class="modal fade" id="folderModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true"> -->
    <template #activator="{ props: createProps }" >
      <!-- id="create_btn" -->
      <VBtn v-bind="createProps" icon="mdi-folder-plus" title="Add New Folder" size="x-large"/>
    </template>
    <VCard class="py-3">
      <!-- id="createFolderForm" action="#" method="post" enctype="multipart/form-data" -->
      <VForm @submit.prevent="submitModal" >
        <VCardTitle class="d-flex justify-space-between text-h5">
          <!-- {{  `Create Folder ${state.full_path ? `to ${state.full_path}` : ''}` }} -->
          Create Folder -to- -put folder here-
          <!-- data-dismiss="modal" -->
          <VBtn icon="mdi-close" title="Close this dialog" variant="text" @click="createDialog = false"/>
        </VCardTitle>
        <VCardText>
          <VCol cols="12" >
            <!-- id="folder_name" -->
            <VTextField 
              v-model="createFolderForm.folder_name"
              label="Folder Name"
              placeholder="Enter folder name"
              prepend-icon="mdi-folder-plus"
              type="text"
              :rules="requiredRule"
              required
            ></VTextField>
            <span class="pl-8">
              <VBtn prepend-icon="mdi-information" href="https://docs.aws.amazon.com/console/s3/object-keys" target="_blank" variant="text" class="text-capitalize font-weight-regular text-body-1">See rules for naming</VBtn>
            </span> 
            <!-- <input class="form-control"   id="folder_name" value="" placeholder="" required> -->
            <!-- <p class="error-message" id="folder_error_message">This field is required</p> -->
          </VCol>
        </VCardText>
        <VCardAction class="d-flex justify-end px-3">
          <!-- data-dismiss="modal" -->
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="createDialog = false">Cancel</VBtn>
          <!-- id="create-folder-btn" data-path="" data-file_path="" data-loading-text="Submitting…" -->
          <VBtn :loading="isSubmitting" prepend-icon="mdi-folder-plus" type=submit variant="flat" color="primary" size="large" class="px-4">Create
            <template #loader>Submitting…</template>
          </VBtn>
        </VCardAction>
      </VForm>
    </VCard>
  <!-- </div>-->
  </VDialog>
</template>
    
<script setup>
import { ref } from "vue";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 */
/** @type {Props} */

defineProps({
  api: {
    type: Object,
    required: true,
  },
});

const createFolderForm = ref({
  folder_name: ''
}) 

const isSubmitting = ref(false)
const createDialog = ref(false)
const requiredRule = [
  (value) => !!value || 'This field is required',
  (value) => !value.includes('/') || "Folder names can't contain '/''"]
async function submitModal() {
  try {
    isSubmitting.value = true
    createDialog.value = false
    // TODO Handle Submission
    console.log('Lets submit! Create Modal go!', createFolderForm.value)
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    // await props.api.v3.cmp.productInfo.getProductInfo();
    isSubmitting.value = false
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
    isSubmitting.value = false
  }
}
</script>
<style scoped></style>