import { Component, OnInit } from '@angular/core';
import { Food_Item } from 'src/app/Models/Food_Item';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn:boolean = false;
  fullname:string = '';
  categories:string[]=[];
  allItems:Food_Item[]=[];
  items:Food_Item[]=[];
  resultedItems:Food_Item[]=[];
  keywords:string[]=[];
  resultedKeywords:string[]=[];

  constructor(private service : UserService,private restService : RestaurantService) {}

  ngOnInit(): void {
    this.isLoggedIn();
  }

  isLoggedIn(){
    let token = localStorage.getItem("UserToken");
    let user : User; 
    if(token!=null){
      this.service.getUserByToken(token).subscribe(data=>{
        if(data==null)return;
        user = data;
        this.fullname = user.fullname;
        if(user.username.length>0 && user.password.length>0){
          this.loggedIn = true;
        }
      });
    }
    this.getAllItems();
  }

  getAllItems(){
    this.restService.getAllItems().subscribe(data=>{
      this.allItems = data;
      this.getAllCategories();
    });
  }

  getAllCategories(){
    this.categories = [];
    for(let i=0;i<this.allItems.length;i++){
      if(!this.categories.includes(this.allItems[i].cname)){
        this.categories.push(this.allItems[i].cname);
      }
    }
    this.getKeywordsByCategory();
  }

  reload(){
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  getKeywordsByCategory(){
    this.clearSearchedItems();
    let category = $('select[name="cat"]')[0].value;
    let keywords:string[] = [];
    let str:string='',temp:string='';
    if(category==='All'){
      for(let i=0;i<this.allItems.length;i++){
        temp = this.allItems[i].keywords;
        for(let j=0;j<temp.length;j++){
          if(temp[j]==','){
            if(!keywords.includes(str)){
              keywords.push(str);
            }
            str='';
          }else{
            str += temp[j];
          }
        }
      }
      this.keywords = keywords;
      return;
    }
    for(let i=0;i<this.allItems.length;i++){
      if((this.allItems[i].cname===category)){
        temp = this.allItems[i].keywords;
        for(let j=0;j<temp.length;j++){
          if(temp[j]===','){
            if(!(keywords.includes(str))){
              keywords.push(str);
            }
            str='';
          }else{
            str += temp[j];
          }
        }
      }
    }
    this.keywords = keywords;
  }

  toggleSearchResultModel(){
    let input = $('input[name="searchbar"')[0].value;
    if(this.keywords.length<=0)
    return;
    if(input==''){
      this.resultedKeywords=this.keywords;
      return;
    }
    this.resultedKeywords = [];
    for(let i=0;i<this.keywords.length;i++){
      if(this.keywords[i].toUpperCase().includes(input.toUpperCase())){
        this.resultedKeywords.push(this.keywords[i]);
      }
    }
  }

  clearSearchedItems(){
    this.resultedKeywords = [];
    $('input[name="searchbar"')[0].value = '';
  }

  toggleSearchBar(){
    let bar = document.getElementById('searchbar');
    let input = document.getElementById('search-input');
    if(!bar.classList.contains('active')){
      bar.classList.remove('disabled');
      bar.classList.add('active');
      input.focus();
    }else{
      input.blur();
      bar.classList.remove('active');
      bar.classList.add('disabled');
      this.clearSearchedItems();
    }
  }

  logout(){
    this.service.logout();
  }

  toggleNavbar(bool:boolean){
    let nav = document.getElementById("nav");
    if(bool){
      nav.classList.add("active");
    }else{
      nav.classList.remove("active");
    }
  }

}
