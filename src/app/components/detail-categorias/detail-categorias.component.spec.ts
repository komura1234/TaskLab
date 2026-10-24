import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCategoriasComponent } from './detail-categorias.component';

describe('DetailCategoriasComponent', () => {
  let component: DetailCategoriasComponent;
  let fixture: ComponentFixture<DetailCategoriasComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
