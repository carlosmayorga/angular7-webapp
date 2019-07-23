import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Cliente } from './cliente';
import { Region } from './region';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class ClienteService {
  private url = 'http://localhost:8091/api/clientes';

  constructor(private http: HttpClient, private router: Router) {}

  getRegiones(): Observable < Region[] > {
    return this.http.get < Region[] > (this.url + '/regiones'); }

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

  getCliente(id: any): Observable < Cliente > {
    return this.http.get < Cliente > (`${this.url}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401) {
          this.router.navigate(['/clientes']);
          Swal.fire('Error', 'Error al buscar cliente', 'error');
          return throwError(e);
        }
      })
    );
  }

  create(cliente: Cliente): Observable < Cliente > {
    return this.http.post(this.url, cliente
      ).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error);
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable < any > {
    return this.http.put < any > (`${this.url}/${cliente.id}`, cliente
    ).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error);
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable < Cliente > {
    return this.http.delete < Cliente > (`${this.url}/${id}`
    ).pipe(
      catchError(e => {
        console.error(e.error);
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable < HttpEvent < {} >> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

}
