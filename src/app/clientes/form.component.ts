import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  public errores: string[];
  regiones: Region[];

  constructor(private clienteService: ClienteService,
              private router: Router, private activateRoute: ActivatedRoute) {}

  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
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
          Swal.fire('Nuevo Cliente', `Cliente ${cliente.nombre} creado`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
        });
  }

  public update(): void {
    this.clienteService.update(this.cliente)
      .subscribe(response => {
          this.router.navigate(['/clientes']),
          Swal.fire('Cliente Actualizado', `Cliente ${response.cliente.nombre} actualizado`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
        });
  }

  compararRegion(o1: Region, o2: Region) {
    return o1 == null || o2 == null ? false : o1.id == o2.id;
  }

}
