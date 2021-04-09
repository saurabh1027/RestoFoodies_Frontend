import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/Models/Category';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import * as $ from 'jquery'; 
import Swal from 'sweetalert2';
import { RestaurantService } from 'src/app/Services/restaurant.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() food_items : Food_Item[];
  @Input() restaurant : Restaurant;
  @Input() user : User;
  @Input() restCategories : Category[];
  food_item : Food_Item = new Food_Item(0,'',0,'',0,'','',false,'',0,'','',0);
  index : number = 0;

  constructor(private restService:RestaurantService) { }

  ngOnInit(): void {
  }

  addFoodItem(){
    var file = $('input[type="file"][name="pic"]')[0].files[0];
    if(this.food_item.cname=='' || this.food_item.description=='' || this.food_item.fname=='' || 
    this.food_item.ingredients=='' || this.food_item.keywords=='' || file==undefined || this.food_item.price==0 || 
    this.food_item.quantity==0){
      Swal.fire({title:'Empty Inputs',icon:'error'});
    }else{
      if(this.food_item.fname.length>20){
        Swal.fire({
          title:'Too long Name',
          text:'Item Name length should be less than 20 characters',
          icon:'error'
        });
      }else{
        this.food_item.rid = this.restaurant.rid;
        this.food_item.pic = file.name;
        if((file.size/(1024*1024))>0.5){
          Swal.fire({
            title:'File Size Exceeded!',
            text:'File size should be less than 500KB.',
            icon:'error'
          });
        }else{
          this.restService.addFoodItem(this.food_item).subscribe(data=>{
            if(data=='Success'){
              this.restService.addFoodItemPic(file).subscribe(data=>{
                if(data=='Success'){
                  Swal.fire({title:'Item added!',icon:'success'});
                }else{
                  Swal.fire({title:data,icon:'error'});
                }
              });
            }else{
              Swal.fire({title:data,icon:'error'});
            }
          });
        }
      }
    }
  }

  toggleFoodModule(){
    let form = document.getElementById("FoodModule");
    form.style.display = (form.style.display=='flex') ? 'none' : 'flex';
  }

  deleteFoodItem(fid:number){
    console.log(fid);
  }
}
