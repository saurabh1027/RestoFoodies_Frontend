import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  images : string[] = ['offer1.jpg','offer2.jpg','offer3.jpg','offer4.jpg','offer5.jpg'];
  pos : number=0;
  i:number=0;
  path: string = 'assets/images/offers/';
  image : string = this.path+this.images[this.pos];

  constructor() {}

  ngOnInit(): void {
    
  }

  previous(){
    if(this.pos!=0){
      this.image = this.path+this.images[--this.pos];
    }else{
      this.pos=this.images.length-1;
      this.image = this.path+this.images[this.pos];
    }
  }

  next(){
    if(this.pos!=(this.images.length-1)){
      this.image = this.path+this.images[++this.pos];
    }else{
      this.pos=0;
      this.image = this.path+this.images[this.pos];
    }
  }
}
