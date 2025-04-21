import type {EntityInterface} from '~/types/entity'

export interface BatailleInterface extends EntityInterface {
  image: string
  nom: string
  annee: string
  lieu: string
  force: string
  pertes: string
  situation: string
  victoire: boolean
}