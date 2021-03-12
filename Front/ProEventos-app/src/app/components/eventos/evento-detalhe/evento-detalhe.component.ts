import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { Observable } from 'rxjs';
import { PalestranteService } from 'src/app/services/palestrante.service';
import { Palestrante } from 'src/app/_models/Palestrante';




@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  constructor(
    private eventoService: EventoService,
    public palestranteService: PalestranteService,
    private http: HttpClient,
    public fb: FormBuilder,
    public router: Router,
    // public reader: FileReader
   ) { }
  @Input() name!: string;
  form!: FormGroup;
  redesSociais = new FormArray([]);
  lotes = new FormArray([ this.addLoteFormGroup()]); // iniciando a form de 1 lote (index começando com
  palestrantes = new FormArray([]);
  palestrantesGroup!:FormGroup;

  selectPalestrante!: Palestrante;
  printPalestrante!: Palestrante;





  maxPessoas = 0;
  nome = new FormControl();
  public palests: Palestrante[] = [];
  public palestrantesFiltrados: Palestrante[] = [];
  private filtroListado = '';
  public selectedValue:any;
  public eventoImagem!:FormControl;

 reader = new FileReader();

  ngOnInit(): void {
    this.validation();
    this.getpalestrantes();

  }

  // codigo parar enviar imagem para o database
  // não consegui fazer meu post tratar a imagem, então sempre dava erro

  // addImage(imagem: any):void{
  //   this.eventoImagem = imagem;
  // }
  // addphoto():void{

  //   var temp = this.form.get("imagemURL") as FormControl
  //   temp.patchValue(this.eventoImagem.value)
  //   // this.form.addControl('imagemURL', this.eventoImagem.value)
  //   console.log(temp);
  // }


  public getpalestrantes(): void {
    this.palestranteService.getPalestrante()
    .subscribe ({
      next: (pales: Palestrante[]) =>
       {this.palests = pales;
       },
        error: (error: any ) => {
          console.log(error);
        }
  })
}

// choosePalestrante(): void{
//   this.selectPalestrante = this.printPalestrante;
//   // console.log(this.printPalestrante);
//   this.addPalestrantesEventosFormGroup();
// }




// public addPalestrantesEventosFormGroup(): void {
//   if(this.selectPalestrante!== null){
//   this.palestrantesGroup = this.fb.group({
//     palestranteId: [this.selectPalestrante.id],
//     palestrante: [this.selectPalestrante],
//     evento: []

// });
//   this.palestrantes = this.form.get('palestrantesEventos') as FormArray;
//   this.palestrantes.push(this.palestrantesGroup);
//   console.log(this.palestrantesGroup.value)
//   console.log(this.palestrantes.value)
// }}


// codigo principal

  public validation(): void {
    this.form = this.fb.group({
      local: ['',Validators.required],
      dataEvento: ['',Validators.required],
      tema: ['',Validators.required, Validators.maxLength(70)],
      qtdPessoas: ['',Validators.required],
      imagemURL: [''],
      telefone: ['',Validators.required, Validators.maxLength(11)],
      email: ['',Validators.required, Validators.email],
      redesSociais: this.fb.array([

      ]),
      lotes: this.fb.array([
        this.addLoteFormGroup() // quero que seja necessario a inserção de ao menos 1 lote
      ], Validators.required),
      palestrantesEventos: this.fb.array([

      ])

    });

  }


  public addRedeFormGroup(): FormGroup {
    return this.fb.group({
      nome: ['',Validators.required,Validators.maxLength(35)],
      url: ['',Validators.required]
    });
  }


  public addRede(): void{
    this.redesSociais = this.form.get('redesSociais') as FormArray;
    this.redesSociais.push(this.addRedeFormGroup());
  }


  public addLoteFormGroup(): FormGroup{
    return this.fb.group({
      nome: [''],        // vip, regular, etc.
      preco: [''],       // preco do assento no lote
      quantidade: ['',]   // capacidade max de pessoas no lote
    });


  }
  public addLote(): void{
    this.lotes = this.form.get('lotes') as FormArray;
    this.lotes.push(this.addLoteFormGroup());
  }


  public addLimit(): void{
    this.maxPessoas = +this.form.get('qtdPessoas')?.value;
  }


  public submitForm(): void{
    // this.addphoto();
    console.log(this.form.value);

    this.eventoService.postEvento(this.form.value).subscribe(
      (data) => {
         console.log('Form submitted successfully');
         this.redirectLista();
      },
      (error: HttpErrorResponse) => {
          console.log(error);
      }
    );

  }


  public redirectLista(): void{
  this.router.navigate(['eventos/lista/']);
  }


}



