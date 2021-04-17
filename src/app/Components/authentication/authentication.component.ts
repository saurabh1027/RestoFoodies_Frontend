import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  template: `
    <div class='container'>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: []
})
export class AuthenticationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
