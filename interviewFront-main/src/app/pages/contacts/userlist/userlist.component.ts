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

  constructor(private modalService: BsModalService, public service: userListService, private formBuilder: UntypedFormBuilder,
    private utilisateurService:UtilisateurService,private candidatureService:CandidatureService,private offreService:OffreService
  ) {
    // get all utilisateurs
  
  }
  
  
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;

    if (userId) {
      // Call the service method and pass the userId
      this.getUsersByRecruter(userId);
    } else {
      console.error('User ID not found in localStorage');
    }
    this.loadCandidatures()
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
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    this.candidatureService.getAllCandidatures()
      .subscribe(
        (data: any) => {
          this.candidatures = data;
          console.log(data);
          
        },
        (error: any) => {
          console.error('Error fetching candidatures:', error);
        }
      );
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

  // File Upload
//   imageURL: string | undefined;
//   fileChange(event: any) {
//     let fileList: any = (event.target as HTMLInputElement);
//     let file: File = fileList.files[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.imageURL = reader.result as string;
//       document.querySelectorAll('#member-img').forEach((element: any) => {
//         element.src = this.imageURL;
//       });
//       this.createContactForm.controls['img'].setValue(this.imageURL);
//     }
//     reader.readAsDataURL(file)
//   }

//   // Save User
//   saveUser() {
//     if (this.createContactForm.valid) {
//       if (this.createContactForm.get('id')?.value) {
//         this.service.products = userList.map((data: { id: any; }) => data.id === this.createContactForm.get('id')?.value ? { ...data, ...this.createContactForm.value } : data)
//       }
//       else {
//         const name = this.createContactForm.get('name')?.value;
//         const email = this.createContactForm.get('email')?.value;
//         const position = this.createContactForm.get('position')?.value;
//         const tags = this.createContactForm.get('tags')?.value;
//         userList.push({
//           id: userList.length + 1,
//           profile: this.imageURL,
//           name,
//           email,
//           position,
//           tags,
//           project: "136",
//           isSelected: false
//         })
//       }
//       this.createContactForm.reset();
//       this.newContactModal.hide()
//     }
//   }

//   // Edit User
//   editUser(id: any) {
//     this.submitted = false;
//     this.newContactModal.show();

//     var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
//     modelTitle.innerHTML = 'Edit Profile';
//     var updateBtn = document.getElementById('addContact-btn') as HTMLAreaElement;
//     updateBtn.innerHTML = "Update";

//     var listData = this.contacts[id];

//     this.createContactForm.controls['id'].setValue(listData.id);
//     this.createContactForm.controls['name'].setValue(listData.name);
//     this.createContactForm.controls['email'].setValue(listData.email);
//     this.createContactForm.controls['position'].setValue(listData.position);
//     this.createContactForm.controls['tags'].setValue(listData.tags);
//     this.createContactForm.controls['img'].setValue(listData.profile);
//   }

//   // Delete User
//   removeUser(id: any) {
//     this.deleteId=id
//     this.removeItemModal.show();
//   }

//   confirmDelete() {
//     userList.splice(this.deleteId, 1);
//     this.removeItemModal.hide();
//   }
// // createPersonne
// createUtilisateur(){
//   this.utilisateurService.addUtilisateur(this.utilisateur).subscribe(
//     response=>{
//       console.log("utilisateur ajouté avec succés",response);
//       this.utilisateur={} as Utilisateur;
//       this.getUtilisateurs();
//     }
//   )
// }
// // deletePersonne
// deleteUtilisateur(id:any){
//   if(confirm("Voulez-vous vraiment supprimer cet utilisateur?"))
//     {
//   this.utilisateurService.deleteUtilisateur(id).subscribe(
//     response=>{
//       console.log("utilisateur supprimé avec succés",response);
//       this.getUtilisateurs();
//     }
//   )

//     }
// }



}
