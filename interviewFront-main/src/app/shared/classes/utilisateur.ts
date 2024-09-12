import { Profile } from "./profile";
import { Test } from "./test";

export interface Utilisateur {
    /*
    @NotBlank
	private String nom;
	@NotBlank
	private String prenom;
	@Positive
	@Min(value = 18)
	
	private int age;
	@Email
	@NotBlank
	private String email;
	@NotBlank
	@Size(min = 6,max = 20)
	private String mdp;
	
	private Grades grade;
	@JsonIgnoreProperties("utilisateur")

	private ProfileDto profile;
	@JsonIgnoreProperties("utilisateurs")

	private List<TestDto> tests;

    */
    id: number;
    nom: string;
    prenom: string;
    age: number;
    email: string;
    motDePasse: string;
    grade: string;
    profile: Profile;
    tests: Test[];
    
    
}
