<template>
  <VProgressCircular v-if="isLoading" indeterminate class="ma-3" />
  <div v-else>
  <!-- <nav class="nav nav-header-tabs"> -->
  <!-- <div class="nav-left"> -->
    <VBreadcrumbs
      v-if="resource"
      :items="breadcrumbs"
      class="text-capitalize text-h6 pl-0 mb-2"
      active-color="primary"
    />
    <VBtnGroup disabled>
      <VBtn icon="mdi-file-download" title="Download" disabled  size="x-large"/>
      <!-- <VBtn icon="mdi-delete" title="Delete" disabled size="large"/> -->
      <DeleteModal :api="api" :resource="resource" :selected-items="selectedItems" @update:handleResourceSelection="(val) => handleResourceSelection(val)" />
      <!-- <VBtn id="upload_btn" icon="mdi-file-upload" title="Upload New File" size="large"/> -->
      <UploadModal :api="api" :resource="resource" :state="state" :handle-resource-selection="handleResourceSelection"/>
      <!-- <VBtn id="create_btn" icon="mdi-folder-plus" class="btn btn-link" title="Add New Folder" size="large"/> -->
      <CreateModal :api="api" :resource="resource" :state="state" @update:handleResourceSelection="(val) => handleResourceSelection(val)"/>
      <VBtn v-if="flattenView" icon="mdi-folder-eye" title="Toggle Folder View" size="x-large" @click="flattenSelection"/>
      <VBtn v-else icon="mdi-view-headline"  title="Toggle List View" size="x-large" @click="flattenSelection" />
    </VBtnGroup>
    <!-- </nav> -->
    <div id="s3-files-table">
        <VDataTable
          :headers="headers"
          :items="state?.dir_list"
          :item-value="item => item"
          show-select
          @update:model-value="(val) => selectedItems = val"
          >
          <template #[`item.name`]="{ item }">
            <td class="d-inline-flex">
              <VIcon
                :icon="item.raw.is_file ? 'mdi-file' :  'mdi-folder' "
                class="align-center"
              />
              <BucketButton 
              v-if="!item.raw.is_file"
              :id="resource.id"
              :item="item.raw"
              :api="api"
              @update:updateResourceSelection="(val) => updateResourceSelection(val)"
              />
              <div v-else class="ml-2">{{ item.raw.name }}</div>
            </td>
          </template> 
          <template #[`item.actions`]="{ item }">
            <td v-if="item.raw.is_file" class="d-inline-flex">
              <VBtnGroup>
                <RenameModal :api="api" :item="item.raw" :resource="resource" :state="state" />
                <OverviewModal :api="api" :item="item.raw" :location="location" :resource="resource" />
              </VBtnGroup>
            </td>
          </template> 
        </VDataTable>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { convertObjectToFormData } from '../helpers/axiosHelper';
import BucketButton from "./BucketButton.vue";
import CreateModal from "./CreateModal.vue";
import DeleteModal from "./DeleteModal.vue";
import OverviewModal from "./OverviewModal.vue";
import RenameModal from "./RenameModal.vue";
import UploadModal from "./UploadModal.vue";
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {string} Props.location - The selected S3 Bucket location
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {function} Props.updateResourceSelection - Function to replace the selected S3 Bucket resource
 * @property {function} Props.handleResourceSelection - Function to fetch the selected S3 Bucket
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
  handleResourceSelection: {
    type: Function,
    default: () => {},
  },
});

const isLoading = ref(false)
const selectedItems = ref()
const flattenView = ref(false)
const flattenForm = computed(() => ({
  path: '',
  flat: flattenView.value ? 'True' : 'False'
}))

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Type', align: 'end', key: 'item_type' },
  { title: 'Last Modified', align: 'end', key: 'last_modified' },
  { title: 'Size', align: 'end', key: 'size' },
  { title: 'Storage Class', align: 'end', key: 'storage_class' },
  { title: 'Actions', align: 'end', key: 'actions' },
]
const breadcrumbs = computed(() => {
  let crumbsArray = [{
    title: props.resource.name,
    disabled: false,
    color:"primary",
    to: { name: 'catalog' }
  }] 
  if (props.state.path_dirs.length > 0) {
    for (let entry of props.state.path_dirs) {
      crumbsArray.push({
        title: entry.name,
        disabled: false,
        color:"primary",
        to: { name: 'catalog', params: { id: entry.id} }
      })
    }
  }
  // Disable the last link
  const lastLink = crumbsArray[crumbsArray.length-1]
  lastLink.disabled = true
  lastLink.color = 'black'
  return crumbsArray
})

const flattenSelection = async () => {
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

</script>
<style scoped></style>
<style lang="scss">
.v-breadcrumbs-item--disabled  {
  color: black !important;
  opacity: 70%;
}
</style>
