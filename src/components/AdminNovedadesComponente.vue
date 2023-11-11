<script setup>
import { onMounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar } from 'quasar'

const useApi = useApiStore()
const $q = useQuasar()

const titulo = ref('')
const subtitulo = ref('')
const noticia = ref('')
const imagen = ref([])


///////////////////////////////////////////////////////////////

//Validaciones
const noticiaRules = [
  (v) => !!v || "El texto de noticia es requerido",
  (v) =>
    (v && v.length <= 255) || "El texto debe contener menos de 255 caracteres",
];

const tituloRules = [
  (y) => !!y || "El Titulo de la noticia es requerido",
  (y) =>
    (y && y.length <= 20) || "El texto debe contener menos de 20 caracteres",
];

//METODOS
const subirNoticia = async () => {

  console.log(titulo.value);
  console.log(subtitulo.value);
  console.log(noticia.value);
  console.log(imagen.value);
  // const formData = new FormData(uploadNews)

  // useApi.subirNoticia(useApi.tokenApi, formData)
}

const onReset = () => {
  titulo.value = null;
  subtitulo.value = null;
  noticia.value = null;
  imagen.value = null;
};

</script>

<template>
  <h4 class="text-uppercase text-center q-mt-xl q-mb-lg">Administrar Noticias</h4>

  <div class="row flex justify-around q-mb-xl">

    <!-- Formulario de Creacion de Torneo -->
    <div class="col-6">
      <h5 class="text-uppercase q-mt-none text-center">Subir Noticias</h5>
      <q-form id="uploadNews" method="POST" @submit.prevent="subirNoticia" @reset="onReset" class="q-gutter-md">

        <div class="row flex justify-evenly">
          <div class="col-12">
            <q-input type="text" counter :rules="tituloRules" dense color="cyan-6" v-model.trim="titulo" label="Titulo"
              hint="Hasta 20 caracteres" lazy-rules />

            <q-input type="text" dense color="cyan-6" v-model.trim="subtitulo" label="Subtitulo"
              hint="Hasta 20 caracteres" lazy-rules />

            <q-input class="q-my-md" color="cyan-6" label="Descripción de la Noticia" v-model="noticia"
              hint="400 caracteres máximo." filled type="textarea" counter :rules="noticiaRules" />

            <div class="form-group q-mb-md">
              <q-file filled dense bottom-slots name="imagen" v-model="imagen" label="Buscar imagen" counter max-files="1"
                accept=".jpg,.png">
                <template v-slot:before>
                  <q-icon name="attachment" />
                </template>

                <template v-slot:append>
                  <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                    class="cursor-pointer" />
                  <q-icon name="search" @click.stop.prevent />
                </template>

                <template v-slot:hint>
                  <p class="q-mb-none q-py-xs">Formatos: .jpg .png</p>
                  <p class="q-mb-none q-py-xs">Resolucion: 1920x1080</p>
                  <p class="q-mb-none q-py-xs">Peso maximo: 1Mb</p>
                </template>
              </q-file>
            </div>

            <!-- <div class="form-group q-mb-md">
              <q-file filled dense bottom-slots counter name="imagen" v-model="imagen" label="Buscar imagen" max-files="1"
                accept=".jpg,.png" max-file-size="1024">
                <template v-slot:before>
                  <q-icon name="attachment" />
                </template>

                <template v-slot:append>
                  <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                    class="cursor-pointer" />
                  <q-icon name="search" @click.stop.prevent />
                </template>

                <template v-slot:hint>
                  Formatos: .jpg .png - Resolucion: 1920px x 1080px - Peso: 1Mb
                </template>
              </q-file>
            </div> -->
          </div>
        </div>

        <div class="row q-mt-xl">
          <div class="col-12 text-center">
            <q-btn class="q-mr-lg" type="submit" color="teal-14" text-color="white" label="Subir Noticia" />
            <q-btn class="q-ml-lg" type="reset" color="red-13" text-color="white" label="Limpiar Campos" />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

