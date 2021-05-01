import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Food_Item } from 'src/app/Models/Food_Item';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import { Router } from '@angular/router';
import { Emitter } from 'src/app/Models/Emitter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn:boolean = false;
  user:User=new User(0,'','','','Customer','','','','');
  categories:string[]=[];
  allItems:Food_Item[]=[];
  keywords:string[]=[];
  resultedKeywords:string[]=[];
  location : string = '';
  @ViewChild('cname') cname:ElementRef;
  @ViewChild('searchbar') searchbar:ElementRef;

  constructor(private userService : UserService,private router:Router,private restService : RestaurantService) {}

  ngOnInit(): void {
    Emitter.authEmitter.subscribe(data=>{
      this.loggedIn=data;
    });
    this.isLoggedIn();
  }

  isLoggedIn(){
    let token = sessionStorage.getItem("UserToken");
    if(token!=null){
      this.userService.getUserByToken(token).subscribe(data=>{
        if(data!==null){
          this.user = data;
          if(this.user.username.length>0 && this.user.password.length>0)this.loggedIn = true;
          // this.getAllItems();
        }else{
          this.loggedIn=false;
        }
      });
    }else{
      this.loggedIn=false;
      // this.getAllItems();
    }
  }

  logout(){
    sessionStorage.removeItem("UserToken");
    this.router.navigate(['/Login']);
    this.loggedIn=false;
  }

  getAllItems(){
    this.restService.getAllItems(this.user.city).subscribe(data=>{
      this.allItems = data;
      this.getAllCategories();
    });
  }

  getAllCategories(){
    this.categories = [];
    for(let i=0;i<this.allItems.length;i++){
      if(!this.categories.includes(this.allItems[i].cname))this.categories.push(this.allItems[i].cname);
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
    let category = this.cname.nativeElement.value;
    let keywords:string[] = [];
    let str:string='',temp:string='';
    if(category==='All'){
      for(let i=0;i<this.allItems.length;i++){
        temp = this.allItems[i].keywords;
        for(let j=0;j<temp.length;j++){
          if(temp[j]==','){
            if(!keywords.includes(str))keywords.push(str);
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
    let input = this.searchbar.nativeElement.value;
    if(this.keywords.length<=0)return;
    if(input===''){
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
    this.searchbar.nativeElement.value = '';
  }

  toggleSearchBar(){
    let bar = document.getElementById('searchbar');
    let input = this.searchbar.nativeElement;
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

  toggleNavbar(bool:boolean){
    let nav = document.getElementById("nav");
    if(bool){
      nav.classList.add("active");
    }else{
      nav.classList.remove("active");
    }
  }

}
