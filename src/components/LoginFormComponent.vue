<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";

const $q = useQuasar();

//Variables
const email = ref(null);
const password = ref(null);
const rulesEmail = [
  [
    (v) => !!v || "El e-mail es requerido",
    (v) => /.+@.+\..+/.test(v) || "El e-mail debe ser válido",
  ],
];
const rulesPassword = [
  (value) => !!value || "Requerido",
  (v) => v.length >= 6 || "Min 6 caracteres",
];
//Metodos
const onSubmit = () => {
  if (!email || !password) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Debe completar ambos campos",
    });
  } else {
    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Submitted",
    });
    console.log("inicio exitoso");
  }
};

const onReset = () => {
  email.value = null;
  password.value = null;
};
</script>

<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase">Login</h5>
    <q-input
      dense
      color="cyan-6"
      type="email"
      v-model="email"
      label="Tu email *"
      lazy-rules
      :rules="rulesEmail"
    />

    <q-input
      dense
      color="cyan-6"
      type="password"
      v-model="password"
      label="Ingrese una contraseña *"
      lazy-rules
      :rules="rulesPassword"
    />

    <div>
      <q-btn label="Ingresar" type="submit" color="primary" />
      <q-btn label="Limpiar Campos" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<style lang="scss" scoped></style>
