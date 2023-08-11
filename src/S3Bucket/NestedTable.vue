<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <VDataTable
    v-model:expanded="expanded"
    :headers="isVersionMode ? versionHeaders : headers"
    :items="dataTableItems"
    :item-value="item => item"
    show-select
    :show-expand="isVersionMode ? true : false"
    @update:model-value="(val) => updatedSelectedItems(val)"
    >
    <template #[`item.name`]="{ item }">
      <td class="d-inline-flex">
        <VIcon 
          v-if="item.raw.nested_version"
          icon="mdi-arrow-up-left"
          class="ml-4"
          />
        <VIcon
          v-else
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
    <template #[`item.last_modified`]="{ item }">
      {{ item.raw.is_file ? `${ new Date(item.raw.last_modified).toLocaleTimeString('en-US')}  ${new Date(item.raw.last_modified).toDateString()}` : '' }}
    </template> 
    <template #[`item.actions`]="{ item }">
      <td v-if="item.raw.is_file" class="d-inline-flex">
        <VBtnGroup>
          <VBtn icon="mdi-file-download" title="Download" @click="downloadFile(item.raw.download_url)"/>
          <RestoreButton v-if="isVersionMode" :id="resource.id" :api="api" :item="item.raw" @update:refreshResource="refreshResource"/>
          <RenameModal :api="api" :item="item.raw" :resource="resource" :state="state" @update:refreshResource="refreshResource"/>
          <OverviewModal :api="api" :source-item="item.raw" :location="location" :resource="resource" :refresh-resource="refreshResource"/>
        </VBtnGroup>
      </td>
    </template>
    <template #expanded-row="{ item }">
      <tr v-for="(entry, idx) in item.raw?.versions" :key="idx">
        <td></td>
        <td>       
          <VIcon 
            icon="mdi-arrow-up-left"
            class="ml-4"
            />
        </td>
        <td>{{ entry.version_id }}</td>
        <td>{{ item.raw.item_type }}</td>  
        <td>{{ `${new Date(entry.last_modified).toDateString()}  ${ new Date(entry.last_modified).toLocaleTimeString('en-US')}` }}</td>
        <td>{{ entry.size }}</td>
        <td>{{ entry.storage_class }}</td>
        <td>        
          <VBtnGroup>
            <VBtn icon="mdi-file-download" title="Download" @click="downloadFile(entry.download_url)"/>
            <RestoreButton :id="resource.id" :api="api" :item="entry" @update:refreshResource="refreshResource"/>
          </VBtnGroup>
        </td>
        <td></td>
      </tr>
    </template> 
  </VDataTable>
</template>

<script setup>
import { ref } from "vue";
import BucketButton from "./BucketButton.vue";
import OverviewModal from "./OverviewModal.vue";
import RenameModal from "./RenameModal.vue";
import RestoreButton from "./RestoreButton.vue";
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {string} Props.location - The selected S3 Bucket location
 * @property {object} Props.resource - The selected S3 Bucket resource
 * @property {object} Props.state - The selected S3 Bucket state
 * @property {boolean} Props.isVersionMode - Boolean if Bucket Version mode is on
 * @property {array} Props.dataTableItems - The array of the dataTable items
 * @property {array} Props.selectedItems - The array of the selected table items
 * @property {function} Props.updatedSelectedItems - Function to update the array of the selected table items
 * @property {function} Props.updateResourceSelection - Function to replace the selected S3 Bucket resource
 * @property {function} Props.refreshResource - Function to fetch the selected S3 Bucket
 * @property {function} Props.fetchSelection - Function to fetch the selection
 */
/** @type {Props} */
defineProps({
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
  isVersionMode: {
    type: Boolean,
    default: false,
  },
  state: {
    type: Object,
    default: () => {},
  },
  dataTableItems: {
    type: Array,
    default: () => [],
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  fetchSelection: {
    type: Function,
    default: () => {},
  },
  updatedSelectedItems: {
    type: Function,
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

const expanded = ref([])

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Type', align: 'end', key: 'item_type' },
  { title: 'Last Modified', align: 'start', key: 'last_modified' },
  { title: 'Size', align: 'end', key: 'size' },
  { title: 'Storage Class', align: 'end', key: 'storage_class' },
  { title: 'Actions', align: 'center', key: 'actions' },
]
const versionHeaders = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Version ID', align: 'start', key: 'version_id' },
  { title: 'Type', align: 'start', key: 'item_type' },
  { title: 'Last Modified', align: 'start', key: 'last_modified' },
  { title: 'Size', align: 'start', key: 'size' },
  { title: 'Storage Class', align: 'start', key: 'storage_class' },
  { title: 'Actions', align: 'start', key: 'actions' },
  { title: '', align: 'center', key: 'data-table-expand', sortable: false },
]

const downloadFile = (url) => {
  // TODO Better Decoding needed
  const adjustedUrl = url.replace(/&amp;/g,'&')
  window.open(adjustedUrl, '_blank')
}
</script>
<style scoped></style>

