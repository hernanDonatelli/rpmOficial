<script setup>
import LoginFormComponent from "./LoginFormComponent.vue";
import { ref } from "vue";

const openModal = ref(false);
</script>

<template>
  <q-dialog v-model="openModal">
    <q-card style="width: 450px; max-width: 80vw">
      <login-form-component />
    </q-card>
  </q-dialog>
  <q-btn
    @click="openModal = true"
    class="q-mr-sm"
    size="sm"
    color="teal-6"
    style="color: lightgrey"
    label="Login"
  />
</template>


<style lang="scss" scoped>

</style>
