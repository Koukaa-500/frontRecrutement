import { Utilisateur } from "./utilisateur";

export interface Profile {
    /*
    private long id;
	@NotBlank
	private String curriculum;
	@Size(min = 8,max = 16)
	private String numero;
	
	private Utilisateur utilisateur;
    */
    id: number;
    curriculum: string;
    numero: string;
    utilisateur: Utilisateur;

}
