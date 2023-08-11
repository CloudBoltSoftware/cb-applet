<template>
  <VDialog v-model="deleteDialog" width="1024">
    <template #activator="{ props: deleteProps }" >
      <VBtn v-bind="deleteProps" :disabled="isDisabled" icon="mdi-delete" title="Delete" size="x-large"/>
    </template>
    <VForm @submit.prevent="deleteModal">
      <VCard class="py-3" density="compact">
        <VCardTitle class="w-100 d-inline-flex justify-space-between text-h5">
          <span>
            <VIcon
            color="error"
            icon="mdi-alert"
            class="text-h5"
          /> Delete Confirmation</span>
          <VBtn icon="mdi-close" title="Close this dialog" data-dismiss="modal" variant="text" @click="deleteDialog = false"/>
        </VCardTitle>
        <VCardText class="py-0">
          <p class="text-h6">Are you sure you want to delete?</p>
          <p class="text-body-1">Note: If you have selected a folder, all objects in that folder will also be deleted.</p>    
        </VCardText>
        <VCardAction class="d-flex justify-end px-3">
          <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="deleteDialog = false">Cancel</VBtn>
          <VBtn prepend-icon="mdi-delete" variant="flat" color="primary" size="large" class="px-4" type=submit >Delete</VBtn>
        </VCardAction>
      </VCard>
    </VForm>
  </VDialog>
</template>
    
<script setup>
import { computed, ref } from "vue";
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
  selectedItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:refreshResource"]);
const deleteDialog = ref(false)
const isDisabled = computed(() => {
  if (props.selectedItems.length === 0 || props.selectedItems.find((entry) => entry.is_delete_marker)) {
    return true
  }
  return false
})

const filePath = computed(() => {
  const allFiles = []
  props.selectedItems.forEach((item) => {
    allFiles.push({
      file_path: item.url,
      object_type: item.item_type
    })
  })

  return allFiles
})
const deleteForm = computed(() => ({
  all_files_path: JSON.stringify(filePath.value)
}))

async function deleteModal() {
  try {
    const formData = convertObjectToFormData(deleteForm.value)
    // Because this function is `async`, we can use `await` to wait for the API call to finish.
    // Alternatively, we could use `.then()` and `.catch()` to handle the response.
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-delete-file/${props.resource.id}/`,  formData)
    console.log("Delete Files/Folders ", {response})
    deleteDialog.value = false
    emit("update:refreshResource");
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.error(error);
    deleteDialog.value = false
  }
}
</script>
<style scoped></style>
