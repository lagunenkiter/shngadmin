import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicsEditComponent } from './logics-edit.component';

describe('LogicsEditComponent', () => {
  let component: LogicsEditComponent;
  let fixture: ComponentFixture<LogicsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
