<template>
  <VMenu>
    <template v-slot:activator="{ props }">
      <VBtn color="primary" v-bind="props"> Activator slot </VBtn>
    </template>
    <VList>
      <VListItem v-for="(item, index) in items" :key="index" :value="index">
        <VListItemTitle>{{ item.title }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script setup>
import {
  VBtn,
  VList,
  VListItem,
  VListItemTitle,
  VMenu,
} from "vuetify/components";

const items = [{ title: "Item 1" }, { title: "Item 2" }, { title: "Item 3" }];
</script>

<style scoped></style>
