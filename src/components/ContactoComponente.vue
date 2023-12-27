<script setup>
import FooterComponent from "./FooterComponent.vue";
import { useQuasar } from "quasar";
import { reactive } from "vue";
import { userDatabaseStore } from "src/stores/database";
import { useApiStore } from "src/stores/api";
const $q = useQuasar();
const userDatabase = userDatabaseStore()
const useApi = useApiStore()


//Variables

const contacto = reactive({
  tipoComunicacion: 'contacto',
  emailDestinatario: 'hernandonatelli@gmail.com',
  emailRemitente: '',
  user: '',
  movil: '',
  comentarios: ''
})

//Validaciones
const nombreRules = [
  (v) => !!v || "Nombre es requerido",
  (v) =>
    (v && v.length <= 20) || "El nombre debe contener menos de 20 caracteres",
];

const mobileRules = [
  (v) => !!v || "El numero de móvil es requerido",
  (v) =>
    (v && v.length >= 1 && v.length <= 15) ||
    "Máximo 15 caracteres",
];

const rulesEmail = [
  (v) => !!v || "El e-mail es requerido",
  (v) => /.+@.+\..+/.test(v) || "El e-mail debe ser válido",
];

//Metodos
const submitContact = async () => {
  // console.log(instante.value);
  if (!contacto.emailRemitente || !contacto.user || !contacto.movil || !contacto.comentarios || !contacto.tipoComunicacion) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      position: "top",
      message: "Todos los campos son obligatorios",
    });
  } else {
    if (contacto.emailRemitente === userDatabase.documents[0].email) {

      const sendContact = {
        tipoComunicacion: contacto.tipoComunicacion,
        emailDestinatario: contacto.emailDestinatario,
        emailRemitente: contacto.emailRemitente,
        user: contacto.user,
        movil: contacto.movil,
        comentarios: contacto.comentarios
      }

      //console.log(sendContact);
      await useApi.enviarComunicacionAPI(useApi.tokenApi, sendContact)

      // setTimeout(() => {
      //   router.push('/')
      // }, 3000);


    } else {
      $q.notify({
        color: "red-6",
        textColor: "white",
        icon: "warning",
        position: "top",
        message: "El email debe ser el mismo con el cual te haz registrado.",
      });
    }
  }

};

const limpiarCampos = () => {
  contacto.user = ''
  contacto.email = ''
  contacto.movil = ''
  contacto.mensaje = ''
};


</script>

<template>
  <section id="contacto">
    <div class="row items-center justify-center">
      <div class="col-12 col-md-8 col-lg-7">
        <h4 class="text-h4 text-center text-uppercase montserratExtraBold q-mb-none">Contacto</h4>
        <hr>
        <p class="sub-contacto text-center text-body2 q-mt-md">
          Estar comunicados es muy importante! Escribenos completando el formulario sobre las dudas o temas que creas
          conveniente aclarar las dudas. Nos contactaremos lo mas pronto posible!
        </p>
      </div>

      <div class="col-12 col-md-8 col-lg-7 q-pa-md">
        <q-form @submit.prevent="submitContact" class="q-gutter-md">
          <div class="row flex justify-around q-mb-lg">
            <div class="col-12 col-sm-10 col-md-10">
              <q-input dense color="cyan-6" v-model.trim="contacto.user" label="Nombre ó Nickname *"
                hint="Hasta 20 caracteres" lazy-rules :rules="nombreRules" />

              <q-input class="q-my-md" dense color="cyan-6" type="email" label="Tu email *"
                hint="Mismo email con el cual te registraste." lazy-rules v-model.trim="contacto.emailRemitente"
                :rules="rulesEmail" />

              <q-input class="q-my-md" dense type="number" color="cyan-6" v-model.trim="contacto.movil" label="Móvil"
                hint="Con codigo de area, sin el 15" lazy-rules :rules="mobileRules" />

              <q-input class="q-my-md" color="cyan-6" v-model="contacto.comentarios" hint="Escribe tu mensaje aquí" filled
                type="textarea" />
            </div>
          </div>

          <div class="row flex justify-center items-center">
            <q-btn @click="limpiarCampos" label="Limpiar Campos" type="reset" color="red-13" class="q-mr-xl" />
            <q-btn label="Enviar Mensaje" type="submit" color="teal-6" />
          </div>

        </q-form>
      </div>
    </div>
  </section>

  <FooterComponent />
</template>


<style lang="scss">
#contacto {
  max-width: 95%;
  margin: 2rem auto;

  h4{
    margin-top: 5rem;
  }

  hr {
    width: 10%;
    border: 2.5px solid black;
    margin-top: 1%;
  }
}

@media screen and (min-width: 1919.98px) {

  #contacto {

    .sub-contacto {
      padding: 0 8rem;
    }
  }
}
</style>
