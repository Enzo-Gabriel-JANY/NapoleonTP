import type {BatailleInterface} from '~/types/bataille'

export const batailleFormDefaultValueConst = {
  image: '',
  nom: '',
  annee: 0,
  victoire: true,
  lieu: '',
  force: '',
  pertes: '',
  situation: '',
} satisfies Omit<BatailleInterface, 'id'>
