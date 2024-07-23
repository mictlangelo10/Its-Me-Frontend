import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgtextComponent } from './imgtext.component';

describe('ImgtextComponent', () => {
  let component: ImgtextComponent;
  let fixture: ComponentFixture<ImgtextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgtextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgtextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
