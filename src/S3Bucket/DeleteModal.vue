<template>
  <VDialog v-model="deleteDialog" width="1024">
  <!-- <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true"> -->
    <template #activator="{ props: deleteProps }" >
      <!-- disabled conditioal -->
      <VBtn v-bind="deleteProps" icon="mdi-delete" title="Delete" size="x-large"/>
    </template>
    <VCard class="py-3" density="compact">
      <VCardTitle class="d-flex justify-space-between text-h5">
        Delete Confirmation
        <VBtn icon="mdi-close" title="Close this dialog" data-dismiss="modal" variant="text" @click="deleteDialog = false"/>
      </VCardTitle>
      <VCardText class="py-0">
        <p>Are you sure you want to delete?</p>
        <p class="text-caption">Note: If you have selected the folder, all objects in that folder will also be deleted.</p>    
      </VCardText>
      <VCardAction class="d-flex justify-end px-3">
        <!-- data-dismiss="modal" -->
        <VBtn prepend-icon="mdi-close" variant="flat" size="large" class="px-4 mx-2" @click="deleteDialog = false">Cancel</VBtn>
        <!-- data-path="" data-file_path="" data-loading-text="Submitting…" id="confirm-delete" -->
        <VBtn prepend-icon="mdi-delete" variant="flat" color="primary" size="large" class="px-4" @click="deleteDialog = false">Delete</VBtn>
      </VCardAction>
    </VCard>
  <!-- </div> -->
  </VDialog>
</template>
    
<script setup>
import { ref } from "vue";

const deleteDialog=ref(false)
</script>
<style scoped></style>