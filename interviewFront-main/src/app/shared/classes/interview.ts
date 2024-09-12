import { BaseEntity } from "./base-entity";
import { Offre } from "./offre";
import { Utilisateur } from "./utilisateur";

export interface Interview extends BaseEntity {
    
    dateHeur:string
    url:string;
    responsable:Utilisateur;
    offre:Offre
}
