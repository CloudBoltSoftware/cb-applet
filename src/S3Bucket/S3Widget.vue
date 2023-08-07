<!-- {% extends "dashboard/card.html" %}
{% load static %}
{% block card_id %}S3 Bucket Manager{% endblock %}
{% block heading %}S3 Bucket Manager{% endblock %}
{% block card_body %} -->
<template>
  <!-- It works but not displaying -->
<VSheet class="pa-3" rounded>
  <VSelect 
    label="Buckets:" 
    :items="buckets"
    item-title="name"
    item-value="id"
    return-object
    @update:modelValue="handleResourceSelection"
    />
  <BucketDisplay 
    :api="api" 
    :location="bucketDetails?.location"
    :resource="bucketDetails?.resource"
    :state="bucketDetails?.state"
    :update-resource-selection="updateResourceSelection" />
</VSheet>
<!-- <div class="panel panel-default" id="content-box">
  {% with buckets.0 as resource %}
  {% include "s3_file_manager/templates/tab.html"  %}
  {% endwith %}
</div> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import BucketDisplay from './BucketDisplay.vue'
/**
 * @typedef {object} Props
 * @property {ReturnType<import("@cloudbolt/js-sdk").createApi>} Props.api - The authenticated API instance
 */
/** @type {Props} */
const props = defineProps({
  api: {
    type: Object,
    required: true,
  },
});

const buckets = ref()
const bucketDetails = ref()
//  TODO Do this better. Especially the form thing
let token = sessionStorage.getItem("csrfToken");
if (token) {
  console.log({token})
  // eslint-disable-next-line vue/no-mutating-props
  props.api.base.instance.defaults.headers.common['X-CSRFTOKEN'] = token
  // eslint-disable-next-line vue/no-mutating-props
  props.api.base.instance.defaults.headers.common['CONTENT-TYPE'] = 'application/x-www-form-urlencoded; charset=UTF-8'
}

const handleResourceSelection = async (resource) => {
  console.log('handleResourceSelection', resource)
  try {
    const response = await props.api.base.instance.get(`http://localhost:8001/ajax/s3_browser_info/${resource.id}/`)
    console.log({response})
    bucketDetails.value = response.data
  } catch (error) {
    console.log({error})
  }
}

const getBuckets = async () => {
  try {
    console.log('get buckets ran')
    const response = await props.api.base.instance.get('http://localhost:8001/ajax/s3-list-buckets/')
    buckets.value = response.data.bucket_info
  } catch (error) {
    console.log({error})
  }
}

const updateResourceSelection = async (newResource) => {
  console.log('updateResourceSelection', {newResource})
  bucketDetails.value = newResource
}

onMounted(getBuckets)
  // // Handle the type-ahead for the dropdown
  // $("#buckets").selectize()

  // // Reload the S3 management screen when a new item is selected
  // $("#buckets").change(function() {
  //   c2.block.block();
  //   $("form#buckets").submit();
  //   $.ajax({
  //     url: '/ajax/s3-browser/' + $(this).val(),
  //     success: function(data) {
  //       $("#repoContent").html(data);
  //       c2.block.unblock();
  //     },
  //     error: function(err) {
  //       $("#loading-box").fadeOut("slow",
  //         function() {
  //           $("#repoContent").html(err);
  //           c2.block.unblock();
  //         });
  //     }
  //   });
  // });
</script>
<style scoped></style>