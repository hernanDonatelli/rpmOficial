<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useUserStore } from '../stores/user'
import { useRouter } from "vue-router";
import { userDatabaseStore } from "src/stores/database";

const router = useRouter()
const userStore = useUserStore()
const $q = useQuasar();
const userDatabase = userDatabaseStore()

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
const submitDenuncia = async() => {
  if (!email.value || !password.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Debe completar ambos campos",
    });
  } else {
    setTimeout(() => {
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Ingreso exitoso!",
          timeout: 1000
        });

      }, 1000)

      // await userStore.loginUser(email.value, password.value)

      // await router.push('/')
  }

};

const onResetForm = () => {
  email.value = null;
  password.value = null;
};
</script>

<template>
  <q-form @submit.prevent="submitDenuncia" @reset="onResetForm" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase">Denuncia</h5>
    <q-input v-for="user of userDatabase.documents" :key="user.id"
      dense
      color="cyan-6"
      type="text"
      :label="(user.email)"
      lazy-rules
      disable
    />
    
    <q-input
      dense
      color="cyan-6"
      type="password"
      v-model.trim="password"
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


<style lang="scss">

</style>
