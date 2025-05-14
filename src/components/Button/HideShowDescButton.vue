<script setup>
import {ref, toRef, watch} from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import {mdiAccount, mdiEye, mdiEyeOff} from '@mdi/js'

const path = ref(mdiAccount)
const props = defineProps({
  batailleId : Number ,
  isExpanded : Boolean
})
const emit = defineEmits(['toggle'])
const currentIcon = ref(mdiEye)
const isOn = ref(false)
let colors = ref('')
const isExpandedRef = toRef(props, 'isExpanded')
const handleClick = () => {


  console.log(props.isExpanded)
  emit('toggle', props.batailleId)
}
const changeBackgroundColor = () => {
if(colors.value === ""){
  colors.value = "lightgrey"
  }else {
  colors.value = ""
}

}
watch(isExpandedRef, (newVal) => {
  currentIcon.value = newVal ? mdiEyeOff : mdiEye
}, { immediate: true })
</script>

<template>
  <div>
    <svg-icon class="icon" type="mdi" :path="currentIcon" @click="handleClick" @mouseover="changeBackgroundColor"  @mouseout="changeBackgroundColor" :style="{backgroundColor : colors}"/>
  </div>
</template>

<style scoped>
.icon {
  border-radius: 50%;
  margin-left: 3%;
  border: 1.5px solid #222222;
  margin-top: 7%;
  cursor: pointer;
}
</style>