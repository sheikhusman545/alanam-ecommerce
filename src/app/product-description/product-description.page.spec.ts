import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDescriptionPage } from './product-description.page';

describe('ProductDescriptionPage', () => {
  let component: ProductDescriptionPage;
  let fixture: ComponentFixture<ProductDescriptionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
