import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/Models/Category';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Restaurant } from 'src/app/Models/Restaurant';
import Swal from 'sweetalert2';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() restaurant : Restaurant;
  fileSizeExceeded:boolean=false;
  restCategories:Category[]=[];
  pic:File;
  food_items : Food_Item[] = [];
  food_item : Food_Item = new Food_Item(0,'',0,'',0,'','',false,'',0,'','','',0);
  item : Food_Item = new Food_Item(0,'',0,'',0,'','',false,'',0,'','','',0);
  newCategory:Category=new Category(0,'','');

  constructor(private restService:RestaurantService,private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    this.getCategoriesByCnames();
    this.getFoodItems("All");
  }

  toggleMenuActionsModel(){
    let model = document.getElementById('MenuActions');
    model.style.display = (model.style.display=='flex') ? 'none' : 'flex';
  }

  getCategoriesByCnames(){
    this.restCategories = [];
    if(this.restaurant.categories){
      let str:string = '';
      let cnames:string[]=[];
      for(let i=0;i<this.restaurant.categories.length;i++){
        if(this.restaurant.categories[i]==','){
          cnames.push(str);
          str = '';
        }else{
          str += this.restaurant.categories[i];
        }
      }
      this.restService.getCategoriesByCnames(cnames).subscribe(data=>{
        this.restCategories = data;
      });
    }
  }

  getFoodItems(cname:string){
    let category =document.getElementsByClassName('category-name');
    for(let i=0;i<category.length;i++){
      if(category[i].innerHTML==cname){
        category[i].classList.add("selected");
      }else{
        category[i].classList.remove("selected");
      }
    }
    this.food_items = [];
    this.restService.getFoodItems(cname,this.restaurant.rid).subscribe(data=>{
      this.food_items = data;
    });
  }

  toggleModel(modelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
    if(bool){
      document.getElementById('Panel2').style.display = 'flex';
      body.classList.add('model');
      model.style.display = 'flex';
    }else{
      document.getElementById('Panel2').style.display = 'none';
      body.classList.remove('model');
      model.style.display = 'none';
    }
  }

  addCategory(category:Category){
    if(this.restaurant.categories && this.restaurant.categories.includes(category.cname+',')){
      Swal.fire({title:'Category present already!',icon:'error'});
    }else{
      this.restService.addCategory(category).subscribe(data=>{
        if(data=='Success' || data=='Already present!'){
          (this.restaurant.categories) ? this.restaurant.categories += category.cname+',' : this.restaurant.categories = category.cname + ',';
          this.restService.updateRestaurant(this.restaurant).subscribe(data=>{
            if(data=='Success'){
              Swal.fire({title:'Category added successfully!',icon:'success'});
              this.toggleModel('AddCategoryForm',false);
              this.getCategoriesByCnames();
            }else{
              Swal.fire({title:'Sorry!',text:data,icon:'error'});
            }
          });
        }else{
          Swal.fire({title:'Sorry!',text:data,icon:'error'});
        }
      });
    }
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
      if(data==='Success'){
        this.toggleModel('AddItemForm',false);
      }
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
          if(data=='Success')this.toggleModel('UpdateItemForm',false);
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
