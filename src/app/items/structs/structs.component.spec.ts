import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructsComponent } from './structs.component';

describe('StructsComponent', () => {
  let component: StructsComponent;
  let fixture: ComponentFixture<StructsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
