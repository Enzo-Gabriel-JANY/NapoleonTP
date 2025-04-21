import type {BatailleInterface} from "~/types/bataille"


export const DefaultBataille ={
    image: '',
    nom: '',
    annee: '',
    lieu: '',
    force: '',
    pertes: '',
    situation: '',
    victoire: true,
        
} satisfies Omit<BatailleInterface, 'id'>