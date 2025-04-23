<script setup lang="ts">
  import {jojoFormDefaultValueConst} from '~/domains/jojo/jojoFormDefaultValue.const'
  import FormJojo from '~/domains/jojo/FormJojo.vue'
  import {Methods} from '~/constantes/httpMethods.const'
  import type {JojoInterface} from '~/types/jojo'

  const {id} = useRoute().params

  const {data, pending: jojoPending} = useFetch<
    JojoInterface | Omit<JojoInterface, 'id'>
  >(`/api/jjba/${id}`, {
    default: (): Omit<JojoInterface, 'id'> =>
      JSON.parse(JSON.stringify(jojoFormDefaultValueConst)) satisfies Omit<
        JojoInterface,
        'id'
      >,
  })

  const {pending, error, execute} = useFetch(`/api/jjba/${id}`, {
    method: Methods.PUT,
    immediate: false,
    watch: false,
    body: data,
    onResponse({response}) {
      if (response.ok) {
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
    subtitle="Modification"
    :submit="execute"
    :loading="pending || jojoPending"
  >
    <FormJojo v-model="data" />
  </AppFormLayout>
</template>

<style scoped></style>
