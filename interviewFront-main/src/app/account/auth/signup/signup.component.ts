import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Utilisateur } from 'src/app/account/auth/Utilisateur';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/services/auth.service';
import { UserProfileService } from '../../../core/services/user.service';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  utilisateur:Utilisateur={} as Utilisateur;

  signupForm: UntypedFormGroup;
  submitted:any = false;
  error:any = '';
  successmsg:any = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private userService: UserProfileService,private utilisateurService:UtilisateurService) { }

  ngOnInit() {
  
   
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      age:[10]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    const utilisateur: Utilisateur = this.utilisateur;
     console.log(this.utilisateur)
    this.authenticationService.signUp(utilisateur).subscribe(
      (response) => {
        this.successmsg = 'Inscription réussie!';
        console.log('Utilisateur inscrit:', response);
        localStorage.setItem('user', JSON.stringify(response));
        this.successmsg = true;
        this.router.navigate(['dashboard']);
      },
      (error) => {
        this.error = 'Erreur lors de l’inscription. Veuillez réessayer.';
        console.error(error);
      }
    );
  }
  }



