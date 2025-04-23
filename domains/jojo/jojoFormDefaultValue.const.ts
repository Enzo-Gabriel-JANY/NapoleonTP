import type {JojoInterface} from '~/types/jojo'

import type {StandInterface} from '~/types/stand'

export const jojoFormDefaultValueConst = {
  imageAnime: '',
  imageManga: '',
  nom: '',
  familyName: '',
  age: undefined,
  alternative: false,
  espece: 'Humain',
  description: '',
  liked: false,
  hasTechnique : false,
  technique : [''],
  imageTechnique : [''],
  descriptionTechnique : [''],
  partie: 1,
  rate : 10,
  hasReference : false,
  reference : '',
  imageReference : '',
  hasStand : false,
  stand : {
            nom : '',
            manieur : '',
            imageAnime : '',
            imageManga : '',
            capacite : [''],
            imageCapacite : [''],
            descriptionCapacite : [''],
            rate: 10,
            hasReference : false,
            reference : '',
            imageReference : '',
            description : '',
            liked : false,
        } as StandInterface
    
} satisfies Omit<JojoInterface, 'id'>
