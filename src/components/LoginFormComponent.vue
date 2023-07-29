<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useUserStore } from '../stores/user'
import { useRouter } from "vue-router";

const router = useRouter()
const userStore = useUserStore()
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
const handleSubmit = async () => {
  if (!email.value || !password.value) {
    $q.notify({
      color: "red-13",
      textColor: "white",
      position: "center",
      icon: "warning",
      message: "Debe completar ambos campos",
    });

  } else {
    await userStore.loginUser(email.value, password.value);

    await router.push('/');
  }

};

const onReset = () => {
  email.value = null;
  password.value = null;
};
</script>

<template>
  <q-form @submit.prevent="handleSubmit" @reset="onReset" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase">Login</h5>
    <q-input dense color="cyan-6" type="email" v-model.trim="email" label="Tu email *" lazy-rules :rules="rulesEmail" />

    <q-input dense color="cyan-6" type="password" v-model.trim="password" label="Ingrese una contraseña *" lazy-rules
      :rules="rulesPassword" />

    <div>
      <q-btn :disabled="userStore.loadingUser" label="Ingresar" type="submit" color="primary" />
      <q-btn label="Limpiar Campos" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<style lang="scss" scoped></style>
