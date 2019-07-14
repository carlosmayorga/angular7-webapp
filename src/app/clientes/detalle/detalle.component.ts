import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo = 'Detalle de cliente';
  private fotoSeleccionada: File;
  private progreso: any = 0;

  constructor(private clienteService: ClienteService,
              private router: Router, private modalService: ModalService) {}

  ngOnInit() {}

  seleccionarFoto(event: {
    target: {
      files: File[];
    };
  }) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Solo se admiten archivos de tipo img', 'error');
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire('Perfil', 'La foto se ha subido con exito', 'success');
          }
        });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.progreso = 0;
    this.fotoSeleccionada = null;
  }

}
