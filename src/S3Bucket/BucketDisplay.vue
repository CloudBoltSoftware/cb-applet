<template>
  <VProgressCircular v-if="isLoading" indeterminate class="ma-3" />
  <div v-else class="d-flex flex-column">
    <BucketBreadcrumbs 
      :state="state"
      :resource="resource"
      :fetch-selection="fetchSelection"
      class="justify-start"
      />
    <div class="d-flex justify-space-between">
      <VBtnGroup>
        <DownloadButton :api="api" :resource="resource" :location="location" :selected-items="selectedItems" />
        <DeleteModal :api="api" :resource="resource" :selected-items="selectedItems" @update:refreshResource="refreshResource" />
        <UploadModal :api="api" :resource="resource" :state="state" :refresh-resource="refreshResource"/>
        <CreateModal :api="api" :resource="resource" :state="state" @update:refreshResource="refreshResource"/>
        <VBtn v-if="flattenView" icon="mdi-folder-eye" title="Toggle Folder View" size="x-large" @click="fetchFlattenedView"/>
        <VBtn v-else icon="mdi-view-headline"  title="Toggle List View" size="x-large" @click="fetchFlattenedView" />
      </VBtnGroup>
      <VTooltip location="top" text="Toggle Version Mode" >
        <template #activator="{ props: activatorProps }">
          <VSwitch v-model="isVersionMode" v-bind="activatorProps" inset color="primary" label="Version" density="compact" hide-details class="flex-grow-0 mr-2"/>
        </template>
      </VTooltip>
    </div>
    <NestedTable
      :api="api"
      :location="location"
      :resource="resource"
      :state="state"
      :is-version-mode="isVersionMode"
      :data-table-items="dataTableItems"
      :selected-items="selectedItems"
      :fetch-selection="fetchSelection"
      :updated-selected-items="updatedSelectedItems"
      :update-resource-selection="updateResourceSelection"
      :refresh-resource="refreshResource"
      />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';
import BucketBreadcrumbs from "./BucketBreadcrumbs.vue";
import CreateModal from "./CreateModal.vue";
import DeleteModal from "./DeleteModal.vue";
import DownloadButton from "./DownloadButton.vue";
import NestedTable from "./NestedTable.vue";
import UploadModal from "./UploadModal.vue";
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {string} Props.location - The selected S3 Bucket location
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {function} Props.updateResourceSelection - Function to replace the selected S3 Bucket resource
 * @property {function} Props.refreshResource - Function to fetch the selected S3 Bucket
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  resource: {
    type: Object,
    default: () => {},
  },
  state: {
    type: Object,
    default: () => {},
  },
  updateResourceSelection: {
    type: Function,
    default: () => {},
  },
  refreshResource: {
    type: Function,
    default: () => {},
  },
});

const isVersionMode = ref(false)
// TODO - Better check Version mode
// const hasVersionMode = computed(() => props?.state?.dir_list[0].versions.length > 0)
const isLoading = ref(false)
const selectedItems = ref()
const flattenView = ref(false)
const flattenForm = computed(() => ({
  path: '',
  flat: flattenView.value ? 'True' : 'False'
}))
const dataTableItems = computed(() => {
  let list = props?.state?.dir_list
  if (isVersionMode.value) {
    return list
  } 
  return list.filter((item) => !item.is_file ? item : item.is_delete_marker ? false : item )
})

const updatedSelectedItems = (newItems) => {
  selectedItems.value = newItems
}
const fetchFlattenedView = async () => {
  flattenView.value = !flattenView.value
  try {
    const formData = convertObjectToFormData(flattenForm.value)
    const flattenResponse = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.resource.id}/`, formData)
    props.updateResourceSelection(flattenResponse.data);
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

const fetchSelection = async (form) => {
  try {
    const formData = convertObjectToFormData(form)
    const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.resource.id}/`, formData)
    props.updateResourceSelection(response.data)
  } catch (error) {
    // When using API calls, it's a good idea to catch errors and meaningfully display them.
    // In this case, we'll just log the error to the console.
    console.log({error})
  }
}

</script>
<style scoped></style>
