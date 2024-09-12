import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Utilisateur } from 'src/app/account/auth/Utilisateur';
@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;
    private apiURL = environment.apiUrl + '/auth/';
  
    constructor(private http: HttpClient) {
    }

    /**
     * Returns the current user
     */
    public currentUser(): User {
        return getFirebaseBackend().getAuthenticatedUser();
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    // login(email: string, password: string) {
    //     return getFirebaseBackend().loginUser(email, password).then((response: any) => {
    //         const user = response;
    //         return user;
    //     });
    // }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
        return getFirebaseBackend().registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        getFirebaseBackend().logout();
    }

  signUp(user: Utilisateur): Observable<Utilisateur> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Utilisateur>(this.apiURL + "signup", user, { headers });
  }


  login(email: string, password: string): Observable<any> {
    const loginData = {
      email: email,
      motDePasse: password
    };

    // Set headers to specify content type as JSON
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.apiURL+"login", JSON.stringify(loginData), { headers });
  }
}

