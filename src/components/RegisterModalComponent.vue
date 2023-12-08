<script setup>
import RegisterFormComponent from "./RegisterFormComponent.vue";
import { ref } from "vue";

const openModalRegister = ref(false);
</script>

<template>
  <q-dialog v-model="openModalRegister">
    <q-card class="q-pa-xl" style="width: 700px; max-width: 80vw; height: 70vh; max-height: 90vh">
      <register-form-component />
    </q-card>
  </q-dialog>
  <q-btn
    @click="openModalRegister = true"
    class="q-mr-sm btn-register"
    size="sm"
    color="blue-grey-7"
    style="color: lightgrey"
    label="Registrate"
  />
</template>


<style lang="scss" scoped>

</style>
