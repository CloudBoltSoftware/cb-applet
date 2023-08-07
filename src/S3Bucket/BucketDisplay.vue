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
    <VBtnGroup>
      <VBtn icon="mdi-file-download" title="Download" disabled  size="x-large"/>
      <!-- <VBtn icon="mdi-delete" title="Delete" disabled size="large"/> -->
      <DeleteModal />
      <!-- <VBtn id="upload_btn" icon="mdi-file-upload" title="Upload New File" size="large"/> -->
      <UploadModal />
      <!-- <VBtn id="create_btn" icon="mdi-folder-plus" class="btn btn-link" title="Add New Folder" size="large"/> -->
      <CreateModal />
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
          >
          <template #[`item.name`]="{ item }">
            <td class="d-inline-flex">
                <VIcon
                  :icon="item.raw.item_type === 'Folder' ? 'mdi-folder' : 'mdi-file'"
                />
                <!-- is_file: true -->
                <BucketButton 
                v-if="item.raw.item_type === 'Folder'"
                :id="resource.id"
                :item="item.raw"
                :api="api"
                @update:updateResourceSelection="(val) => updateResourceSelection(val)"
                />
                <div v-else>{{ item.raw.name }}</div>

            </td>
          </template> 
          <template #[`item.actions`]="{ item }">
            <td v-if="item.raw.is_file" class="d-inline-flex">
              <VBtnGroup>
                <RenameModal :api="api" :item="item.raw" />
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
import BucketButton from "./BucketButton.vue";
import CreateModal from "./CreateModal.vue";
import DeleteModal from "./DeleteModal.vue";
import OverviewModal from "./OverviewModal.vue";
import RenameModal from "./RenameModal.vue";
import UploadModal from "./UploadModal.vue";
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.resource - The selected S3 Bucket
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
});

const flattenView = ref(false)
const isLoading = ref(false)

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Type', align: 'end', key: 'item_type' },
  { title: 'Last Modified', align: 'end', key: 'last_modified' },
  { title: 'Size', align: 'end', key: 'size' },
  { title: 'Storage Class', align: 'end', key: 'storage_class' },
  { title: 'Actions', align: 'end', key: 'actions' },
]
const breadcrumbs = computed(() => {
  console.log(props.resource)
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
  console.log({crumbsArray})
  // Disable the last link
  const lastLink = crumbsArray[crumbsArray.length-1]
  lastLink.disabled = true
  lastLink.color = 'black'
  return crumbsArray
})

const flattenSelection = async (event) => {
  console.l
  console.log('flattenSelection', event)
  // TODO Not able to unflatten currently
  console.log('flattenView', flattenView.value)
  try {
    flattenView.value = !flattenView.value
    const response3 = await props.api.base.instance.post(`http://localhost:8001/ajax/s3_browser_info/${props.resource.id}/`, 
      `path=&flat=True`)
    console.log({response3})
    props.updateResourceSelection(response3.data);
  } catch (error) {
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
