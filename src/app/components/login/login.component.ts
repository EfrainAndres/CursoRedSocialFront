import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service'
import { from } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Identificate'
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit(): void {
    console.log('Componente login cargado...');
  }

  onSubmit() {
    //Loguear al usuario y conseguir sus datos
    this._userService.login(this.user).subscribe(
      response => {
        this.identity = response.user;
        console.log(this.identity)
        if (!this.identity || !this.identity._id) {
          this.status = 'error'
        } else {
          //Persistir datos del usuario
          localStorage.setItem('identity', JSON.stringify(this.identity));

          //Conseguir el token
          this.getToken();
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  getToken() {
    //Loguear al usuario y conseguir sus datos
    this._userService.login(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        console.log(this.token)
        if (this.token.lenght <= 0) {
          this.status = 'error'
        } else {
          //Persistir token
          localStorage.setItem('token', JSON.stringify(this.token));

          //Conseguir los contadores o estadisticas del usuarui
          this.getCounters();
          
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        this._router.navigate(['/']);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
