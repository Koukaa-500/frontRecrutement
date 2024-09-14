import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = `${environment.apiUrl}/candidature`; // Adjust according to your environment configuration

  constructor(private http: HttpClient) { }

  // Method to apply for a job
  postuler(jobId: any, condidatId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/postuler/${condidatId}/${jobId}`, {});
  }

  // Method to get all candidatures for a specific candidate
  getAllCandidaturesByCandidat(candidateId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cand/${candidateId}`);
  }

  // Method to update the status of a candidature
  changeCandidatureStatus(candidatureDto: any, status: 'ACCEPTED' | 'REJECTED'): Observable<any> {
    // Construct the URL with the status
    const url = `${this.apiUrl}/status/${status}`;
    // Send PUT request with the candidatureDto in the body
    return this.http.put(url, candidatureDto);
  }

  // Method to delete a candidature
  deleteCandidature(candidatureDto: any): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/delete`, { body: candidatureDto });
  }


  getAllCandidatures():Observable<any>{
    return this.http.get(`${this.apiUrl}/getAll`)
  }
}
