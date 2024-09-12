import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
url="http://localhost:8082/interview";
  constructor( private http:HttpClient ) { }
  /* 
  	@PostMapping("/{id}")
	public ResponseEntity<InterviewDto> addOneUser(@RequestBody InterviewDto interview, @PathVariable long idCandidat)
	
	{
		return ResponseEntity.ok(interviewService.addOneInterview(interview,idCandidat));
	}
  */
  addInterview(interview,id){
    return this.http.post(this.url+"/"+id,interview);
  }
  // get all interviews
  getInterviews(){
    return this.http.get(this.url);
  }
  // get interview by id
  getInterview(id){
    return this.http.get(this.url+"/"+id);
  }
  // delete interview by id
  deleteInterview(id){
    return this.http.delete(this.url+"/"+id);
  }
}
