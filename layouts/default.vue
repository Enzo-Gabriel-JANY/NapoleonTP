<script setup lang="ts">
const {mobile} = useDisplay()
const darkMode=ref<'light' | 'dark'>('dark')
const drawer = ref(!mobile.value)
onMounted(() => {
  console.log('Mounted layout')
})
onBeforeMount(() => {
  console.log('Before mount layout')
})
onBeforeUnmount(() => {
  console.log('Before unmount layout')
})

function handleClick(){
  drawer.value = !drawer.value
}


</script>


<template>
<VApp :theme='darkMode'>
  <VLayout class="rounded rounded-md">
    <VAppBar title="TP-NAPOLEON" class="position-fixed">
      <template v-slot:prepend>
      <NavButton v-if="mobile" @click="handleClick" />
      <!--afficher AppNavigationDrawer une fois le bouton cliqué-->
      

      </template>
      <AppButton v-model="darkMode"/>
    </VAppBar>
      <AppNavigationDrawer v-model="drawer"/>


    <VMain class="d-flex align-center justify-center" style="min-height: 300px;">
      <slot/>
    </VMain>
  </VLayout>
  </Vapp>
</template>
<style>
html{
  overflow: auto;
}

</style>