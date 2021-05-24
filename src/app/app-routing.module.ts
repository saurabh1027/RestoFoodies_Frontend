import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './Components/admin/admin.component';
import { BasketComponent } from './Components/basket/basket.component';
import { BoxComponent } from './Components/box/box.component';
import { DeliveryComponent } from './Components/delivery/delivery.component';
import { HomeComponent } from './Components/home/home.component';
import { ItemsComponent } from './Components/items/items.component';
import { LoginComponent } from './Components/login/login.component';
import { MenuComponent } from './Components/menu/menu.component';
import { MyListComponent } from './Components/my-list/my-list.component';
import { MyRestaurantsComponent } from './Components/my-restaurants/my-restaurants.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { RestaurantPendingComponent } from './Components/restaurant-pending/restaurant-pending.component';
import { RestaurantProfileComponent } from './Components/restaurant-profile/restaurant-profile.component';
import { RestaurantsComponent } from './Components/restaurants/restaurants.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'Restaurants',component:RestaurantsComponent},
  {path:'Restaurants/:rname',component:RestaurantProfileComponent},
  {path:'Profile',component:ProfileComponent,children:[
    {path:'Restaurant',component:MyRestaurantsComponent,children:[
      {path:'',component:MenuComponent},
      {path:'Orders',component:RestaurantPendingComponent},
      {path:'My-List',component:MyListComponent},
    ]},
    {path:'Delivery',component : DeliveryComponent},
    {path : 'Admin' , component : AdminComponent},
    {path:'Box',component : BoxComponent}
  ]},
  
  {path:'My-Basket',component:BasketComponent},
  {path:'Login',component:LoginComponent},
  {path:'Register',component:RegisterComponent},
  
  {path : 'Admin' , component : AdminComponent},
  
  {path:'Items/:keyword',component:ItemsComponent},
  {path:'**',component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
