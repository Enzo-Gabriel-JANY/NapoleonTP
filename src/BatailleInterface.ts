export interface DescriptionInterface {
    forces: string;
    pertes: string;
    date: string;
    lieu : string;
    situation : string;
}

export interface BatailleInterface {
    id: number;
    nom: string;
    dateNb: string;
    image: string;
    lieu: string;
    desc: DescriptionInterface[];
    detailed : boolean;
    victoire: boolean;

}
