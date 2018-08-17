import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TreeModule } from 'angular-tree-component';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';

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
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    TableModule,
    TreeTableModule,
    AccordionModule,

    TabsModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),

    FontAwesomeModule,
    TreeModule.forRoot(),
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
    { provide: 'BASE_URL', useFactory: getBaseUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

