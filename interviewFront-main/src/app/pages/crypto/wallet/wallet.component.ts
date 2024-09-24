import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffreService } from 'src/app/shared/services/offre.service';
// Add service for reclamations

import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  searchTerm: string = '';
  offres: any;
  reclamations: any[] = []; // Add reclamations array
  masterSelected: boolean = false;
  isModalOpen = false;
  offreForm: FormGroup;
  responseForm:FormGroup
  modal?: boolean = false;
  idRec: number;
  selectedReclamation: any; // Add selectedReclamation to track which reclamation is being responded to
  adminResponseText: string = ''; // Store admin response from the modal

  constructor(
    private offreservice: OffreService,
    private utilisateurservice : UtilisateurService, // Inject reclamation service
    private formBuilder: FormBuilder,
    
  ) {}

  ngOnInit() {
    this.idRec = JSON.parse(localStorage.getItem('user')).id;
    this.getAllOffres();
    this.getAllReclamations(); // Fetch reclamations on component init

    this.offreForm = this.formBuilder.group({
      id: ['1'],
      description: ['', Validators.required],
      domaine: ['', Validators.required],
      nbPoste: ['', [Validators.required, Validators.min(1)]],
      nvEtude: ['', Validators.required],
      experience: ['', Validators.required],
      ville: ['', Validators.required],
      limite: ['', Validators.required],
      status: ['PENDING'],
      contractType: ['', Validators.required],
      recruteur: [this.idRec],
    });

    this.responseForm = this.formBuilder.group({
      adminResponse: ['', Validators.required] // Form to capture admin response
    });
  }

  // Get all offers
  getAllOffres() {
    this.offreservice.getOffres().subscribe(
      (offres: any[]) => {
        this.offres = offres;
        console.log(this.offres);
      },
      (error) => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  // Get all reclamations (complaints)
  getAllReclamations() {
    this.utilisateurservice.getAllReclamations().subscribe(
      (reclamations: any[]) => {
        this.reclamations = reclamations;
        console.log(this.reclamations);
      },
      (error) => {
        console.error('Error fetching reclamations:', error);
      }
    );
  }

  // Delete an offer
  deleteOffre(id: any) {
    this.offreservice.deleteOffre(id).subscribe(
      () => {
        this.offres = this.offres.filter((offre) => offre.id !== id);
        console.log('Offer deleted successfully', this.offres);
      },
      (error) => {
        console.error('Error deleting the offer:', error);
      }
    );
  }

  // Accept an offer
  acceptOffre(id: any) {
    this.offreservice.changeOffreStatus(id, 'ACCEPTED').subscribe(
      () => {
        this.getAllOffres(); // Refresh the list
        console.log('Offer status updated to ACCEPTED');
      },
      (error) => {
        console.error('Error updating offer status:', error);
      }
    );
  }

  

  // Submit response to reclamation
  openModal(reclamationId: number) {
    this.utilisateurservice.getReclamationById(reclamationId).subscribe(
      (data: any) => {
        this.selectedReclamation = data; // Set the selected reclamation
        this.isModalOpen = true; // Show modal
      },
      (error) => {
        console.error('Error fetching reclamation by ID:', error);
      }
    );
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
    this.responseForm.reset(); // Reset the form
  }

  // Submit admin response and update the reclamation
  submitResponse() {
    if (this.responseForm.valid && this.selectedReclamation) {
      const responseText = this.responseForm.value.adminResponse;

      this.utilisateurservice.respondToReclamation(this.selectedReclamation.id, responseText).subscribe(
        (response) => {
          // Update the selected reclamation in the local list
          const reclamationIndex = this.reclamations.findIndex(rec => rec.id === this.selectedReclamation.id);
          if (reclamationIndex !== -1) {
            this.reclamations[reclamationIndex].response = responseText;
            this.reclamations[reclamationIndex].status = 'Opened'; // Set static status to 'Opened'
          }

          this.closeModal(); // Close the modal after submission
        },
        (error) => {
          console.error('Error submitting response:', error);
        }
      );
    }
  }

  onDeleteReclamation(id: number) {
    this.utilisateurservice.deleteReclamation(id).subscribe({
      next: (response) => {
        this.getAllReclamations()
        console.log('Reclamation deleted successfully', response);
        // Handle successful deletion (e.g., refresh the list of reclamations)
      },
      error: (error) => {
        console.error('Error deleting reclamation', error);
        // Handle error response
      }
    });
  }
  
}
