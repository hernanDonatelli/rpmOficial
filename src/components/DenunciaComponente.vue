<script setup>
import { useQuasar } from "quasar";
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from '../stores/user'
import { useRouter } from "vue-router";
import { userDatabaseStore } from "src/stores/database";
import { useApiStore } from 'src/stores/api'

const router = useRouter()
const userStore = useUserStore()
const $q = useQuasar();
const userDatabase = userDatabaseStore()
const useApi = useApiStore()

onMounted(() => {
  torneosApi()
})

//Variables
const email = ref(null);
const password = ref(null);

const denuncia = reactive({
  torneo: '',
  instante: '',
  emailDestinatario: 'hernandonatelli@gmail.com',
  emailDenunciante: '',
  userDenunciante: '',
  userDenunciado: '',
  comentarios: '',
  evento: '',
  sesion: ''
})

const rulesEmail = [
  (v) => !!v || "El e-mail es requerido",
  (v) => /.+@.+\..+/.test(v) || "El e-mail debe ser válido",
]

//Metodos
const submitDenuncia = async () => {
  // console.log(instante.value);
  if (!denuncia.torneo || !denuncia.instante || !denuncia.emailDestinatario || !denuncia.comentarios || !denuncia.userDenunciante || !denuncia.evento || !denuncia.userDenunciado || !denuncia.sesion) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      position: "top",
      message: "Todos los campos son obligatorios",
    });
  } else {
    if (denuncia.emailDenunciante === userDatabase.documents[0].email) {

      await useApi.enviarDenunciaAPI(useApi.tokenApi, denuncia)

      $q.notify({
        color: "green-6",
        textColor: "white",
        icon: "cloud_done",
        message: "Denuncia enviada! La evaluaremos y en unos días comunicaremos una resolución.",
        position: "top",
        timeout: 3000
      });

      // setTimeout(() => {
      //   router.push('/')
      // }, 5000);


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
  denuncia.torneo = '',
  denuncia.instante = '',
  denuncia.emailDestinatario = '',
  denuncia.emailDenunciante = '',
  denuncia.userDenunciante = '',
  denuncia.userDenunciado = '',
  denuncia.comentarios = '',
  denuncia.evento = '',
  denuncia.sesion = ''
};

//METODOS
const torneosApi = async () => {
  const token = await useApi.loginApi()
  const torneos = await useApi.getTorneosApi(JSON.parse(localStorage.getItem('token')));

  let idTorneo = [];
  useApi.torneoOpt = []

  torneos.forEach(torneo => {
    useApi.torneoOpt.push(torneo.name)
    idTorneo.push(torneo.id)
  });


}

</script>

<template>
  <section id="denuncias">
    <div class="row items-center">
      <div class="col-12 col-sm-6 col-md-5 q-pa-md">
        <h4 class="text-h4 text-center text-uppercase montserratExtraBold q-mb-none">Denuncias</h4>
        <hr>
        <p class="text-center text-body2 q-mt-md">
          Si tuviste un incidente en algún evento y queres denunciarlo, completá el formulario, envialo y los Comisarios
          evaluarán las acciones.
        </p>
      </div>

      <div class="col-12 col-sm-6 col-md-7 q-pa-md">
        <q-form @submit.prevent="submitDenuncia" class="q-gutter-md">
          <div class="row flex justify-around q-mb-lg">
            <div class="col-12 col-sm-3 col-md-5">
              <q-input dense color="cyan-6" type="email" label="Tu email"
                hint="Mismo email con el cual te registraste." lazy-rules v-model="denuncia.emailDenunciante"
                name="email" :rules="rulesEmail" />
            </div>

            <div class="col-12 col-sm-3 col-md-5">
              <q-input type="text" color="cyan-6" v-model="denuncia.userDenunciante" label="Tu usuario en el Simulador"
                dense hint="Nickname ó nombre que utilizas para correr." />
            </div>
          </div>

          <div class="row flex justify-around q-mb-lg">
            <div class="col-12 col-sm-3 col-md-5">
              <q-select color="cyan-6" label-color="grey-8" class="q-px-none" item-aligned filled dense name="torneo"
                v-model="denuncia.torneo" :options="useApi.torneoOpt" hint="Seleccionar un Torneo"
                label="-- Seleccionar Torneo --" />
            </div>

            <div class="col-12 col-sm-3 col-md-5">
              <q-input color="cyan-6" type="text" v-model="denuncia.evento" hint="Ejemplo: Termas de Rio Hondo"
                label="Evento" dense />
            </div>
          </div>

          <div class="row flex justify-around q-mb-lg">
            <div class="col-12 col-sm-3 col-md-5">
              <q-input color="cyan-6" type="text" v-model="denuncia.sesion" hint="Ejemplo: Serie 1, Final, Carrera..."
                label="Sesión" dense />
            </div>

            <div class="col-12 col-sm-3 col-md-5">
              <q-input color="cyan-6" type="text" v-model="denuncia.userDenunciado" label="Piloto denunciado" dense hint="Nickname ó nombre del piloto que denuncias." />
            </div>
          </div>

          <div class="row flex justify-around q-mb-lg">
            <div class="col-12 col-sm-3 col-md-5">
              <q-input color="cyan-6" type="text" v-model="denuncia.instante" name="instante" hint="Ejemplo: 2:32"
                label="Instante del Incidente" dense />
            </div>

            <div class="col-12 col-sm-3 col-md-5">
              <q-input color="cyan-6" v-model="denuncia.comentarios" hint="Descripción del incidente" filled
                type="textarea" />
            </div>
          </div>

          <div class="row flex justify-center">
            <q-btn @click="limpiarCampos" label="Limpiar Campos" type="reset" color="red-13" class="q-mr-xl" />
            <q-btn label="Enviar Denuncia" type="submit" color="teal-6" icon-right="mail" />
          </div>
        </q-form>
      </div>
    </div>

  </section>
</template>


<style lang="scss">
#denuncias {
  max-width: 95%;

  hr {
    width: 10%;
    border: 2.5px solid black;
    margin-top: 2%;
  }
}
</style>
