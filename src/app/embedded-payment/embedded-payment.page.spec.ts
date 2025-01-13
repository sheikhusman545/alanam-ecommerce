import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmbeddedPaymentPage } from './embedded-payment.page';

describe('EmbeddedPaymentPage', () => {
  let component: EmbeddedPaymentPage;
  let fixture: ComponentFixture<EmbeddedPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
