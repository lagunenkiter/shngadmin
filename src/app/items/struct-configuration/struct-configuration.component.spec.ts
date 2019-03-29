import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructConfigurationComponent } from './struct-configuration.component';

describe('StructConfigurationComponent', () => {
  let component: StructConfigurationComponent;
  let fixture: ComponentFixture<StructConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
