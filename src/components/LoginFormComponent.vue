<script setup>
import FooterComponent from "./FooterComponent.vue";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useUserStore } from '../stores/user'

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

  // setTimeout(() => {
  //   window.location.reload()
  // }, 3000);
}

const onReset = () => {
  email.value = null;
  password.value = null;
};
</script>

<template>
  <section id="loginPage">
    <div class="row flex justify-center">
      <div class="formulario col-12 col-md-12">
        <q-form @submit.prevent="handleSubmit" @reset="onReset" class="q-gutter-md q-mx-none q-pr-md">
          <h5 class="text-h5 text-uppercase montserratExtraBold q-mb-none">Login</h5>
          <hr>
          <q-input class="q-mt-lg" dense color="cyan-6" type="email" v-model.trim="email" label="Tu email *" lazy-rules
            :rules="rulesEmail">
            <template v-slot:append>
              <q-icon name="las la-at" color="blue-grey-4" />
            </template>
          </q-input>

          <q-input dense color="cyan-6" type="password" v-model.trim="password" label="Ingrese una contraseña *"
            lazy-rules :rules="rulesPassword">
            <template v-slot:append>
              <q-icon name="las la-lock" color="blue-grey-4" />
            </template>
          </q-input>

          <div class="btns-login q-ml-none">
            <q-btn label="Limpiar" type="reset" color="red-13" class="q-ml-sm" />
            <q-btn label="Ingresar" type="submit" color="teal-6" />
          </div>

          <div class="q-ml-none">
            <q-btn @click="small = true" class="btn-open" flat size="md" no-caps>Olvidó su contraseña?</q-btn>

            <q-dialog v-model="small">
              <q-card style="width: 400px">
                <q-card-section>
                  <div class="text-body1 text-uppercase montserratExtraBold q-mb-none">Recuperar Contraseña</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input dense color="cyan-6" type="email" v-model.trim="emailPassword" label="Tu email *" lazy-rules
                    :rules="rulesEmail" />
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn @click="recuperoPassword" :disable="emailPassword === ''" color="teal-6" label="Enviar email"
                    v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-form>
      </div>
    </div>

  </section>
</template>

<style lang="scss" scoped>
#loginPage {
  background-image: repeating-linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9)),
    url(../assets/background.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .formulario {
    padding: 4rem 0;
  }

  .btn-open {
    display: block;
    width: 70%;
    margin: 0 auto;
    line-height: 2.4rem;
  }

  .btns-login {
    display: flex;
    justify-content: space-around;
  }

  hr {
    width: 10%;
    border: 2.5px solid black;
    margin-top: 2%;
  }

  .title-recupero {
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>