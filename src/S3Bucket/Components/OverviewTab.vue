<template>
  <VContainer>
    <VRow>
      <VCol cols="6">
        <div class="mb-3">
          <div class="text-medium-emphasis">Owner</div>
          <p>{{ sourceItem.owner_name }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">AWS Region</div>
          <p>{{ location }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">Last Modified</div>
          <p>{{  sourceItem.last_modified }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">Size</div>
          <p>{{  sourceItem.size }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">Type</div>
          <p>{{ sourceItem.item_type }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">Key</div>
          <p>{{ sourceItem.name }}</p>
        </div>
        <!-- TODO: Remove? Not visible -->
        <div id="kfp-parent" class="d-none">
          <p>{{ sourceItem.key }}</p>
        </div>
      </VCol>
      <VCol cols="6" >
        <div class="mb-3">
          <div class="text-medium-emphasis">S3 URI</div>
          <p>{{ sourceItem.s3_uri }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">Amazon Resource Name (ARN)</div>
          <p>{{ sourceItem.arn }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">Entity Tag (ETag)</div>
          <p>{{ eTag }}</p>
        </div>
        <div class="mb-3">
          <div class="text-medium-emphasis">Object URL</div>
          <a target="_blank" :href="sourceItem.object_url" class="text-decoration-none text-primary" >{{ sourceItem.object_url }}</a>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>
    
<script setup>
import { computed } from "vue";
/**
 * @typedef {Object} sourceItem
 * @property {String} owner_name // TODO: Removed
 * @property {String} last_modified
 * @property {String} size
 * @property {String} item_type
 * @property {String} name
 * @property {String} key
 * @property {String} keyFilePath // TODO: Changed
 * @property {String} s3_uri
 * @property {String} arn
 * @property {String} e_tag  // TODO: Removed
 * @property {String} object_url // TODO: Changed
 */

/**
 * @typedef {Object} Props
 * @property {Object} Props.sourceItem - The selected S3 Bucket item
 * @property {String} Props.location - The selected S3 Bucket location
 */
/** @type {Props} */

const props = defineProps({
  sourceItem: {
    type: Object,
    default: () => {}
  },
  location: {
    type: String,
    default: '',
  }
});

const eTag = computed(() => props.sourceItem?.e_tag ? props.sourceItem.e_tag.replace(/&quot;/g, '"') : '')
</script>
<style scoped></style>
