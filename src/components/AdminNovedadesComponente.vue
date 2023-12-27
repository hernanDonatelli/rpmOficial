<script setup>
import { onMounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar } from 'quasar'

const useApi = useApiStore()
const $q = useQuasar()

const columns = [
  { name: 'id', required: true, label: 'ID', align: 'center', field: row => row.id, format: val => `${val}`, sortable: true },
  { name: 'titulo', align: 'center', label: 'Titulo', field: row => row.title },
  { name: 'texto', align: 'center', label: 'Texto', field: row => row.text },
  { name: 'imagen', align: 'center', label: 'Imagen', field: row => row.image },
  { name: 'actualizado', align: 'center', label: 'Actualizado', field: row => row.updated_at },
  { name: 'acciones', align: 'center', label: 'Acciones' }
]
const titulo = ref('')
const texto = ref('')
const imagen = ref([])

onMounted(() => {
  useApi.getNoticiasApi(JSON.parse(localStorage.getItem('token')))
})


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
  useApi.noticias = []

  let data = new FormData;

  data.append('imagen', imagen.value);
  data.append('titulo', titulo.value);
  data.append('texto', texto.value);

  await useApi.createNoticiasApi(useApi.tokenApi, data)

  await useApi.getNoticiasApi(JSON.parse(localStorage.getItem('token')))

  onReset()

}

const editarNoticia = (id, titulo, texto) => {

  const noticiaEditada = {
    texto: texto,
    titulo: titulo
  }

  useApi.editNoticiaApi(useApi.tokenApi, id, noticiaEditada)

}

const deleteConfirm = async (nombre, id) => {

  $q.dialog({
    title: `Eliminar Noticia ${nombre}`,
    message: `Esta acción no tiene vuelta atrás y borrará toda información de la base de datos`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    useApi.noticias = []

    await useApi.deleteNoticiaApi(useApi.tokenApi, id)

    await useApi.getNoticiasApi(useApi.tokenApi)


  })
}

const onReset = () => {
  titulo.value = null;
  texto.value = null;
  imagen.value = null;
};


</script>

<template>
  <h4 class="text-uppercase text-center titleSection montserratExtraBold">Administrar Noticias</h4>

  <div class="row flex justify-around q-mb-xl">

    <!-- Formulario de Creacion de Torneo -->
    <div class="col-6">
      <h5 class="text-uppercase q-mt-none text-center montserratRegular">Subir Noticias</h5>
      <q-form id="uploadNews" method="POST" @submit.prevent="subirNoticia" @reset="onReset" class="q-gutter-md">

        <div class="row flex justify-evenly">
          <div class="col-12">
            <q-input type="text" counter :rules="tituloRules" dense color="cyan-6" v-model.trim="titulo" label="Titulo"
              hint="Hasta 20 caracteres" lazy-rules />

            <q-input class="q-my-md" color="cyan-6" label="Descripción de la Noticia" v-model="texto"
              hint="255 caracteres máximo." filled type="textarea" counter :rules="noticiaRules" />

            <div class="form-group q-mb-md">
              <q-file filled dense bottom-slots name="imagen" v-model="imagen" label="Buscar imagen" counter max-files="1"
                accept=".jpg,.png,.jpeg">
                <template v-slot:before>
                  <q-icon name="attachment" />
                </template>

                <template v-slot:append>
                  <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                    class="cursor-pointer" />
                  <q-icon name="search" @click.stop.prevent />
                </template>

                <template v-slot:hint>
                  <p class="q-mb-none q-py-xs">Formatos: .jpg .png .jpeg</p>
                  <p class="q-mb-none q-py-xs">Resolucion: 1920x1080</p>
                  <p class="q-mb-none q-py-xs">Peso maximo: 5Mb</p>
                </template>
              </q-file>
            </div>
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

  <div class="row">
    <div class="col-12 q-pa-md tabla-torneos">

      <q-table title="NOTICIAS" :rows="useApi.noticias" :columns="columns"
        :loading="useApi.noticias.length == 0 ? true : false" row-key="id">

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props" class="text-center" id="editedId">
              {{ props.row.id }}
            </q-td>

            <q-td class="cursor-pointer text-center" key="titulo" :props="props" id="editedTitulo">
              {{ props.row.title }}
              <q-popup-edit v-model="props.row.title" title="Editar Titulo" buttons label-set="Ok" label-cancel="Cancelar"
                v-slot="scope" auto-save>
                <q-input type="text" :model-value="scope.value" v-model="scope.value" dense autofocus
                  @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>

            <q-td class="cursor-pointer text-center" key="texto" :props="props" id="editedText">
              {{ props.row.text }}
              <q-popup-edit v-model="props.row.text" title="Editar Titulo" buttons label-set="Ok" label-cancel="Cancelar"
                v-slot="scope" auto-save>
                <q-input type="text" :model-value="scope.value" v-model="scope.value" dense autofocus
                  @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>

            <q-td class="cursor-pointer text-center" key="imagen" :props="props" id="editedImagen">
              {{ props.row.image }}
              <q-popup-edit v-model="props.row.image" title="Editar Titulo" buttons label-set="Ok" label-cancel="Cancelar"
                v-slot="scope" auto-save>
                <q-input type="text" :model-value="scope.value" v-model="scope.value" dense autofocus
                  @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>

            <q-td key="actualizado" :props="props">
              {{ props.row.updated_at }}
            </q-td>

            <q-td class="flex column">
              <q-btn @click="editarNoticia(props.row.id, props.row.title, props.row.text)" type="submit" size="sm"
                color="yellow-13" text-color="black" label="Editar" />
              <q-btn size="sm" @click="deleteConfirm(props.row.title, props.row.id)" color="red-13" text-color="white"
                label="Eliminar" />

            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-table tbody td {
  min-height: 110px
}
</style>