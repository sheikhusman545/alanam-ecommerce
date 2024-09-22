import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingInfoPage } from './shipping-info.page';

describe('ShippingInfoPage', () => {
  let component: ShippingInfoPage;
  let fixture: ComponentFixture<ShippingInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
