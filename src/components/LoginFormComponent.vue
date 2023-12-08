<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useUserStore } from '../stores/user'
import { useRouter } from "vue-router";

const router = useRouter()
const userStore = useUserStore()
const $q = useQuasar();

//Variables
const small = ref(false)
const emailPassword = ref('')
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

const recuperoPassword = async () => {
  if (emailPassword === '') {
    $q.notify({
      color: "red-13",
      textColor: "white",
      position: "top",
      icon: "warning",
      message: "Debe completar el email",
    });
  }

  await userStore.cambiarPassword(emailPassword.value)

  setTimeout(() => {
    window.location.reload()
  }, 3000);
}

const onReset = () => {
  email.value = null;
  password.value = null;
};
</script>

<template>
  <q-form @submit.prevent="handleSubmit" @reset="onReset" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase montserratExtraBold q-mb-none">Login</h5>
    <hr>
    <q-input class="q-mt-lg" dense color="cyan-6" type="email" v-model.trim="email" label="Tu email *" lazy-rules
      :rules="rulesEmail" />

    <q-input dense color="cyan-6" type="password" v-model.trim="password" label="Ingrese una contraseña *" lazy-rules
      :rules="rulesPassword" />

    <div class="btns-login q-ml-none">
      <q-btn :disabled="userStore.loadingUser" label="Ingresar" type="submit" color="teal-6" />
      <q-btn label="Limpiar Campos" type="reset" color="red-13" class="q-ml-sm" />
    </div>

    <div class="q-ml-none">
      <q-btn @click="small = true" class="btn-open" flat size="md" no-caps>Olvidó su contraseña?</q-btn>

      <q-dialog v-model="small">
        <q-card style="width: 400px">
          <q-card-section>
            <div class="title-recupero montserratRegular">Recuperar Contraseña</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense color="cyan-6" type="email" v-model.trim="emailPassword" label="Tu email *" lazy-rules
              :rules="rulesEmail" />
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn @click="recuperoPassword" :disable="emailPassword === ''" flat label="Enviar email" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-form>
</template>

<style lang="scss" scoped>
.btn-open {
  display: block;
  width: 100%;
}

.btns-login {
  display: flex;
  justify-content: space-between;
}

hr {
  width: 10%;
  border: 2.5px solid black;
  margin-top: 2%;
}

.title-recupero {
  font-weight: bold;
  text-transform: uppercase;
}</style>
