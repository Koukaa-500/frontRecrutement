import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { CandidatureService } from 'src/app/shared/services/candidature.service';


import { Utilisateur } from 'src/app/shared/classes/utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { userList } from './data';
import { NgbdUserListSortableHeader } from './userlist-sortable.directive';
import { userListModel } from './userlist.model';
import { userListService } from './userlist.service';
import { OffreService } from 'src/app/shared/services/offre.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
  providers: [userListService, DecimalPipe]
})

/**
 * Contacts user-list component
 */
export class UserlistComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Table data
  contactsList!: Observable<userListModel[]>;
  total: Observable<number>;
  createContactForm!: UntypedFormGroup;
  submitted = false;
  contacts: any;
  users: any[] = [];
  candidatures:any[] = []
  userRole: string;
  countUsers:number
  offres:any[]=[]
  offreCount:number
  candidaturesCount:number
  constructor(private modalService: BsModalService, public service: userListService, private formBuilder: UntypedFormBuilder,
    private utilisateurService:UtilisateurService,private candidatureService:CandidatureService,private offreService:OffreService
  ) {
    // get all utilisateurs
  
  }
  
  
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
   this.userRole=JSON.parse(localStorage.getItem('user')).role;
    console.log("role", this.userRole)
    if (this.userRole==='admin'){
      this.loadAllUserToAdmin()
      console.log("users1:", this.users)
    }else if(this.userRole==='recruteur'){
      if (userId) {
        // Call the service method and pass the userId
        this.getUsersByRecruter(userId);
      } else {
        console.error('User ID not found in localStorage');
      }
      
    }
    this.loadCandidatures()
    this.users=this.candidatures;
    console.log("users:", this.users);
    this.getAllOffres()
    
  }
  
  getUsersByRecruter(id: any): void {
    this.utilisateurService.gitUserByRecruter(id).subscribe(
      (response) => {
        this.users = response; // Handle the response
        console.log(this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  loadCandidatures(): void {
    this.candidatureService.getAllCandidatures()
      .subscribe(
        (data: any) => {
          this.candidatures = data;
          console.log(data);
          this.candidaturesCount = this.candidatures.length
        },
        (error: any) => {
          console.error('Error fetching candidatures:', error);
        }
      );
      this.loadAllUserToAdmin()
  }


  acceptCandidature(candidature: any): void {
    this.changeCandidatureStatus(candidature, 'ACCEPTED');
  }

  // Method to change the status to 'REJECTED'
  rejectCandidature(candidature: any): void {
    this.changeCandidatureStatus(candidature, 'REJECTED');
  }

  // Common method to change the status
  private changeCandidatureStatus(candidatureDto: any, status: 'ACCEPTED' | 'REJECTED'): void {
    this.candidatureService.changeCandidatureStatus(candidatureDto, status).subscribe(() => {
      console.log(`Candidature ${candidatureDto.id} status changed to ${status}`);
      // Reload the candidatures after status change
      this.loadCandidatures();
    }, (error: any) => {
      console.error('Error updating candidature status:', error);
    });
  }

loadAllUserToAdmin(){
    // Récupérer recruteurs
    this.utilisateurService.getAllRecruteurs().subscribe(
      (recruteurs) => {
        this.users = recruteurs
        console.log('recruteur :',this.users)
       

      },
      (error) => {
        console.error('Erreur lors de la récupération des recruteurs', error);
      }
    );

    // Récupérer candidatures
    this.utilisateurService.getAllCandidatures().subscribe(
      (candidatures) => {
        console.log('candidatures :',candidatures)
        this.users = [...this.users, ...candidatures];
        console.log('usersss :',this.users)
        this.countUsers = this.users.length
      },
      (error) => {
        console.error('Erreur lors de la récupération des candidatures', error);
      }
    );
}


  // Supprimer un recruteur ou un candidat en fonction de son id
  deleteUserRoleAdmin(id: number, type: string): void {
    if (type === 'recruteur') {
      this.utilisateurService.deleteRecruteurById(id).subscribe(
        () => {
          this.users = this.users.filter(item => item.id !== id); // Mise à jour de la liste
          console.log(`Recruteur avec ID ${id} supprimé`);
        },
        (error) => {
          console.error(`Erreur lors de la suppression du recruteur avec ID ${id}`, error);
        }
      );
    } else if (type === 'candidat') {
      this.utilisateurService.deleteCandidatById(id).subscribe(
        () => {
          this.users = this.users.filter(item => item.id !== id); // Mise à jour de la liste
          console.log(`Candidat avec ID ${id} supprimé`);
        },
        (error) => {
          console.error(`Erreur lors de la suppression du candidat avec ID ${id}`, error);
        }
      );
    }
  }

  getAllOffres() { 
    this.offreService.getOffres().subscribe(
      (offres: any[]) => { // Assert the type here
        
        this.offres = offres
        this.offreCount = this.offres.length
        console.log(this.offres);
      },
      error => {
        console.error('Error fetching offers:', error);
      }
    );
  }
// getRecruteurs(): void {
//   this.utilisateurService.getAllRecruteurs().subscribe(
//     (data) => {
//       this.users = data;
//       console.log('Recruteurs:', this.users);
//     },
//     (error) => {
//       console.error('Erreur lors de la récupération des recruteurs', error);
//     }
//   );
// }

// getCandidatures(): void {
//   this.utilisateurService.getAllCandidatures().subscribe(
//     (data) => {
//       this.candidatures = data;
//       console.log('Candidatures:', this.candidatures);
//     },
//     (error) => {
//       console.error('Erreur lors de la récupération des candidatures', error);
//     }
//   );
// }

}
