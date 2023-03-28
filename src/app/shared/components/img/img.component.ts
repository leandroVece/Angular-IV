import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OnInit, AfterContentInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})


export class ImgComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() img: string = 'Soy el hijo';
  iamgeDefaut: string = "https://placeimg.com/640/480/nature"
  @Output() loaded = new EventEmitter<string>()

  constructor() {
    console.log('1. Primero sucederá esto');
  }

  ngOnInit(): void {
    console.log('2. Luego esto');
  }

  ngAfterContentInit(): void {
    console.log('3. Seguido de esto');
  }

  ngOnDestroy(): void {
    console.log('4. Finalmente esto (cuando el componente sea destruido)');
  }

  imgError() {
    this.img = this.iamgeDefaut;
    //console.log(this.img)
  }

  imgLoaded() {
    this.loaded.emit(this.img)
  }
}
