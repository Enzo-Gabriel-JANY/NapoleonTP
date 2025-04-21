export const useSnackbarStore = defineStore('snackbar',() => {
    const show = ref(false)
    const text = ref('')
    const color = ref('success')
    
    const putMessage = (textToPut: string, colorMessage: string) => {
        show.value = true
        text.value = textToPut
        color.value = colorMessage
    }

    return {show, text, color, putMessage}
})
