import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})

export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  sinFoto = 'not_img.png';

  constructor(private clienteService: ClienteService,
              private activatedRouted: ActivatedRoute,
              private modalService: ModalService) {}

  ngOnInit() {
    this.activatedRouted.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page)
        .subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginial => {
        if (cliente.id == clienteOriginial.id) {
          clienteOriginial.foto = cliente.foto;
        }
        return clienteOriginial;
      });
    });
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `Eliminaras al cliente ${cliente.nombre} ${cliente.apellido}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          });
      }
    });
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

  }
