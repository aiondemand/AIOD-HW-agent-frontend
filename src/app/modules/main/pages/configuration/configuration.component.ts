import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "@core/http/api.service";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrl: "./configuration.component.scss",
})
export class ConfigurationComponent implements OnInit {
  form: FormGroup;
  options: any[] = [];
  selectedOptionData: any = null;
  formData: any = {};
  showData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      selectedOption: [""],
    });
  }

  ngOnInit() {
    this.loadOptions();
  }

  loadOptions() {
    this.api.getConfigs().subscribe({
      next: (resp) => {
        this.options = this.saniticeOptions(resp);
      },
    });
  }

  getSelectedId() {
    return this.form.get("selectedOption")?.value;
  }

  getData() {
    this.showData = true;
    const selectedId = this.getSelectedId();
    this.api.getComputationalAssetById(selectedId).subscribe({
      next: (data) => {
        this.formData = data;
      },
      error: () => {
        this.formData = null;
      },
    });
  }

  onSelectionChange() {
    this.showData = false;
    const selectedId = this.getSelectedId();
    this.selectedOptionData =
      this.options.find((option) => option.id === selectedId) || null;
  }

  onDelete() {
    this.api.deleteConfig(this.getSelectedId()).subscribe({
      next: (resp) => {
        this.selectedOptionData = '';
        this.loadOptions();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  saniticeOptions(data: any) {
    const dataArr = [];
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const dataObj = {
          id: key,
          metadata: data[key].metadata,
          orchestrator_type: data[key].orchestrator_type,
        };

        dataArr.push(dataObj);
      }
    }

    return dataArr;
  }

  goToNewConfig() {
    this.router.navigate(["/new-config"]);
  }

  goToPlugins() {
    this.router.navigate(["/plugins"]);
  }
}
