import { Utilisateur } from "./utilisateur";

export interface Offre {
 
    id: number;
    titre: string;
    description: string;
    limite: Date;
    recruteur: Utilisateur;

}
