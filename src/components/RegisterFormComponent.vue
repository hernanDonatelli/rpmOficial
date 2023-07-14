<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";

const $q = useQuasar();

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
const onSubmit = () => {
  if (!nombre || !apellido || !email || !password || !repassword || !mobile) {
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
  nombre.value = null;
  apellido.value = null;
  email.value = null;
  password.value = null;
  repassword.value = null;
  mobile.value = null;
};
</script>

<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase">Registro</h5>

    <div class="row flex justify-between">
      <div class="col-12 col-sm-5">
        <q-input
          dense
          color="cyan-6"
          v-model="nombre"
          label="Tu nombre *"
          hint="Hasta 20 caracteres"
          lazy-rules
          :rules="nombreRules"
        >
        </q-input>
      </div>
      <div class="col-12 col-sm-5">
        <q-input
          dense
          color="cyan-6"
          v-model="apellido"
          label="Tu apellido *"
          hint="Hasta 20 caracteres"
          lazy-rules
          :rules="apellidoRules"
        />
      </div>
    </div>

    <div class="row flex justify-between">
      <div class="col-12 col-sm-5">
        <q-input
          dense
          color="cyan-6"
          type="email"
          v-model="email"
          label="Tu email *"
          hint="Debe contener @ y dominio válido"
          lazy-rules
          :rules="emailRules"
        />
      </div>
      <div class="col-12 col-sm-5">
        <q-input
          dense
          type="number"
          color="cyan-6"
          v-model="mobile"
          label="Tu numero de móvil *"
          hint="Con codigo de area, sin el 15"
          lazy-rules
          :rules="mobileRules"
        />
      </div>
    </div>
    <div class="row flex justify-between">
      <div class="col-12 col-sm-5">
        <q-input
          dense
          color="cyan-6"
          type="password"
          v-model="password"
          label="Ingrese una contraseña *"
          lazy-rules
          :rules="passwordRules"
        />
      </div>
      <div class="col-12 col-sm-5">
        <q-input
          dense
          color="cyan-6"
          type="password"
          v-model="repassword"
          label="Reingrese la contraseña *"
          lazy-rules
          :rules="passwordRules"
        />
      </div>
    </div>
    <div>
      <q-btn label="Registrarse" type="submit" color="primary" />
      <q-btn
        label="Limpiar Formulario"
        type="reset"
        color="primary"
        flat
        class="q-ml-sm"
      />
    </div>
  </q-form>
</template>

<style lang="scss" scoped></style>
