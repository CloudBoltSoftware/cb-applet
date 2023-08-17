<template>
  <VDialog v-model="renameDialog" width="1024" @update:model-value="(val) => !val && onCancel()">
    <template #activator="{ props: renameProps }" >
      <VBtn v-bind="renameProps" icon="mdi-pencil-circle" title="Rename"/>
    </template>
    <VCard class="pa-3">
      <VForm @submit.prevent="renameObject" @update:model-value="(val) => formIsValid = val" >
        <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
          Rename Object
          <VBtn icon="mdi-close" title="Close this dialog" variant="text" @click="onCancel" />
        </VCardTitle>
        <VCardText>
          <VTextField 
            v-model="renameNew"
            label="New Object Name"
            placeholder="Enter name here" 
            type="text"
            :rules="requiredRule"
            required />
        </VCardText>
        <VCardActions class="d-flex justify-end px-3">
          <VTooltip location="start" :text="formError" >
            <template #activator="{ props: activatorProps }">
              <VIcon v-if="formError" v-bind="activatorProps" color="error" size="large" icon="mdi-alert-circle" class="mt-1"/>
            </template>
          </VTooltip>
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="onCancel">Cancel</VBtn>
          <VBtn :loading="isSubmitting" :disabled="!formIsValid" type="submit" variant="flat" color="primary" size="large" :width="isSubmitting ? '150' : '100'" class="px-4">Rename
            <template #loader>Submitting…</template>
          </VBtn>
        </VCardActions>  
      </VForm>
    </VCard>
  </VDialog>
</template>
    
<script setup>
import { computed, ref, watch } from "vue";
import { convertObjectToFormData } from '../../helpers/axiosHelper';

/**
 * @typedef {Object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {Object} Props.name - The selected S3 Bucket item's name
 * @property {Object} Props.resource - The S3 Bucket resource
 * @property {String} Props.path - The selected S3 Bucket item's current full path
 */
/** @type {Props} */

const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  resource: {
    type: Object,
    default: () => {}
  },
  path: {
    type: String,
    default: ''
  },
});

const emit = defineEmits(["update:refreshResource"]);
const isSubmitting = ref(false)
const renameDialog = ref(false)
const formIsValid = ref(false)
const formError = ref()
const renameOld = ref('')
const renameNew = ref('')

const renameForm = computed(() => ({  
  old_object_name: renameOld.value,
  new_object_name: renameNew.value,
  path: props.path,
  bucket_name: props.resource.name})
) 

const requiredRule = [
  (value) => !!value || 'This field is required',
  (value) => value !== renameOld.value || 'New name needs to be different']

const onCancel = () => {
  renameDialog.value = false
  renameNew.value = renameOld.value
  formError.value = ''
}

watch(() => renameDialog.value === true,
  () => {
    renameOld.value = props?.name,
    renameNew.value = props?.name
  })

async function renameObject() {
  try {
    isSubmitting.value = true
    const formData = convertObjectToFormData(renameForm.value)
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-rename-object/${props.resource.id}/`,  formData)
    console.log("Rename Object ", {response})
    isSubmitting.value = false
    renameDialog.value = false
    emit("update:refreshResource");
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    console.error(error);
    formError.value = `(${error.code}) ${error.name}: ${error.message}`
    formIsValid.value = false
    isSubmitting.value = false
  }
}</script>
<style scoped></style>
