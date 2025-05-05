<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPencil } from '@mdi/js';
import {ref} from "vue";
const path = ref(mdiPencil)
const colors = ref('')
const changeBackgroundColor = () => {
  if (colors.value === "") {
    colors.value = "lightgrey"
  } else {
    colors.value = ""
  }

}
</script>

<template>
  <svg-icon type="mdi"  class="icon"  :path="path" @mouseover="changeBackgroundColor"  @mouseout="changeBackgroundColor" :style="{backgroundColor : colors}"></svg-icon>
</template>

<style scoped>
.icon{
  border-radius: 50%;
  margin-left: 5%;
  border: #222222 , solid , 1.5px;
  margin-top: 7%;
}
</style>