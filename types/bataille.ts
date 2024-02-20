import type {EntityInterface} from '~/types/entity'

export interface BatailleInterface extends EntityInterface {
  image: string
  nom: string
  annee: number
  victoire: boolean
  lieu: string
  force: string
  pertes: string
  situation: string
}
