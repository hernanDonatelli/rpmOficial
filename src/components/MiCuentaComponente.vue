<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { userDatabaseStore } from '../stores/database';

const databaseStore = userDatabaseStore();
databaseStore.getUsers();

const $q = useQuasar()

const nombre = ref(null)
const apellido = ref(null)
const email = ref(null)
const movil = ref(null)

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
const onSubmitEdit = async () => {
  if (!nombre.value || !apellido.value || !email.value || !movil.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Debe completar todos los campos",
      timeout: 1000
    });
  }
//   else {

//     if (password.value != repassword.value) {
//       $q.notify({
//         color: "red-5",
//         textColor: "white",
//         icon: "warning",
//         message: "Las contraseñas no coinciden",
//         timeout: 1000
//       });
//     } else {
//       setTimeout(() => {
//         $q.notify({
//           color: "green-4",
//           textColor: "white",
//           icon: "cloud_done",
//           message: "El Registro fue exitoso!",
//           timeout: 1000
//         });

//       }, 1750)
//     }
//   }

  const editUser = {
    nombre: nombre.value,
    apellido: apellido.value,
    email: email.value,
    movil: movil.value,
  }
  console.log(editUser);

//   await userStore.registerUser(email.value, password.value, nombre.value, apellido.value, movil.value)

//   router.push('/')
};

const onResetEdit = () => {
  nombre.value = null;
  apellido.value = null;
  email.value = null;
  password.value = null;
  repassword.value = null;
  movil.value = null;
};
</script>

<template>
    <div class="row flex justify-center justify-md-center items-center">

        <!-- Tabla de datos actuales -->
        <div class="col-12 col-sm-6 q-pa-md">
            <ul class="q-pl-none" style="list-style: none;">
                <li v-for="usuario in databaseStore.documents" :key="usuario.id">
                    <p>
                        <q-icon color="red-10" name="las la-file-signature" />
                        Nombre: {{ usuario.nombre }}
                    </p>
                    <p>
                        <q-icon color="red-10" name="las la-signature" />
                        Apellido: {{ usuario.apellido }}
                    </p>

                    <p>
                        <q-icon color="red-10" name="las la-envelope" />
                        Email: {{ usuario.email }}
                    </p>

                    <p>
                        <q-icon color="red-10" name="las la-mobile-alt" />
                        Movil: {{ usuario.movil }}
                    </p>
                </li>
            </ul>
        </div>

        <!-- Formulario de edicion -->
        <div class="col-12 col-sm-6 col-md-5 q-pa-md">

            <h5>Editar Cuenta</h5>

            <q-form @submit="onSubmitEdit" @reset="onResetEdit" class="q-gutter-md">
                <div v-for="usuario in databaseStore.documents" :key="usuario.id">
                    <div class="row flex justify-between q-mb-lg">
                        <div class="col-12 col-sm-5">
                            <q-input filled dense color="cyan-6" v-model.trim="nombre" :label="usuario.nombre"
                                hint="Hasta 20 caracteres" lazy-rules :rules="nombreRules">
                            </q-input>
                        </div>
                        <div class="col-12 col-sm-5">
                            <q-input filled dense color="cyan-6" v-model.trim="apellido" :label="usuario.apellido"
                                hint="Hasta 20 caracteres" lazy-rules :rules="apellidoRules" />
                        </div>
                    </div>

                    <div class="row flex justify-between q-mb-lg">
                        <div class="col-12 col-sm-5">
                            <q-input filled dense color="cyan-6" type="email" v-model.trim="email" :label="usuario.email"
                                hint="Debe contener @ y dominio válido" lazy-rules :rules="emailRules" />
                        </div>
                        <div class="col-12 col-sm-5">
                            <q-input filled dense type="number" color="cyan-6" v-model.trim="movil" :label="usuario.movil"
                                hint="Con codigo de area, sin el 15" lazy-rules :rules="mobileRules" />
                        </div>
                    </div>
                </div>

                <div>
                    <q-btn label="Submit" type="submit" color="primary" />
                    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
            </q-form>

        </div>
    </div>
</template>


<style lang="scss" scoped>
ul li {
    .q-icon {
        font-size: 2rem;
    }
}

@media screen and (min-width: 1365.98px) {
    ul li {
        text-align: center;
    }
}
</style>