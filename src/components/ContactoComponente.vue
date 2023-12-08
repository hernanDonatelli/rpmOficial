<script setup>
import { useQuasar } from "quasar";
import { reactive } from "vue";
import { userDatabaseStore } from "src/stores/database";
const $q = useQuasar();
const userDatabase = userDatabaseStore()


//Variables

const contacto = reactive({
  tipoComunicacion: 'Contacto',
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
const submitContact = () => {
  // console.log(instante.value);
  if (!contacto.emailRemitente || !contacto.user || !contacto.movil || !contacto.comentarios ) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      position: "top",
      message: "Todos los campos son obligatorios",
    });
  } else {
    if (contacto.emailRemitente === userDatabase.documents[0].email) {

        console.log('Consulta enviada!', contacto);

          $q.notify({
            color: "teal-6",
            textColor: "white",
            icon: "cloud_done",
            message: "Consulta enviada! Nos comunicaremos contigo dentro de las próximas 48hs.",
            position: "top",
            timeout: 3000
          });

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
    <div class="row items-center">
      <div class="col-12 col-md-5 q-pa-md q-mt-lg q-mt-md-none">
        <h4 class="text-h4 text-center text-uppercase montserratExtraBold q-my-none">Contacto</h4>
        <hr>
        <p class="text-center text-body2 q-mt-md">
          Estar comunicados es muy importante! Escribenos completando el formulario sobre las dudas o temas que creas
          conveniente aclarar las dudas. Nos contactaremos lo mas pronto posible!
        </p>
      </div>

      <div class="col-12 col-md-7 q-pa-md">
        <q-form @submit.prevent="submitContact" class="q-gutter-md">
          <div class="row flex justify-around q-mb-lg">
            <div class="col-12 col-sm-10 col-md-10">
              <q-input dense color="cyan-6" v-model.trim="contacto.user" label="Nombre ó Nickname *" hint="Hasta 20 caracteres"
                lazy-rules :rules="nombreRules" />

              <q-input class="q-my-md" dense color="cyan-6" type="email" label="Tu email *"
                hint="Mismo email con el cual te registraste." lazy-rules v-model.trim="contacto.emailRemitente"
                :rules="rulesEmail" />

              <q-input class="q-my-md" dense type="number" color="cyan-6" v-model.trim="contacto.movil" label="Móvil"
                hint="Con codigo de area, sin el 15" lazy-rules :rules="mobileRules" />

              <q-input class="q-my-md" color="cyan-6" v-model="contacto.comentarios" hint="Escribe tu mensaje aquí" filled
                type="textarea" />
            </div>
          </div>

          <div class="row flex justify-center">
            <q-btn @click="limpiarCampos" label="Limpiar Campos" type="reset" color="red-13" class="q-mr-xl" />
            <q-btn label="Enviar Mensaje" type="submit" color="teal-6" icon-right="mail" />
          </div>

        </q-form>
      </div>
    </div>

  </section>
</template>


<style lang="scss">
#contacto {
  max-width: 95%;

  hr {
    width: 10%;
    border: 2.5px solid black;
    margin-top: 2%;
  }
}
</style>
