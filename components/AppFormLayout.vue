<script setup lang="ts">
import { mergeProps } from 'vue';
import { ref } from 'vue'
import type { FetchError } from 'ofetch'

interface Props {
    submit?: () => void
    loading?: boolean
    disabled?: boolean
}
const props =defineProps<Props>()



const valid = ref(false)


const handleClickCancel = () => {
    useRouter().back()
}

const handleSubmit = () => {
    valid.value && props.submit?.()
}

</script>

<template>

<VCard width="40%" :loading="loading">
        <VForm v-model="valid" @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit" :disabled="loading">

            <VCardText>
                <slot/>
                <slot name="erreur"/>
            </VCardText>

            <VCardActions class="pa-4">
                <slot name="actions" :valid="valid">
                    <VBtn 
                    @click="handleClickCancel"
                    color="warning" 
                    size="large" 
                    variant="text" 
                    text="Annuler"
                    
                    
                />
                    <VBtn type="submit"  
                    color="warning" 
                    size="large" 
                    variant="flat" 
                    text="Valider"
                    
                />
                </slot>
            </VCardActions>
        </VForm>
    </VCard>
</template>

<style scoped>

</style>
