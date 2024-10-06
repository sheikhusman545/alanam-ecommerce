import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Homepage2Page } from './homepage-2.page';

describe('Homepage2Page', () => {
  let component: Homepage2Page;
  let fixture: ComponentFixture<Homepage2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Homepage2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
