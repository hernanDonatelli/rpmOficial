<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useUserStore } from '../stores/user'
import { useRouter } from "vue-router";

const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();

//Variables
const nombre = ref(null);
const apellido = ref(null);
const email = ref(null);
const password = ref(null);
const repassword = ref(null);
const mobile = ref(null);

//Validaciones
const nombreRules = [
  (v) => !!v || "Nombre es requerido",
  (v) =>
    (v && v.length <= 20) || "El nombre debe contener menos de 20 caracteres",
];
const apellidoRules = [
  (v) => !!v || "Apellido es requerido",
  (v) =>
    (v && v.length <= 20) || "El apellido debe contener menos de 20 caracteres",
];
const mobileRules = [
  (v) => !!v || "El numero de móvil es requerido",
  (v) =>
    (v && v.length >= 1 && v.length <= 10) ||
    "El movil debe ser de 10 caracteres",
];
const emailRules = [
  (v) => !!v || "E-mail es requerido",
  (v) => /.+@.+\..+/.test(v) || "E-mail debe ser válido",
];
const passwordRules = [
  (value) => !!value || "Requerido.",
  (v) => v.length >= 6 || "Min 6 caracteres",
];

//Metodos
const onSubmit = async() => {
  if (!nombre.value || !apellido.value || !email.value || !password.value || !repassword.value || !mobile.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Debe completar todos los campos",
      timeout: 1000
    });
  } else {

    if (password.value != repassword.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Las contraseñas no coinciden",
        timeout: 1000
      });
    } else {
      setTimeout(() => {
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "El Registro fue exitoso!",
          timeout: 1000
        });

      }, 1750)
    }
  }
  await userStore.registerUser(email.value, password.value)

  router.push('/')
};

const onReset = () => {
  nombre.value = null;
  apellido.value = null;
  email.value = null;
  password.value = null;
  repassword.value = null;
  mobile.value = null;
};
</script>

<template>
  <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase">Registro</h5>

    <div class="row flex justify-between">
      <div class="col-12 col-sm-5">
        <q-input dense color="cyan-6" v-model.trim="nombre" label="Nombre *" hint="Hasta 20 caracteres" lazy-rules
          :rules="nombreRules">
        </q-input>
      </div>
      <div class="col-12 col-sm-5">
        <q-input dense color="cyan-6" v-model.trim="apellido" label="Apellido *" hint="Hasta 20 caracteres" lazy-rules
          :rules="apellidoRules" />
      </div>
    </div>

    <div class="row flex justify-between">
      <div class="col-12 col-sm-5">
        <q-input dense color="cyan-6" type="email" v-model.trim="email" label="email *"
          hint="Debe contener @ y dominio válido" lazy-rules :rules="emailRules" />
      </div>
      <div class="col-12 col-sm-5">
        <q-input dense type="number" color="cyan-6" v-model.trim="mobile" label="Móvil *"
          hint="Con codigo de area, sin el 15" lazy-rules :rules="mobileRules" />
      </div>
    </div>
    <div class="row flex justify-between">
      <div class="col-12 col-sm-5">
        <q-input dense color="cyan-6" type="password" v-model.trim="password" label="Ingrese una contraseña *" lazy-rules
          :rules="passwordRules" />
      </div>
      <div class="col-12 col-sm-5">
        <q-input dense color="cyan-6" type="password" v-model.trim="repassword" label="Reingrese la contraseña *"
          lazy-rules :rules="passwordRules" />
      </div>
    </div>
    <div>
      <q-btn :disabled="userStore.loadingUser" label="Registrarse" type="submit" color="primary" />
      <q-btn label="Limpiar Formulario" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<style lang="scss" scoped></style>
