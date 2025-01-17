import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { NewConfigComponent } from './pages/new-config/new-config.component';
import { AssetDataComponent } from './pages/asset-data/asset-data.component';
import { PluginsComponent } from './pages/plugins/plugins.component';


const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'data', component: AssetDataComponent },
  { path: 'new-config', component: NewConfigComponent },
  { path: 'plugins', component: PluginsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
