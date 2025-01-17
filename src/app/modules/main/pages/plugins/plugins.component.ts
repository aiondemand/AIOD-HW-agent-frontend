import { Component, OnInit } from "@angular/core";
import { ApiService } from "@core/http/api.service";

@Component({
  selector: "app-plugins",
  templateUrl: "./plugins.component.html",
  styleUrl: "./plugins.component.scss",
})
export class PluginsComponent implements OnInit {
  data: any = [];
  Object = Object;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getPluginData();
  }

  getPluginData() {
    this.api.getPlugins().subscribe({
      next: (resp) => {
        this.data = resp;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  reload() {
    this.api.reloadPlugins().subscribe({
      next: () => {
        this.getPluginData();
      },
      error: (err) => {
        console.error(err)
      }
    });
  }
}
