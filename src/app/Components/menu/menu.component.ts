import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/Models/Category';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Restaurant } from 'src/app/Models/Restaurant';
import Swal from 'sweetalert2';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() food_items : Food_Item[];
  @Input() restaurant : Restaurant;
  categories : Category[]=[];
  fileSizeExceeded:boolean=false;
  pic:File;
  food_item : Food_Item = new Food_Item(0,'',0,'',0,'','',false,'',0,'','','',0);
  item : Food_Item = new Food_Item(0,'',0,'',0,'','',false,'',0,'','','',0);

  constructor(private restService:RestaurantService,private router:Router) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    this.restService.getAllCategories().subscribe(data=>{
      this.categories=data;
    });
  }

  addFoodItem(){
    if(this.pic==undefined || this.fileSizeExceeded)return;
    this.food_item.rid = this.restaurant.rid;
    this.food_item.pic = this.pic.name;
    this.food_item.ratio=0;
    this.restService.addFoodItem(this.food_item).subscribe(data=>{
      (data=='Success')?this.restService.addFoodItemPic(this.pic).subscribe(data=>{
        (data=='Success')?Swal.fire({title:'Item added!',icon:'success'}):Swal.fire({title:data,icon:'error'});
      }):Swal.fire({title:data,icon:'error'});
      this.pic = undefined;
      if(data==='Success')this.toggleModel('AddItemForm',false);
    });
  }

  updateItem(item:Food_Item){
    if(this.fileSizeExceeded)return;
    if(this.pic!==undefined)this.item.pic = this.pic.name;
    this.restService.updateFoodItem(item).subscribe(data=>{
      if(data!=='Success'){
        Swal.fire({title:data,icon:'error'});
      }else if(this.pic!=undefined){
        this.restService.addFoodItemPic(this.pic).subscribe(data=>{
          (data=='Success')?Swal.fire({'title':'Congratulations!',text:'Item updated successfully',icon:'success'}):Swal.fire({title:data,text:'Failed to update',icon:'error'});
          if(data=='Success')this.toggleItemModel('UpdateItemForm',null,false);
        });
      }else{
        Swal.fire({'title':'Congratulations!',text:'Item updated successfully',icon:'success'});
        this.toggleItemModel('UpdateItemForm',null,false);
      }
    });
  }

  validateSize(event){
    this.fileSizeExceeded=false;
    if(event.target.files.length===0)return;
    this.pic = event.target.files[0];
    if((this.pic.size/(1024*1024))>0.5)this.fileSizeExceeded=true;
  }

  toggleModel(modelName:string,bool:boolean){
    document.getElementById(modelName).style.display = (bool)?'block':'none';
  }
  
  toggleItemModel(modelName:string,item:Food_Item,bool:boolean){
    this.fileSizeExceeded=false;
    if(bool){
      this.item=item;
    }
    document.getElementById(modelName).style.display = (bool)?'block':'none';
  }

  deleteFoodItem(fid:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restService.deleteItem(fid).subscribe(data=>{
          (data=='Success')?Swal.fire({title:'Item deleted!',icon:'success'}):Swal.fire({title:data,icon:'error'});
          if(data==='Success')location.reload();
        });
      }
    });
  }
}
