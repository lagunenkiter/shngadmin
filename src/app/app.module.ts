import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateService } from '@ngx-translate/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';

import { AppComponent } from './app.component';
import { HttpLoaderFactory } from './app.component';
import { SystemComponent } from './system/system.component';
import { ServicesComponent } from './services/services.component';
import { ItemsComponent } from './items/items.component';
import { LogicsComponent } from './logics/logics.component';
import { SchedulersComponent } from './schedulers/schedulers.component';
import { PluginsComponent } from './plugins/plugins.component';
import { ScenesComponent } from './scenes/scenes.component';
import { ThreadsComponent } from './threads/threads.component';
import { LogsComponent } from './logs/logs.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { PluginConfigComponent } from './plugins/config/plugin-config.component';
import { OlddataService } from './common/services/olddata.service';
import { WebsocketPluginService } from './common/services/websocket-plugin.service';
import { LoggerListComponent } from './logs/logger-list/logger-list.component';
import { LoggingConfigurationComponent } from './logs/logging-configuration/logging-configuration.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './no-access/no-access.component';
import {AuthService} from './common/services/auth.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SystemConfigComponent } from './system/system-config/system-config.component';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SystemComponent,
    ServicesComponent,
    ItemsComponent,
    LogicsComponent,
    SchedulersComponent,
    PluginsComponent,
    ScenesComponent,
    ThreadsComponent,
    LogsComponent,
    HeaderComponent,
    PluginConfigComponent,
    LoggerListComponent,
    LoggingConfigurationComponent,
    NotFoundComponent,
    LoginComponent,
    NoAccessComponent,
    SystemConfigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    // Jwt Token Injection
    JwtModule.forRoot({
      config: {
        throwNoTokenError: false
      },
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    }),

    BrowserAnimationsModule,

    TreeModule,
    TableModule,
    TreeTableModule,
    AccordionModule,
    TooltipModule,
    MenubarModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    DropdownModule,
    ChartModule,
    InputSwitchModule,
    TabViewModule,
    TriStateCheckboxModule,

    TabsModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),

    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
//        useFactory: translateHttpLoaderFactory,

  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    OlddataService,
    WebsocketPluginService,
    TranslateService,
    JwtModule
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }


export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

export function jwtOptionsFactory(authService) {
  return {
    tokenGetter: () => {
      if (authService !== undefined) {
        return authService.getToken();
      }
      return '';
    },
  };
}
