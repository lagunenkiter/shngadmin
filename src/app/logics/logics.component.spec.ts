import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicsComponent } from './logics.component';

describe('LogicsComponent', () => {
  let component: LogicsComponent;
  let fixture: ComponentFixture<LogicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
