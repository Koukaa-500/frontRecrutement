import { Utilisateur } from "./utilisateur";

export interface Test {

    id: number;
    titre: string;
    dateHeure: string;
    fichier: string;
    description: string;
    utilisateurs: Utilisateur[];

}
