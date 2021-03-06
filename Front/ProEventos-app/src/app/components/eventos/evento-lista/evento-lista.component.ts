import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/_models/Evento';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  public id = 0;

  modalRef?: BsModalRef;
  public isExpanded = false;
  public imageWidth = 80;
  public imageMargin = 2;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  private filtroListado = '';

  public get filtroLista(): string{
    return this.filtroListado;
  }


public set filtro(value: string){
  this.filtroListado = value;
  this.eventosFiltrados = this.filtroListado ? this.filtrarEventos(this.filtroLista) : this.eventos;
}

public filtrarEventos(filtrarPor: string): Evento[] {
  filtrarPor = filtrarPor.toLocaleLowerCase();
  return this.eventos.filter(
   (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );

}

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }


  ngOnInit(): void {
    this.getEventos();
    // this.spinner.show();

  }


  public getEventos(): void {
    this.eventoService.getEvento()
    .subscribe ({
      next: (eventos: Evento[]) =>
       {this.eventos = eventos;
        this.eventosFiltrados = eventos;
       },
        error: (error: any ) => {
          this.spinner.hide();
          console.log(error);
        },
        complete: () => this.spinner.hide()});
  }

  public expandImage(): void{
    if (!this.isExpanded){
      this.imageWidth = 200;
    }
    else{
      this.imageWidth = 80;
    }

    this.isExpanded = ! this.isExpanded;

  }

  openModal(template: TemplateRef<any>): void{
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    if (this.modalRef !== undefined){
    this.modalRef.hide();
    }

  }
  decline(): void {
    if (this.modalRef !== undefined){
    this.modalRef.hide();

    }
  }
  RefreshPage(): void{
    if (this.modalRef !== undefined){
    this.modalRef.hide();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    this.router.navigate(['eventos/lista/']));
    }
  }

  detalheEvento(id: number): void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  getEventoId(id: number): void{
    this.id = id;
  }

  deleteEvento(): void{
    console.log(this.id)
    this.eventoService.deleteEvento(this.id).subscribe(
      (data) => {
         console.log('Deleted successfully');
      },
      (error: HttpErrorResponse) => {
          console.log(error);
      }
    );
    this.id = 0;

  }


}
