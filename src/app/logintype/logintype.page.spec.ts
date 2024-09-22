import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogintypePage } from './logintype.page';

describe('LogintypePage', () => {
  let component: LogintypePage;
  let fixture: ComponentFixture<LogintypePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogintypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
