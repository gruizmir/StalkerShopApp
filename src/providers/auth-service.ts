import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


export class User {
    username: string;
    token: string;

    constructor(username: string, token: string) {
        this.username = username;
        this.token = token;    
    }

    public save() {
        if (this.username && this.token){
            JSON.parse(localStorage.getItem('currentUser'));
            localStorage.setItem('user', JSON.stringify(this))
        }
    }
}


@Injectable()
export class AuthService {
    currentUser: User;
    private loginURL = 'http://localhost:8000/api-token-auth/';

    constructor (private http: Http) {}

    
    public login(credentials) {
        if (credentials.username === null || credentials.password === null) {
            return Observable.throw("Credenciales no fueron ingresadas.");
        } else {
            let bodyString = JSON.stringify(credentials); 
            let headers = new Headers({ 'Content-Type': 'application/json' }); 
            let options = new RequestOptions({ headers: headers }); 

            var request = this.http.post(this.loginURL, bodyString, options)
                .map(res => res.json());
            request.subscribe(
                data => {
                    if (data && data.token) {
                        this.currentUser = new User(credentials.username, data.token);
                        this.currentUser.save();
                    }
                }
            );
            return request;
        }
    }   


    public getUserInfo() : User {
        return this.currentUser;
    }

    public jwt() {
        let currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    public logout() {
        localStorage.removeItem('user_token');
        return Observable.create(observer => {
            this.currentUser = null;
            observer.next(true);
            observer.complete();
        });
    }
}
