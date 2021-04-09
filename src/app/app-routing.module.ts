import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './Components/authentication/authentication.component';
import { BasketComponent } from './Components/basket/basket.component';
import { HomeComponent } from './Components/home/home.component';
import { ItemsComponent } from './Components/items/items.component';
import { LoginComponent } from './Components/login/login.component';
import { MyRestaurantsComponent } from './Components/my-restaurants/my-restaurants.component';
import { OrderComponent } from './Components/order/order.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';

//Don't forget to add latest components to routingComponents variable downside of file
//Also dont put components after the page not found component in routes constant
const routes: Routes = [
  {path:'',redirectTo:'Home',pathMatch:'full'},
  {path:'Home',component:HomeComponent},
  {path:'Authentication',component:AuthenticationComponent,children:[
    {path:'Login',component:LoginComponent},
    {path:'Register',component:RegisterComponent}
  ]},
  {path:'Profile',component:ProfileComponent},
  {path:'My-Restaurants',component:MyRestaurantsComponent},
  {path:'Not-Found',component:PageNotFoundComponent},
  {path:'Profile/My-Basket',component:BasketComponent},
  {path:'Profile/My-Basket/:name',component:OrderComponent},
  {path:'Items/:keyword',component:ItemsComponent},
  {path:'**',redirectTo:'Not-Found',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }