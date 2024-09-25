  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
url="http://localhost:8082";
private baseUrl = 'http://localhost:8082/reclamations';
constructor(private http: HttpClient) { }
// recuperer tous les utilisateurs
getUtilisateurs(){
  return this.http.get(`${this.url}/candidats`);
}
// recuperer un utilisateur par id
getUtilisateur(id){
  return this.http.get(this.url+"/"+id);
}
// ajouter un utilisateur
addUtilisateur(utilisateur){
  return this.http.post(this.url,utilisateur);
}
//supprimer un utilisateur
deleteUtilisateur(id){
  return this.http.delete(this.url+"/"+id);
}

//assign user to profile

assignProfil(id,profile){
  return this.http.put(this.url+"/"+id,profile);
}
// findUserByEmail
findUserByEmail(email){
  const role = JSON.parse(localStorage.getItem('user')).role; 
   if (role ==="admin")
   {

     return this.http.get(this.url+"/administrateurs/"+encodeURIComponent(email));
   }else if (role ==="candidat")
    {
      return this.http.get(this.url+"/candidats/"+encodeURIComponent(email));

    }else if (role ==="recruteur")
      {
      return this.http.get(this.url+"/recruteurs/"+encodeURIComponent(email));

    }
}

gitUserByRecruter(id: any): Observable<any> {
  return this.http.get<any>(`${this.url}candidats/all/${id}`);
}


getAllRecruteurs(): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}/recruteurs`);
}


getAllCandidatures(): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}/candidats`);
}

  // Méthode pour supprimer un recruteur par son id
  deleteRecruteurById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/recruteurs/${id}`);
  }

  // Méthode pour supprimer un candidat par son id
  deleteCandidatById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/candidats/${id}`);
  }

  modifyRecruteur(id: number, recruteur: any): Observable<any> {
    return this.http.put<any>(`${this.url}/recruteurs/${id}`, recruteur);
  }

  modifyAdmin(id: number, recruteur: any): Observable<any> {
    return this.http.put<any>(`${this.url}/administrateurs/${id}`, recruteur);
  }
  modifyCandidat(id: number, recruteur: any): Observable<any> {
    return this.http.put<any>(`${this.url}/candidats/${id}`, recruteur);
  }



// Reclamation

submitReclamation(candidatId: number, jobId: number, content: string): Observable<any> {
  const body = {
    candidatId: candidatId,
    jobId: jobId,
    content: content
  };
  return this.http.post(`${this.baseUrl}/candidat`, body);
}

// Get reclamations by candidate ID
getReclamationsByCandidat(candidatId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/${candidatId}`);
}

// Get all reclamations (Admin view)
getAllReclamations(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/admin`);
}

// Respond to a specific reclamation
respondToReclamation(id: number, response: string): Observable<any> {
  const body = { response: response };
  return this.http.post(`${this.baseUrl}/${id}`, body);
}

getReclamationById(id:number): Observable<any>{
  return this.http.get(`${this.baseUrl}/byid/${id}`)
}
deleteReclamation(id:number): Observable<any>{
  return this.http.delete(`${this.baseUrl}/${id}`)
}

}
