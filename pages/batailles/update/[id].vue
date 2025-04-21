<script setup lang="ts">
  import {DefaultBataille} from '~/domains/bataille/defaultBataille'
  import FormBataille from '~/domains/bataille/FormBataille.vue'
  import {Methods} from '~/constants/httpMethod.const'
  import type {BatailleInterface} from '~/types/bataille'

  /** CONFIG **/
  const {id} = useRoute().params

  /** FETCH **/
  const {data: bataille, pending: userPending} = useFetch<
    BatailleInterface | Omit<BatailleInterface, 'id'>
  >(`/api/bataille/${id}`, {
    default: (): Omit<BatailleInterface, 'id'> =>
      JSON.parse(JSON.stringify(DefaultBataille)) satisfies Omit<
        BatailleInterface,
        'id'
      >,
  })

  const {pending, error, execute} = useFetch(`/api/bataille/${id}`, {
    method: Methods.PUT,
    immediate: false,
    watch: false,
    body: bataille,
    onResponse({response}) {
      if (response.ok) {
        useRouter().back()
      }
    },
  })

  /** COMPUTED **/
  const loadingComputed = computed(() => userPending.value || pending.value)

  /** HOOKS **/
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
    :loading="loadingComputed"
  >
    <FormBataille v-model="bataille" />
  </AppFormLayout>
</template>

<style scoped></style>
