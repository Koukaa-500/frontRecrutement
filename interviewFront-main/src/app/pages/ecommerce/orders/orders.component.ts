import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffreService } from 'src/app/shared/services/offre.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  searchTerm: string = '';
  offres: any;
  masterSelected: boolean = false;
  isModalOpen = false;
  offreForm: FormGroup;
  modal?: boolean = false;
  idRec :number
  constructor(private offreservice: OffreService, private formBuilder: FormBuilder) { }
  
  ngOnInit() {
    this.idRec= JSON.parse(localStorage.getItem('user')).id;
    this.getAllOffres();
    this.offreForm = this.formBuilder.group({
      id:['1'],
      description: ['', Validators.required],
      domaine: ['', Validators.required],
      nbPoste: ['', [Validators.required, Validators.min(1)]],
      nvEtude: ['', Validators.required],
      experience: ['', Validators.required],
      ville: ['', Validators.required],
      limite: ['', Validators.required],
      status: ['PENDING'],
      contractType: ['', Validators.required],
      recruteur: [this.idRec]
    });
  }

  getAllOffres() {
    this.offreservice.getOffres().subscribe(
      (offres: any[]) => { 
        const userId = JSON.parse(localStorage.getItem('user')).id; // Retrieve recruiter ID from localStorage
  
        // Filter offers that have the 'PENDING' status and were created by the logged-in recruiter
        this.offres = offres.filter((offer: any) => offer.status === 'PENDING' && offer.recruteur === userId);
        
        console.log(this.offres);
      },
      error => {
        console.error('Error fetching offers:', error);
      }
    );
  }
  

  createOffre(): void {
    if (this.offreForm.valid) {
      const formValue = this.offreForm.value;
      formValue.limite = new Date(formValue.limite).toISOString(); // Convert to ISO 8601 format

      // Ensure recruteur is a number
      formValue.recruteur = +formValue.recruteur;

      console.log(formValue);

      this.offreservice.addOffre(formValue).subscribe(
        response => {
          console.log('Offre added successfully', response);
          this.closeModal();
           this.getAllOffres(); // Refresh the list after adding
        },
        error => {
          console.error('Error adding offre', error);
        }
      );
    }
  }

  deleteOffre(id: any) {
    this.offreservice.deleteOffre(id).subscribe(() => {
      // Filter out the deleted offer from the current list
      this.offres = this.offres.filter(offre => offre.id !== id);
      console.log('Offer deleted successfully', this.offres);
    }, (error) => {
      console.error('Error deleting the offer:', error);
    });
  }

  acceptOffre(id: any) {
    this.offreservice.changeOffreStatus(id, 'ACCEPTED').subscribe(() => {
      this.getAllOffres(); // Refresh the list
      console.log('Offer status updated to ACCEPTED');
    }, (error) => {
      console.error('Error updating offer status:', error);
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
