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
const movil = ref(null);
const nickname = ref(null);

//Validaciones
const nombreRules = [
  (v) => !!v || "Nombre es requerido",
  (v) =>
    (v && v.length <= 20) || "El nombre debe contener menos de 20 caracteres",
];
const apellidoRules = [
  (v) => !!v || "Apellido es requerido",
  (v) =>
    (v && v.length <= 30) || "El apellido debe contener menos de 30 caracteres",
];
const mobileRules = [
  (v) => !!v || "El numero de móvil es requerido",
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

const onSubmit = async () => {
  if (!nombre.value || !apellido.value || !email.value || !password.value || !repassword.value || !movil.value || !nickname.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      position: "center",
      message: "Debe completar todos los campos",
      timeout: 1000
    });
  } else {

    if (password.value != repassword.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        position: "center",
        message: "Las contraseñas no coinciden",
        timeout: 1000
      });
    } else {

      await userStore.registerUser(email.value, password.value, nombre.value, apellido.value, movil.value, nickname.value)

    }
  }


};

const onReset = () => {
  nombre.value = null;
  apellido.value = null;
  email.value = null;
  password.value = null;
  repassword.value = null;
  movil.value = null;
  nickname.value = null;
};
</script>

<template>
  <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase montserratExtraBold q-mb-none">Registrate</h5>
    <hr class="separador q-mt-sm">
    <div class="row flex justify-between">
      <div class="col-12 col-sm-4">
        <q-input dense color="cyan-6" v-model.trim="nombre" label="Nombre *" hint="Hasta 20 caracteres" lazy-rules
          :rules="nombreRules">
        </q-input>
      </div>
      <div class="col-12 col-sm-4">
        <q-input dense color="cyan-6" v-model.trim="apellido" label="Apellido *" hint="Hasta 20 caracteres" lazy-rules
          :rules="apellidoRules" />
      </div>
      <div>
        <q-input dense color="cyan-6" v-model.trim="nickname" label="Nickname *" hint="Hasta 20 caracteres" lazy-rules
          :rules="apellidoRules" />
      </div>
    </div>

    <div class="row flex justify-between">
      <div class="col-12 col-sm-5">
        <q-input dense color="cyan-6" type="email" v-model.trim="email" label="email *"
          hint="Debe contener @ y dominio válido" lazy-rules :rules="emailRules" />
      </div>
      <div class="col-12 col-sm-5">
        <q-input dense type="number" color="cyan-6" v-model.trim="movil" label="Móvil *"
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
    <div class="col-12 col-sm-3 flex justify-center">
      <q-btn label="Limpiar" type="reset" color="red-13" class="q-mr-md" />
      <q-btn :disabled="userStore.loadingUser" label="Registrarse" type="submit" color="teal-6" />
    </div>
  </q-form>
</template>

<style lang="scss" scoped>
.separador {
  height: 3px;
  background-color: black;
}
</style>
