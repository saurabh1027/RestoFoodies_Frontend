import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { AgmCoreModule } from '@agm/core';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from './Components/header/header.component';
import { RegisterComponent } from './Components/register/register.component';
import { OffersComponent } from './Components/offers/offers.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './Components/menu/menu.component';
import { BasketComponent } from './Components/basket/basket.component';
import { OrderComponent } from './Components/order/order.component';
import { MyRestaurantsComponent } from './Components/my-restaurants/my-restaurants.component';
import { ItemsComponent } from './Components/items/items.component';
import { RestaurantPendingComponent } from './Components/restaurant-pending/restaurant-pending.component';
import { MyListComponent } from './Components/my-list/my-list.component';
import { RestaurantsComponent } from './Components/restaurants/restaurants.component';
import { RestaurantProfileComponent } from './Components/restaurant-profile/restaurant-profile.component';
/*import { AuthInterceptor } from './Services/auth.interceptor'; */

@NgModule({
  declarations: [
    AppComponent,HomeComponent,LoginComponent,PageNotFoundComponent, HeaderComponent, RegisterComponent, OffersComponent, ProfileComponent, MenuComponent, BasketComponent, OrderComponent, MyRestaurantsComponent, ItemsComponent, RestaurantPendingComponent, MyListComponent, RestaurantsComponent, RestaurantProfileComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyDhFPQeg3ZjTSUDdJp_YCgtqAH9cIFWN0Q'
    })
  ],
  providers: [ CookieService , /*[{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}] */],
  bootstrap: [AppComponent]
})
export class AppModule { }
