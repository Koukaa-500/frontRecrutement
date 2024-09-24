import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
url = "http://localhost:8082/offre";
baseurl = "http://localhost:8082/candidature/postuler"
  constructor(private http:HttpClient) { }
  /*
  private final OffreService offreService;
	@PostMapping("/{id}")
	public ResponseEntity<OffreDto> addOneUser(@RequestBody OffreDto offre, @PathVariable long idCandidat)
	
	{
		return ResponseEntity.ok(offreService.addOneOffre(offre,idCandidat));
	}
	@GetMapping
	public ResponseEntity<Page<OffreDto>> getUsers(Pageable pageable)
	{
		return ResponseEntity.ok(offreService.getOffres(pageable));
	}
	@GetMapping("/{id}")
	public ResponseEntity<OffreDto> getOneOffre(@PathVariable long id)
	{
		return ResponseEntity.ok(offreService.getOneOffre(id));
	}
	@DeleteMapping("/{id}")
	public void deleteOne(@PathVariable long id )
	{
		offreService.deleteOneOffre(id);
	}
  */
  getOffres(){
    return this.http.get(this.url+"/all");
  }
  getOffre(id){
    return this.http.get(this.url+"/"+id);
  }
 addOffre(offreData: any):Observable<any> {
	return this.http.post<any>(this.url + "/ajout", offreData);
  }
  
  deleteOffre(id){
    return this.http.delete(this.url+"/"+id);
  }
  changeOffreStatus(offreId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.url}/${status}`, { id: offreId });
  }
  applyForJob(jobId: any, condidatId: any): Observable<any> {
    return this.http.post(`${this.baseurl}/${condidatId}/${jobId}`, {});
  }

  updateOffre(id , data){
    return this.http.put(this.url+"/"+id , data);
  }
}
