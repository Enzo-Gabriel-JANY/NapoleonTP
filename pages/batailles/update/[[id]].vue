<script setup lang="ts">
  import {batailleFormDefaultValueConst} from '~/domains/bataille/batailleFormDefaultValue.const'
  import FormBataille from '~/domains/bataille/FormBataille.vue'
  import {Methods} from '~/constantes/httpMethods.const'
  import type {BatailleInterface} from '~/types/bataille'

  const {id} = useRoute().params

  const {data, pending: bataillePending} = useFetch<
    BatailleInterface | Omit<BatailleInterface, 'id'>
  >(`/api/batailles/${id}`, {
    default: (): Omit<BatailleInterface, 'id'> =>
      JSON.parse(JSON.stringify(batailleFormDefaultValueConst)) satisfies Omit<
        BatailleInterface,
        'id'
      >,
  })

  const {pending, error, execute} = useFetch(`/api/batailles/${id}`, {
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
    title="Bataille"
    subtitle="Modification"
    :submit="execute"
    :loading="pending || bataillePending"
  >
    <FormBataille v-model="data" />
  </AppFormLayout>
</template>

<style scoped></style>
