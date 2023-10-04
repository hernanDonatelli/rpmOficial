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
  tiempo: '',
  usuario: '',
  torneo: '',
  mensaje: '',
  nickname: '',
  denunciado: ''
})

const rulesEmail = [
  [
    (v) => !!v || "El e-mail es requerido",
    (v) => /.+@.+\..+/.test(v) || "El e-mail debe ser válido",
  ],
]

//Metodos
const submitDenuncia = () => {
  // console.log(instante.value);
  if (!denuncia.usuario || !denuncia.tiempo || !denuncia.torneo) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Todos los campos son obligatorios",
    });
  } else {
    if (denuncia.usuario === userDatabase.documents[0].email) {
      console.log(denuncia);


      $q.notify({
        color: "green-6",
        textColor: "white",
        icon: "cloud_done",
        message: "Denuncia enviada!",
        timeout: 2000
      });

    } else {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "El usuario denunciante no coincide con la Sesión Activa.",
      });
    }
  }

  setTimeout(() => {
    router.push('/')
  }, 3000);


  // if (!email.value || !password.value) {
  //   $q.notify({
  //     color: "red-5",
  //     textColor: "white",
  //     icon: "warning",
  //     message: "Debe completar ambos campos",
  //   });
  // } else {
  //   setTimeout(() => {
  //     $q.notify({
  //       color: "green-4",
  //       textColor: "white",
  //       icon: "cloud_done",
  //       message: "Ingreso exitoso!",
  //       timeout: 1000
  //     });

  //   }, 1000)

  //   // await userStore.loginUser(email.value, password.value)

  //   // await router.push('/')
  // }

};

const limpiarCampos = () => {
  denuncia.tiempo = ''
  denuncia.usuario = ''
  denuncia.torneo = ''
  denuncia.mensaje = ''
  denuncia.nickname = ''
  denuncia.denunciado = ''
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
  <q-form @submit.prevent="submitDenuncia" @reset="onResetForm" class="q-gutter-md">
    <h5 class="text-h5 text-uppercase">Denuncia</h5>
    <q-input dense color="cyan-6" type="email" hint="Ingrese su email" lazy-rules v-model="denuncia.usuario" name="email"
      :rules="rulesEmail" />

    <q-select color="red-13" label-color="red-13" class="q-px-none" item-aligned filled dense name="torneo"
      v-model="denuncia.torneo" :options="useApi.torneoOpt" hint="Seleccionar un Torneo"
      label="-- Seleccionar Torneo --" />

    <q-input type="text" v-model="denuncia.nickname" hint="Tu usuario dentro del Simulador" dense />

    <q-input type="text" v-model="denuncia.denunciado" hint="Piloto denunciado" dense />

    <q-input type="text" v-model="denuncia.tiempo" name="instante" hint="Instante del incidente. Ej: 2:32" dense />

    <q-input v-model="denuncia.mensaje" hint="Descripción del incidente" filled type="textarea" />

    <div>
      <q-btn label="Enviar Denuncia" type="submit" color="green-6" icon-right="mail" />
      <q-btn @click="limpiarCampos" label="Limpiar Campos" type="reset" color="red-5" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>


<style lang="scss"></style>
