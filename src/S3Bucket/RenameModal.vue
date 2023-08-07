<template>
  <VDialog v-model="renameDialog" width="1024">
  <!-- <div class="modal fade" id="renameObjectModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
  <div class="modal-dialog modal-sm">
  <div class="modal-content"> -->
    <template #activator="{ props: renameProps }" >
      <!-- id="create_btn" -->
      <VBtn v-bind="renameProps" icon="mdi-pencil-circle" title="Rename"/>
    </template>
    <VCard class="py-3">
      <!-- id="createFolderForm" action="#" method="post" enctype="multipart/form-data" -->
      <VForm @submit.prevent="submitModal">
        <VCardTitle class="d-flex justify-space-between text-h5">
          Rename Object
          <!-- data-dismiss="modal" -->
          <VBtn icon="mdi-close" title="Close this dialog" variant="text" @click="renameDialog = false" />
        </VCardTitle>
        <VCardText>
          <!-- <div class="modal-body"> -->
          <!-- <VCol cols="12"> -->
            <!-- name="old_object_name" id="old_object_name"  -->
            <!-- TODO : Show old and new? New should load into the value -->
            <VTextField 
              v-model="renameForm.old_object_name"
              class="d-none" 
              value="" />
            <!-- class="form-control" name="new_object_name" id="new_object_name" -->
            <VTextField 
              v-model="renameForm.new_object_name"
              label="Object Name"
              placeholder="Enter name here" 
              type="text"
              :rules="requiredRule"
              value=""
              required />
            <!-- <p class="error-message" id="object_error_message">This field is required</p> -->
          <!-- </VCol> -->
          <VCol cols="12" class="details-div">
          </VCol>
          <!-- </div> -->
        </VCardText>
        <VCardActions class="d-flex justify-end px-3">
          <!--  data-dismiss="modal"  -->
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="renameDialog = false">Cancel</VBtn>
          <!-- id="rename-object-btn" data-old_object_name="" data-path="" class="cb-btn cb-btn-primary js-submit-form" data-loading-text="Submitting…" value="Rename" -->
          <VBtn :loading="isSubmitting" type="submit" variant="flat" color="primary" size="large" class="px-4">Rename
            <template #loader>Submitting…</template>
          </VBtn>
        </VCardActions>  
      </VForm>
    </VCard>
  <!-- </div>
  </div>
  </div> -->
  </VDialog>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { VTextField } from "vuetify/lib/components/index.mjs";

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.item - The selected S3 Bucket
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
});

const renameForm = ref({
  old_object_name: '',
  new_object_name: ''
}) 

onMounted(() => {
  console.log({props})
  console.log('onMounted', props?.item?.name)
  renameForm.value = {
    old_object_name: props?.item?.name,
    new_object_name: props?.item?.name
  }
})
const isSubmitting = ref(false)
const renameDialog = ref(false)
const requiredRule = [(value) => !!value || 'This field is required']
async function submitModal() {
  try {
    isSubmitting.value = true
    renameDialog.value = false
    // TODO Handle Submission
    console.log('Lets submit! Rename Modal go!', renameForm.value)
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
}</script>
<style scoped></style>