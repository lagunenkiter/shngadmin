import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logging-configuration',
  templateUrl: './logging-configuration.component.html',
  styleUrls: ['./logging-configuration.component.css']
})
export class LoggingConfigurationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('LoggingConfigurationComponent.ngOnInit');
  }

}
