<script setup lang="ts">

  /*
  interface Props {
    modelValue: 'light' | 'dark'
  }
  const props = defineProps<Props>()
  const emits = defineEmits(['update:modelValue'])

  const darkMode = computed({
    get: () => props.modelValue,
    
    set: (value) => {
      emits('update:modelValue', value)
    },
    
  })
  */

  const darkMode = defineModel<'light' | 'dark'>({required: true})

const handleClick = () => {
  darkMode.value = darkMode.value === 'light' ? 'dark' : 'light'
}
const icon = computed(() => 
  darkMode.value === 'light' ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
)
  

</script>

<template>
  <VBtn @click="handleClick" :icon="icon" />


    
</template>

<style scoped>

</style>