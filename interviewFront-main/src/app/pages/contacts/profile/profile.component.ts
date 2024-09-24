import { Component, OnInit } from '@angular/core';

import { revenueBarChart, statData } from './data';

import { InterviewService } from '../../../shared/services/interview.service';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { ChartType } from './profile.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  revenueBarChart: ChartType;
  statData:any;
  utilisateur:any;
  email:any;
  interviews:any;
  isModalOpen = false;
  recruteurForm: FormGroup;
  recruteurId: number;
  constructor(private utilisateurService:UtilisateurService, private interviewService:InterviewService,private fb: FormBuilder,) { 
    this.email = JSON.parse(localStorage.getItem('user')).email; // assurez-vous que l'email est bien extrait

    
    this.getInterviews();

    this.recruteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
getInterviews()
{
  this.interviewService.getInterviews().subscribe(data=>{
    this.interviews = data;
    console.log(this.interviews);
  })
}
  ngOnInit() {
    this.getUserbyEmail(this.email);
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];


    // fetches the data
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }
  getUserbyEmail(email:any){
    this.utilisateurService.findUserByEmail(email).subscribe(data=>{
      this.utilisateur = data;
      console.log("user",data);
    })
  }


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    console.log("form",this.recruteurForm  )
    if (this.recruteurForm.valid) {
      this.utilisateurService.modifyRecruteur(this.recruteurId, this.recruteurForm.value).subscribe(
        (response) => {
          console.log('Recruteur mis à jour avec succès', response);
          // Logique supplémentaire (ex. redirection ou message de succès)
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du recruteur', error);
        }
      );
    } else {
      console.log('Formulaire invalide');
    }
  }
  
}
