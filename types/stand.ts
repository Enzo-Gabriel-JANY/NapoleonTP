
import type {EntityInterface} from '~/types/entity'

export interface StandInterface extends EntityInterface {
            nom : string
            manieur : string
            imageAnime : string
            imageManga : string
            capacite : Array<string>
            imageCapacite : Array<string>
            descriptionCapacite : Array<string>
            rate: number
            hasReference : boolean
            reference : string
            imageReference : string
            description : string
            liked : boolean
}