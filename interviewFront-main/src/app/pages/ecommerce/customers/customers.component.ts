// src/app/customers/customers.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { OffreService } from 'src/app/shared/services/offre.service'; // Adjust path as needed

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  formData: FormGroup;
  usersData: any[] = []; // Array to hold user data (mocked)
  filteredUsers: any[] = []; // Array to hold filtered user data
  jobsData: any = []; // Array to hold all job data
  filteredJobs: any[] = []; // Array to hold jobs filtered for recruiters
  filteredAcceptedJobs: any[] = []; // Array to hold accepted jobs for candidates
  term: string = ''; // Search term
  breadCrumbItems: any; // Breadcrumb items
  isRecruter: boolean = false; // Check if the user is a recruiter
  searchTerm = '';
  
  constructor(private fb: FormBuilder, private offreService: OffreService) {
    this.formData = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      balance: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.checkUserRole();
    this.getJobs();
  }

  checkUserRole() {
    // Retrieve user object from local storage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.isRecruter = user.role === 'recruteur';
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
        this.isRecruter = false; // Default to false if parsing fails
      }
    }
  }

  // Fetch jobs and filter them based on role
  getJobs(): void {
    this.offreService.getOffres().subscribe(data => {
      this.jobsData = data;
      console.log(this.jobsData);
      
      if (this.isRecruter) {
        // Recruiter: Show only jobs posted by the recruiter
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        this.filteredJobs = this.jobsData.filter(job => job.postedBy === currentUser.username);
      } else {
        // Candidate: Show only accepted jobs
        this.filteredAcceptedJobs = this.jobsData.filter(job => job.status === 'accepted');
      }
    });
  }

  // Method to update job status (Recruiter Action)
  updateJobStatus(jobId: number, status: 'accepted' | 'rejected'): void {
    this.offreService.changeOffreStatus(jobId, status).subscribe(() => {
      // Update the jobsData and filtered lists after status change
      this.getJobs();
    });
  }

  saveCustomer(): void {
    if (this.formData.valid) {
      console.log('Customer data:', this.formData.value);
    }
  }

  applyJob(jobId: number): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('User not found');
      return;
    }

    const user = JSON.parse(userString);
    const candidatureDto = {
      offre: { id: jobId },
      candidat: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        age: user.age,
        email: user.email,
        // Add other required fields if necessary
      }
    };

    this.offreService.applyForJob(candidatureDto).subscribe(response => {
      console.log('Application submitted successfully', response);
      // Optionally update UI or show a success message
    }, error => {
      console.error('Error submitting application', error);
      // Optionally show an error message
    });
  }
}
