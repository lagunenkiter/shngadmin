import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicsListComponent } from './logics-list.component';

describe('LogicsListComponent', () => {
  let component: LogicsListComponent;
  let fixture: ComponentFixture<LogicsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
