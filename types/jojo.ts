import type {EntityInterface} from '~/types/entity'

import type {StandInterface} from '~/types/stand'

export interface JojoInterface extends EntityInterface {
  imageAnime: string
  imageManga: string
  nom: string
  familyName: string
  age?: number
  alternative?: boolean
  liked: boolean
  espece: string
  description?: string
  hasTechnique : boolean
  technique : Array<string>
  imageTechnique : Array<string>
  descriptionTechnique : Array<string>
  partie: number
  rate : number
  hasReference : boolean
  reference : string
  imageReference : string
  hasStand : boolean
  stand : StandInterface ;
    
      
}
