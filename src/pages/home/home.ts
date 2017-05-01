import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoginPage } from '../login/login';

export class Product {
    name: string;
    url: string;
    store: string;
    price_3: number;
    calc_discount: number;
    image_url: string;
    description: string;
    updated: string;

    constructor(name: string, url: string, store: string, price_3: number, calc_discount: number, image_url: string, description: string) {
      this.name = name;
      this.url = url;
      this.store = store;
      this.price_3 = price_3;
      this.calc_discount = calc_discount;
      this.image_url = image_url;
      this.description = description;
    }
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username = '';
  token = '';
  api_url = 'http://localhost:8000/api/product/';
  products: any;

  constructor(public navCtrl: NavController, private auth: AuthService, private http: Http) {
    let info = this.auth.getUserInfo();
    this.username = info.username;
    this.token = info.token;
    this.http = http;

    this.loadData(0, 10, null);
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.navCtrl.setRoot(LoginPage)
    });
  }

  private loadData(start: number, qty: number, filters: any) {
    let headers = new Headers({ 
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.token
    });
    console.log(headers);
    let options = new RequestOptions({ headers: headers }); 
    let url = this.api_url;
    this.http.get(url, options)
      .subscribe(data =>{
        this.products = JSON.parse(data['_body']); //Bind data to products object
      },error=>{
          console.log(error);// Error getting the data
      } );
  }
}
