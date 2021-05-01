import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <div class="footer">
        <span>Copyrights 2021, @copyrights.RestoFoodies.com</span>
    </div>
  `,
  styles: [
    '.footer{display:flex;justify-content:center;align-items:center;padding:20px;}'+
    '.footer span{font-size:16px;font-weight:600;font-family:"poppins",sans-serif;color:#333;}'
  ]
})
export class AppComponent {}