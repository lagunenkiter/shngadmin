import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingConfigurationComponent } from './logging-configuration.component';

describe('LoggingConfigurationComponent', () => {
  let component: LoggingConfigurationComponent;
  let fixture: ComponentFixture<LoggingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
