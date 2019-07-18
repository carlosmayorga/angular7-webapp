import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Cliente } from './cliente';
import { Region } from './region';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap, flatMap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router, RouterEvent } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';


@Injectable({
  providedIn: 'root'
})

export class ClienteService {
  private url = 'http://localhost:8091/api/clientes';
  private httpHeaders = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient, private router: Router,
              private authService: AuthService) {}

  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;

  }

  private isNotAuthorized(e): boolean {
    if (e.status == 401) {
      if (this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if (e.status == 403) {
      Swal.fire('Ups', 'Acceso denegado', 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }

  getRegiones(): Observable < Region[] > {
    return this.http.get < Region[] > (this.url + '/regiones', {
      headers: this.agregarAuthorizationHeader()
    }).pipe(
      catchError(e => {
        this.isNotAuthorized(e);
        return throwError(e);
      }));
  }
  getClientes(page: number): Observable < any > {
    return this.http.get(this.url + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.createAt = formatDate(cliente.createAt, 'fullDate', 'es');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        response.content.forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  getCliente(id): Observable < Cliente > {
    return this.http.get < Cliente > (`${this.url}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire('Error', 'Error al buscar cliente', 'error');
        return throwError(e);
      })
    );
  }

  create(cliente: Cliente): Observable < Cliente > {
    return this.http.post(this.url, cliente, {
      headers: this.agregarAuthorizationHeader()
    }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (this.isNotAuthorized(e)) {
          return throwError(e);
        }
        if (e.status == 400) {
          return throwError(e);
        }
        Swal.fire('Error', 'Error al crear cliente', 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable < any > {
    return this.http.put < any > (`${this.url}/${cliente.id}`, cliente, {
      headers: this.agregarAuthorizationHeader()
    }).pipe(
      catchError(e => {
        if (this.isNotAuthorized(e)) {
          return throwError(e);
        }
        if (e.status == 400) {
          return throwError(e);
        }
        Swal.fire('Error', 'Error al actualizar cliente', 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable < Cliente > {
    return this.http.delete < Cliente > (`${this.url}/${id}`, {
      headers: this.agregarAuthorizationHeader()
    }).pipe(
      catchError(e => {
        if (this.isNotAuthorized(e)) {
          return throwError(e);
        }
        Swal.fire('Error', 'Error al borrar cliente', 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable < HttpEvent < {} >> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer' + token);
    }

    const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNotAuthorized(e);
        return throwError(e);
      }));
  }

}
