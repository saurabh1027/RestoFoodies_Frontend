import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/Models/Restaurant';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-restaurants',
  templateUrl: './my-restaurants.component.html',
  styleUrls: ['./my-restaurants.component.css']
})
export class MyRestaurantsComponent implements OnInit {
  branches:string[]=[];
  user:User=new User(0,'','','','','','','','','');
  restaurant : Restaurant = new Restaurant(0,'','','','','','','','');
  rest : Restaurant = new Restaurant(0,'','','','','','','','');
  pos={lat:0,lng:0};

  constructor(private userService:UserService,private router:Router,private restService:RestaurantService) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    this.userService.getUserByToken(sessionStorage.getItem("UserToken")).subscribe(data=>{
      if(!data){
        Swal.fire({title:'Unauthorized access',text:'Make sure to login!',icon:'error'});
        this.router.navigate(['/Login']);
      }else{
        this.user = data;
        if(this.user.role!=='Vendor')this.router.navigate(['Login']);
        this.getRestaurantByUsername(this.user.username);
      }
    });
  }

  getRestaurantByUsername(username:string){
    this.restService.getRestaurantByUsername(username).subscribe(data=>{
      if(data){
        this.restaurant = data;
        this.getBranches(this.restaurant.branch);
        this.pos.lat = parseFloat(this.restaurant.latlng.substring(0,this.restaurant.latlng.indexOf(',')));
        this.pos.lng = parseFloat(this.restaurant.latlng.substring(this.restaurant.latlng.indexOf(',')+1,this.restaurant.latlng.length));
      }else{
        this.restaurant = new Restaurant(0,'','','','','','','','');
        this.getCurrentLocation();
      }
    });
  }

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos = {lat:position.coords.latitude,lng:position.coords.longitude};
      });
    }
  }

  getBranches(branch:string){
    let str : string = '';
    for(let i=0;i<branch.length;i++){
      if(branch[i]===','){
        this.branches.push(str);
        str='';
      }else{
        str = str + branch[i];
      }
    }
  }

  checkFile(event){}

  toggleModel(modelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
    if(bool){
      document.getElementById('Panel1').style.display = 'flex';
      body.classList.add('model');
      model.style.display = 'flex';
    }else{
      document.getElementById('Panel1').style.display = 'none';
      body.classList.remove('model');
      model.style.display = 'none';
    }
  }
  
  deleteRestaurant(rid:number){
    Swal.fire({
      title: 'Delete - '+this.restaurant.name,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restService.deleteRestaurant(rid).subscribe(data=>{
          if(data=='Success'){
            Swal.fire('Deleted!','Your restaurant is deleted.','success');
            this.toggleModel("RestoUpdateForm",false);
            this.getRestaurantByUsername(this.user.username);
          }else{
            Swal.fire(data,'Unable to delete restaurant.','error');
          }
        });
      }
    });
  }
  
  updateRestaurant(rest:Restaurant,files:FileList){
    rest.latlng = this.pos.lat+','+this.pos.lng;
    if(files.length==1){
      let file:File = files[0];
      this.restService.addRestaurantProfile(file).subscribe(data=>{
        if(data=='Success'){
          rest.profile = file.name;
          this.restService.updateRestaurant(rest).subscribe(data=>{
            if(data=='Success'){
              Swal.fire({title:'Congratulations!',text:'Restaurant Updated Successfully.',icon:'success'});
              this.toggleModel('RestoUpdateForm',false);
            }else{
              Swal.fire({title:'Sorry!',text:data,icon:'error'});
            }
          });
        }else{
          Swal.fire({title:'Sorry!',text:data,icon:'error'});
        }
      });
    }else{
      this.restService.updateRestaurant(rest).subscribe(data=>{
        if(data=='Success'){
          Swal.fire({title:'Congratulations!',text:'Restaurant Updated Successfully.',icon:'success'});
          this.toggleModel('RestoUpdateForm',false);
        }else{
          Swal.fire({title:'Sorry!',text:data,icon:'error'});
        }
      });
    }
  }
  
  toggleMap(mapName:string,modelName:string,bool:boolean){
    let map = document.getElementById(mapName);
    let model = document.getElementById(modelName);
    if(bool){
      map.style.display = "block";
      model.style.display = "none";
    }else{
      map.style.display = "none";
      model.style.display = "flex";
    }
  }
  
  addRestaurant(rest:Restaurant,files:FileList){
    rest.latlng = this.pos.lat+','+this.pos.lng;
    this.restService.addRestaurantProfile(files[0]).subscribe(data=>{
      if(data==='Success'){
        rest.profile = files[0].name;
        rest.username = this.user.username;
        rest.branch+=',';
        console.log(rest);
        this.restService.addRestaurant(rest).subscribe(data=>{
          if(data=='Success'){
            Swal.fire({ title:'Good Job!',text:data,icon:'success' });
            this.toggleModel('RestoForm1',false);
            this.rest = new Restaurant(0,'','','','','','','','');
            this.getRestaurantByUsername(this.user.username);
          }else{
            Swal.fire({ title:data,icon:'error' });
          }
        });
      }else{
        Swal.fire({title:'Sorry!',text:data,icon:'error'});
      }
    });
  }

  chooseLocation($event:AGMMouseEvent){
    this.pos = {
      lat:$event.coords.lat,
      lng:$event.coords.lng
    }
  }

}
