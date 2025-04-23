<script setup lang="ts">
  import {Methods} from '~/constantes/httpMethods.const'
  import FormJojo from '~/domains/jojo/FormJojo.vue'
import { jojoFormDefaultValueConst } from '~/domains/jojo/jojoFormDefaultValue.const';

  const jojo = ref(JSON.parse(JSON.stringify(jojoFormDefaultValueConst)))
  

  const {pending, error, execute} = useFetch('/api/jjba/', {
    method: Methods.POST,
    immediate: false,
    watch: false,
    body: jojo,
    onResponse({response}) {
      if (response.status === 201) {
        useRouter().back()
      }
    },
  })

  /** Corrige le bug immediate false de useFetch **/
  onBeforeMount(() => {
    pending.value = false
  })
</script>

<template>
  <AppFormLayout
    width="60%"
    title="Jojo Personnage"
    subtitle="Création"
    :submit="execute"
    :loading="pending"
  >
    <FormJojo v-model="jojo" />
  </AppFormLayout>
</template>

<style scoped></style>