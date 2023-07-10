<template>
  <div class="fullscreen bg-grey text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 25vh">
        404
      </div>

      <div class="text-h4 text-white" style="opacity:.6">
        Oops. La URL solicitada no existe o ha sido eliminada...
      </div>

      <q-btn
        class="q-mt-xl"
        color="dark"
        text-color="red-13"
        unelevated
        to="/"
        label="Ir al Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
