<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import {ref} from "vue";
import {mdiPlus} from "@mdi/js";
const currentIcon = ref(mdiPlus);
const emit = defineEmits( ['openForm']);
const colors = ref('') ;
const changeBackgroundColor = () => {
  colors.value = colors.value === "" ? "lightgrey" : "";

};

</script>

<template>
  <div class="icon-container" title="Créer une bataille">
    <svg-icon title="Créer une bataille" size="50px" type="mdi" :path="currentIcon" :style="{ backgroundColor: colors }" class="icon" @mouseover="changeBackgroundColor" @mouseout="changeBackgroundColor" ></svg-icon>
  </div>
</template>

<style scoped>
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
}

.icon {
  background-color: #B8AFA2;
  border-radius: 50%;
  padding: 10px;

}
</style>