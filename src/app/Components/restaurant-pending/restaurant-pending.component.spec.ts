import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantPendingComponent } from './restaurant-pending.component';

describe('RestaurantPendingComponent', () => {
  let component: RestaurantPendingComponent;
  let fixture: ComponentFixture<RestaurantPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
