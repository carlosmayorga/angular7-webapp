import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  public errores: string[];

  constructor(private clienteService: ClienteService,
              private router: Router, private activateRoute: ActivatedRoute) {}

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activateRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.clienteService.getCliente(id)
          .subscribe((cliente) => this.cliente = cliente);
      }
    });
  }

  public create(): void {
    this.clienteService.create(this.cliente)
      .subscribe(cliente => {
          this.router.navigate(['/clientes']),
            swal.fire('Nuevo Cliente', `Cliente ${cliente.nombre} creado`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
        });
  }

  public update(): void {
    this.clienteService.update(this.cliente)
      .subscribe(response => {
          this.router.navigate(['/clientes']),
            swal.fire('Cliente Actualizado', `Cliente ${response.cliente.nombre} actualizado`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
        });
  }

}
