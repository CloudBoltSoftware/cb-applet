<template>
  <VDialog v-model="fileDialog" width="1024">
<!-- <div class="modal fade" id="uploadObjectModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true"> -->
    <template #activator="{ props: fileProps }" >
      <!-- <VBtn prepend-icon="mdi-file-upload" v-bind="fileProps" color="primary" id="file_btn" title="Upload New File">Upload a File</VBtn> -->
      <VBtn prepend-icon="mdi-file-upload" v-bind="fileProps" variant="flat" color="primary" size="x-large" title="Upload New File" class="px-4">Upload a File</VBtn>
    </template>
    <VCard class="py-3">
      <!-- id="uploadFileForm" action="#" method="post" enctype="multipart/form-data" -->
      <VForm @submit.prevent="submitModal">
        <VCardTitle class="d-flex justify-space-between text-h5">
          <!-- {{  `Upload File to ${state.full_path}` }} -->
          Upload File to -put location here-
          <VBtn icon="mdi-close" title="Close" data-dismiss="modal" variant="text" @click="fileDialog = false"/>
          <!-- <span aria-hidden="true">&times;</span> -->
        </VCardTitle>
        <VCardText>
          <!--  -->
          <VFileInput v-model="uploadFileForm.object_file" :rules="requiredRule" clearable label="Upload File" />
          <!-- <p id="object_file_message" class="error-message">This field is required</p> -->
        </VCardText>
        <VCardActions class="d-flex justify-end px-3">
          <!-- data-dismiss="modal"  -->
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="fileDialog = false" >Cancel</VBtn>
          <!-- id="submit-object" -->
          <VBtn prepend-icon="mdi-file-upload" variant="flat" color="primary" size="large" class="px-4" type=submit >Upload to S3</VBtn>
        </VCardActions>
      </VForm>
    </VCard>
<!-- </div> -->
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

const uploadFileForm = ref({
  object_file: ''
}) 
const fileDialog=ref(false)
const requiredRule = [(value) => !!value || 'This field is required']

async function submitModal() {
  try {
    fileDialog.value = false
    // TODO Handle Submission
    console.log('Lets submit! FileUpload go!', uploadFileForm.value)
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