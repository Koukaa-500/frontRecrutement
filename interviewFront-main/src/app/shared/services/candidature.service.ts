import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
url = "http://localhost:8082/candidature";
  constructor(private http:HttpClient) { }
  /*
  @PostMapping("/{id}")
	public ResponseEntity<CandidatureDto> addOneUser(@RequestBody CandidatureDto candidature, @PathVariable long idCandidat)
	
	{
		return ResponseEntity.ok(candidatureService.addOneCandidature(candidature,idCandidat));
	}
  */
  addCandidature(candidature,id){
    return this.http.post(this.url+"/"+id,candidature);
  }

  // get all candidatures
  getCandidatures(){
    return this.http.get(this.url);
  }
  // get candidature by id
  getCandidature(id){
    return this.http.get(this.url+"/"+id);
  }
  // delete candidature by id
  deleteCandidature(id){
    return this.http.delete(this.url+"/"+id);
  }

}
