import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../home/home';
 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  loading: Loading
  registerCredentials = {username: '', password: ''};
 
  constructor(
    private nav: NavController, 
    private auth: AuthService, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController
  ) {}
 
  public login() {
    this.showLoading();
    // TODO: Cambiar registerCredential por 
    this.auth.login(this.registerCredentials).subscribe(data => {
      if (data) {
        setTimeout(() => {
            this.loading.dismiss();
            this.nav.setRoot(HomePage)
        });
      } else {
        this.showError("Credenciales erróneas.");
      }
    },
    error => {
      var custom_errors = JSON.parse(error._body)
      this.showError(custom_errors.non_field_errors[0]);
    });
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    this.loading.present();
  }
 
  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Error de autenticación',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
