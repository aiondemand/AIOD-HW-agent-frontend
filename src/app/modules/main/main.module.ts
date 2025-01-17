import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./pages/main/main.component";
import { MainRoutingModule } from "./main-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ConfigurationComponent } from "./pages/configuration/configuration.component";
import { AssetFormComponent } from "./components/asset-form/asset-form.component";
import { MaterialModule } from "@shared/material/material.module";
import { NewConfigComponent } from "./pages/new-config/new-config.component";
import { AssetDataComponent } from "./pages/asset-data/asset-data.component";
import { PluginsComponent } from "./pages/plugins/plugins.component";

@NgModule({
  declarations: [
    MainComponent,
    ConfigurationComponent,
    AssetFormComponent,
    NewConfigComponent,
    AssetDataComponent,
    PluginsComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ],
})
export class MainModule {}
