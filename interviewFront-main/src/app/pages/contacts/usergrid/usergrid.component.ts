import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Usergrid } from './usergrid.model';

import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { userGridData } from './data';

@Component({
  selector: 'app-usergrid',
  templateUrl: './usergrid.component.html',
  styleUrls: ['./usergrid.component.scss']
})

/**
 * Contacts user grid component
 */
export class UsergridComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  utilisateurs:any;

  modalRef?: BsModalRef;

  userGridData: Usergrid[];
  selected:any;
  userForm: UntypedFormGroup;
  submitted = false;
  items: UntypedFormArray;
  // Select2 Dropdown
  selectValue: string[];
  constructor(private modalService: BsModalService, private formBuilder: UntypedFormBuilder, private utilisateurService:UtilisateurService) { 
//
// get all utilisateurs
    this.utilisateurService.getUtilisateurs().subscribe(data=>{
      this.utilisateurs = data;
      console.log(this.utilisateurs);
    })

  }

  ngOnInit() {
    this.selectValue = ['Photoshop', 'illustrator', 'Html', 'Css', 'Php', 'Java', 'Python'];

    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Users Grid', active: true }];
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      designation: ['', [Validators.required]]
    });
    /**
     * fetches data
     */
    this._fetchData();
  }

  get form() {
    return this.userForm.controls;
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

  /**
   * User grid data fetches
   */
  private _fetchData() {
    this.userGridData = userGridData;
  }

  /**
   * Save user
   */
  saveUser() {
    if (this.userForm.valid) {
      const name = this.userForm.get('name').value;
      const email = this.userForm.get('email').value;
      const designation = this.userForm.get('designation').value;
       this.userGridData.push({
         id: this.userGridData.length + 1,
         name,
         email,
         designation,
         projects: this.selected
       })
       this.modalService.hide()
    }
    this.submitted = true
  }
}
