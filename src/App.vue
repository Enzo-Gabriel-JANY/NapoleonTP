<script setup>

import CardsList from "@/components/CardsList.vue";
import AddBatailleButton from "@/components/Button/AddBatailleButton.vue";
import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify();

createApp(App)
    .use(vuetify)
    .mount('#app');
</script>

<template>

<AddBatailleButton/>
<CardsList/>

</template>

<style>


</style>


