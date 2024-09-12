import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';



import { Utilisateur } from 'src/app/shared/classes/utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { userList } from './data';
import { NgbdUserListSortableHeader } from './userlist-sortable.directive';
import { userListModel } from './userlist.model';
import { userListService } from './userlist.service';

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
  files: File[] = [];
/*
users:Personne[] = [];
personne:Personne={} as Personne;
*/
utilisateurs:any;
utilisateur={} as Utilisateur;
  @ViewChildren(NgbdUserListSortableHeader) headers!: QueryList<NgbdUserListSortableHeader>;
  @ViewChild('newContactModal', { static: false }) newContactModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;

  // constructor(){}

  constructor(private modalService: BsModalService, public service: userListService, private formBuilder: UntypedFormBuilder,
    private utilisateurService:UtilisateurService
  ) {
    // get all utilisateurs
  this.getUtilisateurs();
    
  
    this.contactsList = service.countries$;
    this.total = service.total$;
  }
  getUtilisateurs(){
    this.utilisateurService.getUtilisateurs().subscribe(data=>{
      this.utilisateurs = data;
      console.log(this.utilisateurs);
    }
    )
  }
  /*
getPersonnes(){
  this.personneService.getPersonnes().subscribe((data:Personne[])=>{
    // get data content from the server
    this.users=data['content'];
    //this.users = data;
    console.log("personne depuis la BD ",this.users);
  })



}
addPersonne()
{
  this.personneService.addPersonne(this.personne).subscribe((data:Personne)=>{
    this.users.push(data);
    console.log("personne ajoutée ",data);
    this.getPersonnes();
  })

}
*/
  ngOnInit() {
    //this.getPersonnes();
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Users List', active: true }];

    setTimeout(() => {
      this.contactsList.subscribe(x => {
        this.contacts = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200);

    this.createContactForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      position: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      img: ['', [Validators.required]],
    })
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll('#member-img').forEach((element: any) => {
        element.src = this.imageURL;
      });
      this.createContactForm.controls['img'].setValue(this.imageURL);
    }
    reader.readAsDataURL(file)
  }

  // Save User
  saveUser() {
    if (this.createContactForm.valid) {
      if (this.createContactForm.get('id')?.value) {
        this.service.products = userList.map((data: { id: any; }) => data.id === this.createContactForm.get('id')?.value ? { ...data, ...this.createContactForm.value } : data)
      }
      else {
        const name = this.createContactForm.get('name')?.value;
        const email = this.createContactForm.get('email')?.value;
        const position = this.createContactForm.get('position')?.value;
        const tags = this.createContactForm.get('tags')?.value;
        userList.push({
          id: userList.length + 1,
          profile: this.imageURL,
          name,
          email,
          position,
          tags,
          project: "136",
          isSelected: false
        })
      }
      this.createContactForm.reset();
      this.newContactModal.hide()
    }
  }

  // Edit User
  editUser(id: any) {
    this.submitted = false;
    this.newContactModal.show();

    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Profile';
    var updateBtn = document.getElementById('addContact-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    var listData = this.contacts[id];

    this.createContactForm.controls['id'].setValue(listData.id);
    this.createContactForm.controls['name'].setValue(listData.name);
    this.createContactForm.controls['email'].setValue(listData.email);
    this.createContactForm.controls['position'].setValue(listData.position);
    this.createContactForm.controls['tags'].setValue(listData.tags);
    this.createContactForm.controls['img'].setValue(listData.profile);
  }

  // Delete User
  removeUser(id: any) {
    this.deleteId=id
    this.removeItemModal.show();
  }

  confirmDelete() {
    userList.splice(this.deleteId, 1);
    this.removeItemModal.hide();
  }
// createPersonne
createUtilisateur(){
  this.utilisateurService.addUtilisateur(this.utilisateur).subscribe(
    response=>{
      console.log("utilisateur ajouté avec succés",response);
      this.utilisateur={} as Utilisateur;
      this.getUtilisateurs();
    }
  )
}
// deletePersonne
deleteUtilisateur(id:any){
  if(confirm("Voulez-vous vraiment supprimer cet utilisateur?"))
    {
  this.utilisateurService.deleteUtilisateur(id).subscribe(
    response=>{
      console.log("utilisateur supprimé avec succés",response);
      this.getUtilisateurs();
    }
  )

    }
}
}
