import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { CandidatureService } from 'src/app/shared/services/candidature.service';
import { OffreService } from 'src/app/shared/services/offre.service'; // Adjust path as needed
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  formData: FormGroup;
  reportForm:FormGroup
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
  isAdmin : boolean;
  isReportModalOpen:boolean
  selectedJobId: number | null = null; // Track the jobId for which the report is being submitted
  candidatId: number | null = null;
  adminResponse:string
  content:string
  constructor(private fb: FormBuilder, private offreService: OffreService,private candidatureService:CandidatureService,private utilisateurService : UtilisateurService) {
    this.formData = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      balance: ['', Validators.required]
    });

    this.reportForm = this.fb.group({
      candidat: [{ value: '', disabled: this.isAdmin }, Validators.required],
      admin: [{ value: '', disabled: !this.isAdmin }, Validators.required]
    });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.candidatId = user.id;
    this.isAdmin = user.role === 'admin';
    this.getJobs();
    this.loadCandidatures();
    this.getReclamationsByCandidat(this.candidatId )
    
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
      this.modaleData = data;
      console.log(this.modaleData);
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
        this.loadCandidatures();
    }, error => {
        console.error('Error submitting application', error);
        // Optionally show an error message
    });
    
}
// changeCandidatureStatus(){
//   this.candidatureService.changeCandidatureStatus()
// }


  openModal(data:any) {
    this.modaleData=data
    console.log(this.modaleData)
    this.isModalOpen = true;
  }

  openReportModal(job: any) {
    this.modaleData = job; // Set the selected jobId when opening the modal
    this.isReportModalOpen = true;
  
    // Fetch reclamations for the current candidate
    this.utilisateurService.getReclamationsByCandidat(this.candidatId).subscribe(reclamations => {
      // Find the reclamation related to the selected job
      const reclamation = reclamations.find(rec => rec.jobId === job.id);
      console.log("reclamationssss" , reclamation);
      
  
      if (reclamation) {
        // If a matching reclamation is found, fetch its details
        this.utilisateurService.getReclamationById(reclamation.id).subscribe(response => {
          this.content = response.content;
          this.adminResponse = response.response; // Assuming this is the correct field in your API response
          this.reportForm.patchValue({ admin: this.adminResponse }); // Set admin response in form
        });
      } else {
        // Handle the case where no reclamation is found for the job
        console.warn(`No reclamation found for job ID: ${job.id}`);
        this.adminResponse = ''; // Reset admin response if not found
        this.reportForm.patchValue({ admin: this.adminResponse }); // Clear the admin field in the form
      }
    });
  }
  
  

  getReclamationById(id: number): void {
    this.utilisateurService.getReclamationById(id).subscribe(response => {
      // Assuming the response contains the admin response
      this.adminResponse = response.adminResponse; // Set the admin response from the API
      this.reportForm.patchValue({ admin: this.adminResponse }); // Patch the admin response into the form
    }, error => {
      console.error('Error fetching reclamation:', error);
    });
  }

  
  // Close modal
  closeModal() {
    this.isModalOpen = false;
    this.isReportModalOpen = false;
  }

  loadCandidatures(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    this.candidatureService.getAllCandidatures()
      .subscribe(
        (data: any) => {
          this.candidatures = Array.isArray(data) ? data : [];
          console.log("candidatures :",this.candidatures);
        },
        (error: any) => {
          console.error('Error fetching candidatures:', error);
        }
      );
}

getCandidatureByJob(jobId: number): any {
  return this.candidatures.find(candidature => candidature.offre === jobId);
}




submitReport() {
  if (this.reportForm.valid) {
    const reportData = this.reportForm.value;

    // Get the current candidate and job IDs
    const candidatId = this.getCandidatId();
    const jobId = this.getJobId();

    // Submit the report using the service
    this.utilisateurService.submitReclamation(candidatId, jobId, reportData.candidat)
      .subscribe(response => {
        console.log('Report submitted successfully:', response);

        // If there is a response from the admin, update the form control
        if (response && response.adminResponse) {
          this.reportForm.patchValue({ admin: response.adminResponse });
        }

        this.closeModal();
      }, error => {
        console.error('Error submitting report:', error);
      });
  }
}

// Method to fetch candidate ID
getCandidatId() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.id; // Assuming the logged-in user is the candidate
}

// Method to fetch job ID (example)
getJobId() {
  return this.modaleData.id; // Assuming the job ID is available in `modaleData`
}

getReclamationsByCandidat(candidatId: number) {
  this.utilisateurService.getReclamationsByCandidat(candidatId)
    .subscribe(data => {
      
      console.log('Reclamations for candidat:', data);
    }, error => {
      console.error('Error fetching reclamations:', error);
    });
}
}