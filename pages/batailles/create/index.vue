<script setup lang="ts">
  import {batailleFormDefaultValueConst} from '~/domains/bataille/batailleFormDefaultValue.const'
  import {Methods} from '~/constantes/httpMethods.const'
  import FormBataille from '~/domains/bataille/FormBataille.vue'

  const bataille = ref(JSON.parse(JSON.stringify(batailleFormDefaultValueConst)))
  

  const {pending, error, execute} = useFetch('/api/batailles', {
    method: Methods.POST,
    immediate: false,
    watch: false,
    body: bataille,
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
    title="Bataille"
    subtitle="Création"
    :submit="execute"
    :loading="pending"
  >
    <FormBataille v-model="bataille" />
  </AppFormLayout>
</template>

<style scoped></style>