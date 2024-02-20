

<script setup lang="ts">

import {appMenuConstants} from "~/constantes/appMenu.const.js"
</script>



<template>
    <VNavigationDrawer class="position-fixed">
        <VList>
            <VListItem title="Barre de navigation"></VListItem>
            <VListItem  v-for="link in appMenuConstants" 
            :key="JSON.stringify(link)" 
            :title="link.name" 
            :to="link.url" 
            :prepend-icon="link.icon"
            active-class="bg-primary">
        </VListItem>
        </VList>
    </VNavigationDrawer>
</template>

<style scoped>
</style>