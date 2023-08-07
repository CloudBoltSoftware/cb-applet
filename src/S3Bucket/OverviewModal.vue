<template>
  <VDialog v-model="overviewDialog" width="1024">
  <!-- <div class="modal fade" id="objectOverviewModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
  <div class="modal-dialog modal-sm">
  <div class="modal-content"> -->
    <template #activator="{ props: overviewProps }" >
      <!-- id="create_btn" -->
      <VBtn v-bind="overviewProps" icon="mdi-information" title="Details" />
    </template>
    <VCard class="py-3">
      <VCardTitle class="d-flex justify-space-between pb-0">
        <VTabs v-model="tab" slider-color="black" height="50px" selected-class="bg-primary text-white" @update:model-value="(val) => handleVersionInfo(val)">
          <!--  id="overview-btn" data-type="overview" data-toggle="tab" -->
          <VTab class="active tab-btn" value="overview" size="x-large">Overview</VTab>
          <!-- id="versions-btn" data-type="versions" data-toggle="tab" -->
          <VTab class="tab-btn" value="versions" size="x-large" >Versions</VTab>
        </VTabs>
        <!-- data-dismiss="modal"  -->
        <VBtn icon="mdi-close" title="Close this dialog" variant="text" @click="overviewDialog = false" />
      </VCardTitle>
      <VCardText class="pt-0">
        <!-- id="createFolderForm" action="#" method="post" enctype="multipart/form-data" -->
        <!-- <VForm @submit.prevent="submitModal"> -->
        <!-- <div v-if="isLoading" id='modal-loading-box' class="text-center">
        <VProgressCircular indeterminate />
        </div> -->
        <VWindow v-model="tab" @update:model-value="handleVersionInfo">
          <VWindowItem value="overview">
            <!-- id="overview-div" -->
            <VContainer>
              <VRow>
                <VCol cols="6">
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Owner</div>
                    <p>{{ item.owner_name }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">AWS Region</div>
                    <p>{{ location }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Last Modified</div>
                    <p>{{  item.last_modified }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Size</div>
                    <p>{{  item.size }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Type</div>
                    <p>{{ item.item_type }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Key</div>
                    <p>{{ item.name }}</p>
                  </div>
                  <!-- Not visible -->
                  <div id="kfp-parent" class="d-none">
                    <p>{{  item.key }}</p>
                  </div>
                </VCol>
                <!-- class="overview-modal-right-pane" -->
                <VCol cols="6" >
                  <div class="mb-3">
                    <div class="text-medium-emphasis">S3 URI</div>
                    <p>{{ item.s3_uri }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Amazon Resource Name (ARN)</div>
                    <p>{{ item.arn }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Entity Tag (ETag)</div>
                    <p>{{ eTag }}</p>
                  </div>
                  <div class="mb-3">
                    <div class="text-medium-emphasis">Object URL</div>
                    <!-- <a id="object_url" target="_blank" href="#"></a> -->
                    <a target="_blank" :href="item.object_url" class="text-decoration-none text-primary" >{{ item.object_url }}</a>
                  </div>
                </VCol>
              </VRow>
            </VContainer>
          </VWindowItem>
          <VWindowItem value="versions">
            <!--  id="versions-div" -->
            <!-- <VCol cols="12"> -->
              <!-- <div class=" col-sm-12 version-alert-div"> -->
              <!-- <VCol cols="1">
                <p class="version-alert-icon"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></p>
              </VCol>
              <VCol cols="8"> -->

              <VProgressCircular v-if="isLoading" indeterminate />
              <div v-else>
                <!-- TODO: this BANNER is probably a conditional -->
                <VBanner v-if="!versionInfo.status">
                  <template #prepend>
                    <VIcon
                      color="error"
                      icon="mdi-alert"
                      class="text-h2"
                    />
                  </template>
                  <VBannerText class="d-flex justify-space-between pa-0">
                    <div class="mr-6">
                      <!-- <p class="version-alert-name">Bucket "{{ resource.name }}" doesn't have Bucket Versioning enabled</p> -->
                      <p class="text-h5 mb-2">Bucket {{ resource.name }} doesn't have Bucket Versioning enabled</p>
                      <!-- class="version-alert-message" -->
                      <p class="text-body-1">We recommend that you enable Bucket Versioning to help protect against unintentionally overwriting or deleting objects. 
                        <VBtn append-icon="mdi-information" href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html" target="_blank" variant="text" class="text-capitalize font-weight-regular text-body-1">Learn more</VBtn>
                      </p>
                    </div>
                    <!-- class="enable-btn" -->
                    <VBtn title="Enable Bucket Versioning" color="primary" variant="flat" size="large" @click="enableVersioning">Enable Bucket Versioning</VBtn>
                  </VBannerText>
                </VBanner>
                <!-- </VCol> -->
                <!-- </div> -->
                <!-- VTable id="version-table" data-table> -->
                <VDataTable>
                  <thead>
                    <tr>
                      <th><VIcon icon="mdi-cog"/></th>
                      <th>Filename</th>
                      <th>Version ID</th>
                      <th>Type</th>
                      <th>Last Modified</th>
                      <th>Size</th>
                      <th>Storage Class</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <!-- id="versions-list" -->
                  <tbody
                    :items="[]">
                  </tbody>
                </VDataTable>
              </div>
            <!-- </VCol> -->
          </VWindowItem>
        </VWindow>
        <!-- </VForm> -->
      </VCardText>
      <VCardActions class="d-flex justify-end px-3">
        <!-- data-dismiss="modal" -->
        <VBtn color="primary" variant="flat" size="large" class="px-4" @click="overviewDialog = false">OK</VBtn>
      </VCardActions>
    </VCard>
  <!-- </div>
  </div>
  </div> -->
  </VDialog>
</template>
    
<script setup>
import { computed, ref } from "vue";

/**
 * @typedef {Object} item
 * @property {String} owner_name source object globalId
 * @property {String} last_modified
 * @property {String} size
 * @property {String} item_type
 * @property {String} name
 * @property {String} key
 * @property {String} keyFilePath
 * @property {String} s3_uri
 * @property {String} arn
 * @property {String} e_tag
 * @property {String} object_url
 */

/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 * @property {object} Props.item - The selected S3 Bucket
 * @property {string} Props.location - The selected S3 Bucket
 * @property {object} Props.resource - The selected S3 Bucket
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
  location: {
    type: String,
    default: '',
  },
  resource: {
    type: Object,
    default: () => {},
  },
});

const tab = ref(null)
const versionInfo = ref()
// const versioningEnabled = ref()
const eTag = computed(() => props.item.e_tag.replace(/&quot;/g, '"'))
const isLoading = ref(false)
const overviewDialog = ref(false)

const handleVersionInfo = async (val) => {
  console.log('handle tigger', val)
  if (tab.value === 'versions') {
    console.log('handleVersionInfo', )
    try {
      const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-get-versions/${props.resource.id}/`,
      `e_tag=${encodeURIComponent(eTag.value)}&key=${encodeURIComponent(props.item.key)}&location=${encodeURIComponent(props.location)}`)
      console.log({response})
      isLoading.value = false
      versionInfo.value = response.data
    } catch (error) {
      console.log({error})
    }
  }
  // e_tag=%229ffeb8bcc9a55a7b7a589d783ab2af75%22&key=2022-03-14T235035Z%2F9.4.6.1%2Fblueprints.json&location=us-east-1
  // e_tag=%229ffeb8bcc9a55a7b7a589d783ab2af75%22&key=2022-03-14T235035Z%2F9.4.6.1%2Fblueprints.json&location=us-east-1
}

const enableVersioning = async () => {
  // TODO : Find out how this works
  console.log('enableVersioning')
  try {
    // const response = await props.api.base.instance.post(`http://localhost:8001/ajax/s3-enable-versioning/${props.resource.id}/`,
    // `form data I don't know`)
    // console.log({response})
    // versioningEnabled.value = response.data
  } catch (error) {
    console.log({error})
  }
}

</script>
<style scoped></style>