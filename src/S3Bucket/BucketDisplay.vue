<template>
  <VProgressCircular v-if="isLoading" indeterminate class="ma-3" />
  <div v-else>
    <BucketBreadcrumbs 
      :state="state"
      :resource="resource"
      :fetch-selection="fetchSelection"
      />
    <VBtnGroup disabled>
      <DownloadButton :api="api" :resource="resource" :location="location" :selected-items="selectedItems" />
      <DeleteModal :api="api" :resource="resource" :selected-items="selectedItems" @update:handleResourceSelection="handleResourceSelection" />
      <UploadModal :api="api" :resource="resource" :state="state" :handle-resource-selection="handleResourceSelection"/>
      <CreateModal :api="api" :resource="resource" :state="state" @update:handleResourceSelection="handleResourceSelection"/>
      <VBtn v-if="flattenView" icon="mdi-folder-eye" title="Toggle Folder View" size="x-large" @click="fetchFlattenedView"/>
      <VBtn v-else icon="mdi-view-headline"  title="Toggle List View" size="x-large" @click="fetchFlattenedView" />
    </VBtnGroup>
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
                color="blue-darken-3"
                class="align-self-center"
              />
              <BucketButton 
              v-if="!item.raw.is_file"
              :id="resource.id"
              :item="item.raw"
              :api="api"
              :fetch-selection="fetchSelection"
              />
              <div v-else class="ml-2">{{ item.raw.name }}</div>
            </td>
          </template> 
          <template #[`item.actions`]="{ item }">
            <td v-if="item.raw.is_file" class="d-inline-flex">
              <VBtnGroup>
                <RenameModal :api="api" :item="item.raw" :resource="resource" :state="state" @update:handleResourceSelection="handleResourceSelection"/>
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
import BucketBreadcrumbs from "./BucketBreadcrumbs.vue";
import BucketButton from "./BucketButton.vue";
import CreateModal from "./CreateModal.vue";
import DeleteModal from "./DeleteModal.vue";
import DownloadButton from "./DownloadButton.vue";
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
