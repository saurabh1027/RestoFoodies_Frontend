import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './Components/authentication/authentication.component';
import { BasketComponent } from './Components/basket/basket.component';
import { HomeComponent } from './Components/home/home.component';
import { IndexComponent } from './Components/index/index.component';
import { ItemsComponent } from './Components/items/items.component';
import { LoginComponent } from './Components/login/login.component';
import { MyListComponent } from './Components/my-list/my-list.component';
import { MyRestaurantsComponent } from './Components/my-restaurants/my-restaurants.component';
import { OrderComponent } from './Components/order/order.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { RestaurantPendingComponent } from './Components/restaurant-pending/restaurant-pending.component';

//Don't forget to add latest components to routingComponents variable downside of file
//Also dont put components after the page not found component in routes constant
const routes: Routes = [
  {path:'',component:IndexComponent,children:[
    {path:'',component:HomeComponent},
    {path:'Profile',component:ProfileComponent,children:[
      {path:'My-Restaurants',component:MyRestaurantsComponent},
      {path:'pending-orders',component:RestaurantPendingComponent},
      {path:'My-List',component:MyListComponent},
      {path:'My-Basket',component:BasketComponent,children:[
        {path:':name',component:OrderComponent},
      ]},
    ]},
  ]},
  {path:'Authentication',component:AuthenticationComponent,children:[
    {path:'Login',component:LoginComponent},
    {path:'Register',component:RegisterComponent}
  ]},
  {path:'Items/:keyword',component:ItemsComponent},
  {path:'**',component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }