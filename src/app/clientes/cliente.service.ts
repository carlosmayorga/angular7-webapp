import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router, RouterEvent } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class ClienteService {
  private url = 'http://localhost:8091/api/clientes';
  private header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient, private router: Router) {}

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

  getCliente(id): Observable <Cliente> {
    return this.http.get <Cliente> (`${this.url}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        swal.fire('Error', 'Error al buscar cliente', 'error');
        return throwError(e);
      })
    );
  }

  create(cliente: Cliente): Observable <Cliente> {
    return this.http.post(this.url, cliente, {
      headers: this.header
    }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        swal.fire('Error', 'Error al crear cliente', 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable <any> {
    return this.http.put < any > (`${this.url}/${cliente.id}`, cliente, {
      headers: this.header
    }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        swal.fire('Error', 'Error al actualizar cliente', 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable <Cliente> {
    return this.http.delete <Cliente> (`${this.url}/${id}`, {
      headers: this.header
    }).pipe(
      catchError(e => {
        swal.fire('Error', 'Error al borrar cliente', 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable <HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

}
