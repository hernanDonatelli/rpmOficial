<script setup>
import { useQuasar } from "quasar";
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from '../stores/user'
import { useRouter } from "vue-router";
import { userDatabaseStore } from "src/stores/database";
import { useApiStore } from 'src/stores/api'
import emailjs from '@emailjs/browser'

const router = useRouter()
const userStore = useUserStore()
const $q = useQuasar();
const userDatabase = userDatabaseStore()
const useApi = useApiStore()

onMounted(() => {

})

//Variables

const contacto = reactive({
  nombre: '',
  email: '',
  movil: '',
  mensaje: ''
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
  if (!denuncia.usuario || !denuncia.tiempo || !denuncia.torneo || !denuncia.mensaje || !denuncia.nickname || !denuncia.evento || !denuncia.denunciado || !denuncia.sesion) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      position: "top",
      message: "Todos los campos son obligatorios",
    });
  } else {
    if (denuncia.usuario === userDatabase.documents[0].email) {

      emailjs.send('service_upde9ds', 'template_2le1vf6', {
        usuario: denuncia.usuario,
        mensaje: denuncia.mensaje,
        nickname: denuncia.nickname,
        tiempo: denuncia.tiempo,
        torneo: denuncia.torneo,
        denunciado: denuncia.denunciado,
        evento: denuncia.evento,
        sesion: denuncia.sesion
      }, 'XcpFl9Ds8mQUrTjD6')
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          $q.notify({
            color: "green-6",
            textColor: "white",
            icon: "cloud_done",
            message: "Denuncia enviada!",
            position: "top",
            timeout: 2000
          });

          setTimeout(() => {
            router.push('/')
          }, 3000);

        }, (err) => {
          console.log('FAILED...', err);
        });

    } else {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        position: "top",
        message: "El email debe ser el mismo que utilizas al ingresar.",
      });
    }
  }

};

const limpiarCampos = () => {
  contacto.nombre = ''
  contacto.email = ''
  contacto.movil = ''
  contacto.mensaje = ''
};


</script>

<template>
  <section id="contacto">
    <div class="row items-center">
      <div class="col-12 col-sm-6 col-md-5 q-pa-md">
        <h4 class="text-h4 text-center text-uppercase montserratExtraBold q-mb-none">Contacto</h4>
        <hr>
        <p class="text-center text-body2 q-mt-md">
          Estar comunicados es muy importante! Escribenos completando el formulario sobre las dudas o temas que creas
          conveniente aclarar las dudas. Nos contactaremos lo mas pronto posible!
        </p>
      </div>

      <div class="col-12 col-sm-6 col-md-7 q-pa-md">
        <q-form @submit.prevent="submitContact" class="q-gutter-md">
          <div class="row flex justify-around q-mb-lg">
            <div class="col-12 col-sm-3 col-md-8">
              <q-input dense color="cyan-6" v-model.trim="contacto.nombre" label="Nombre *" hint="Hasta 20 caracteres"
                lazy-rules :rules="nombreRules" />

              <q-input class="q-my-md" dense color="cyan-6" type="email" label="Tu email *"
                hint="Debe contener dominio válido (xxxxxx@dominio.com)" lazy-rules v-model.trim="contacto.email"
                :rules="rulesEmail" />

              <q-input class="q-my-md" dense type="number" color="cyan-6" v-model.trim="contacto.movil" label="Móvil"
                hint="Con codigo de area, sin el 15" lazy-rules :rules="mobileRules" />

              <q-input class="q-my-md" color="cyan-6" v-model="contacto.mensaje" hint="Escribe tu mensaje aquí" filled
                type="textarea" />
            </div>
          </div>

          <div class="row flex justify-center">
            <q-btn @click="limpiarCampos" label="Limpiar Campos" type="reset" color="red-5" flat class="q-mr-xl" />
            <q-btn label="Enviar Mensaje" type="submit" color="green-6" icon-right="mail" />
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
