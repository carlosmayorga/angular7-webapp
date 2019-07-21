import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo = 'Iniciar sesión';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {

    if (this.authService.isAuthenticated()) {
      Swal.fire({
        position: 'top-end',
        type: 'info',
        title: 'Ya estas auntenticado',
        showConfirmButton: false,
        timer: 1000
      });
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error', 'Username o Password vacios', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes']);
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: `Hola ${usuario.username}, has iniciado sesión con éxito`,
          showConfirmButton: false,
          timer: 1500
        });
      }, err => {
        if (err.status === 400) {
          Swal.fire('Error', 'Username o password incorrectos', 'error');
        }
      }
    );
  }

}
