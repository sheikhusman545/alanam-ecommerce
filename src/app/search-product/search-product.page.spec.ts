import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchProductPage } from './search-product.page';

describe('SearchProductPage', () => {
  let component: SearchProductPage;
  let fixture: ComponentFixture<SearchProductPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
