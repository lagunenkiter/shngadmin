import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { SystemComponent } from './system/system.component';
import { ServicesComponent } from './services/services.component';
import { ItemsComponent } from './items/items.component';
import { LogicsComponent } from './logics/logics.component';
import { SchedulersComponent } from './schedulers/schedulers.component';
import { PluginsComponent } from './plugins/plugins.component';
import { ScenesComponent } from './scenes/scenes.component';
import { ThreadsComponent } from './threads/threads.component';
import { LogsComponent } from './logs/logs.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/system', pathMatch: 'full'},
//  { path: '', component: SystemComponent, pathMatch: 'full' },
  { path: 'system', component: SystemComponent },
  { path: 'system/systemproperties', component: SystemComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'logics', component: LogicsComponent },
  { path: 'schedulers', component: SchedulersComponent },
  { path: 'plugins', component: PluginsComponent },
  { path: 'scenes', component: ScenesComponent },
  { path: 'threads', component: ThreadsComponent },
  { path: 'logs', component: LogsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
