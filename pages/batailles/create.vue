<script setup lang="ts">
  import {DefaultBataille} from '~/domains/bataille/defaultBataille'
  import FromBataille from '~/domains/bataille/FormBataille.vue'
  import {Methods} from '~/constants/httpMethod.const'

  const bataille = ref(JSON.parse(JSON.stringify(DefaultBataille)))

  const {pending, error, execute} = useFetch('/api/bataille', {
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
    <FromBataille v-model="bataille" />
  </AppFormLayout>
</template>

<style scoped></style>
