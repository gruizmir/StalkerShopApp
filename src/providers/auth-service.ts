import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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
    private loginURL = 'https://localhost:8443/api-token-auth/';

    constructor (private http: Http) {}

    
    public login(credentials) {
        if (credentials.username === null || credentials.password === null) {
            return Observable.throw("Credenciales no fueron ingresadas.");
        } else {
            // TODO: Llamada a backend para obtener token
            // return Observable.create(observer => {
            //     let access = (credentials.password === "pass" && credentials.username === "username");
            //     this.currentUser = new User("username", "token");
            //     observer.next(access);
            //     observer.complete();
            // });

            // Stringify payload
            let bodyString = JSON.stringify(credentials); 
            // ... Set content type to JSON
            let headers = new Headers({ 'Content-Type': 'application/json' }); 
            // Create a request option
            let options = new RequestOptions({ headers: headers }); 

            // ...and calling .json() on the response to return data
            var request = this.http.post(this.loginURL, bodyString, options)
                .map(res => res.json())
            request.subscribe(
                data => {
                    if (data && data.token) {
                        this.currentUser = new User(credentials.username, data.token);
                        this.currentUser.save();
                        // observer.next(true);
                        // observer.complete();
                    }
                }
            );
            return request;
        }
    }   


    public getUserInfo() : User {
        // if (!this.currentUser) {
        //     let User user = localStorage.getItem("user");
        //     return user;
        // }
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
