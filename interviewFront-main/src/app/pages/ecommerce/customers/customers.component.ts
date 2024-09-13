import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CandidatureService } from 'src/app/shared/services/candidature.service';
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
  role : string ;
  isModalOpen = false;
  modal?: boolean = false;
  modaleData :any;
  candidatures:any[]=[]
  status:any
  constructor(private fb: FormBuilder, private offreService: OffreService,private candidatureService:CandidatureService) {
    this.formData = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      balance: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.role=JSON.parse(localStorage.getItem('user')).role;
    console.log("role:",this.role)
    this.checkUserRole();
    this.getJobs();
    this.loadCandidatures()
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
      this.modaleData=data[1];
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
        offreId: jobId,
        candidatId: user.id
    };
    console.log(candidatureDto);
    
    this.offreService.applyForJob(jobId,user.id).subscribe(response => {
        console.log('Application submitted successfully', response);
        // Optionally update UI or show a success message
    }, error => {
        console.error('Error submitting application', error);
        // Optionally show an error message
    });
}

  openModal(data:any) {
    this.modaleData=data
    console.log(this.modaleData)
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadCandidatures(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    this.candidatureService.getAllCandidaturesByCandidat(userId)
      .subscribe(
        (data: any) => {
          this.candidatures = data;
          console.log(this.candidatures);
        },
        (error: any) => {
          console.error('Error fetching candidatures:', error);
        }
      );
}
}