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
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {}