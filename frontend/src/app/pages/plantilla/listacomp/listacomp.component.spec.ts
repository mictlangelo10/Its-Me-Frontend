import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacompComponent } from './listacomp.component';

describe('ListacompComponent', () => {
  let component: ListacompComponent;
  let fixture: ComponentFixture<ListacompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListacompComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListacompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
