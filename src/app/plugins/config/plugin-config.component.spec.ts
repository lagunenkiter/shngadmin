import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginConfigComponent } from './plugin-config.component';

describe('PluginConfigComponent', () => {
  let component: PluginConfigComponent;
  let fixture: ComponentFixture<PluginConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
