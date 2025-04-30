<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import {ref} from "vue";
import {mdiPlus} from "@mdi/js";
const currentIcon = ref(mdiPlus)
</script>

<template>
  <div class="icon-container">
    <svg-icon type="mdi" :path="currentIcon" class="icon"></svg-icon>
  </div>
</template>

<style scoped>
.icon-container {
  display: flex;
  justify-content: center; /* centre horizontalement */
  align-items: center;     /* centre verticalement */
  height: 10vh;           /* prend toute la hauteur de la vue */
}

.icon {
  background-color: #B8AFA2;
  border-radius: 50%;
  padding: 10px;
}
</style>