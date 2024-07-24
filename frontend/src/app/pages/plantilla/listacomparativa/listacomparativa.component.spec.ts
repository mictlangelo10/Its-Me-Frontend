import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacomparativaComponent } from './listacomparativa.component';

describe('ListacomparativaComponent', () => {
  let component: ListacomparativaComponent;
  let fixture: ComponentFixture<ListacomparativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListacomparativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListacomparativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
