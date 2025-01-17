import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "@core/http/api.service";

enum OPTIONS {
  ALL = "All",
  ID = "Id",
}

@Component({
  selector: "app-asset-data",
  templateUrl: "./asset-data.component.html",
  styleUrl: "./asset-data.component.scss",
})
export class AssetDataComponent {
  idSelected: boolean = false;
  assetId: number = 0;
  data: Array<any> = [];
  options: Array<string> = [OPTIONS.ALL, OPTIONS.ID];
  form: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.initForm();
    this.form = this.initForm();

    this.route.queryParams.subscribe((params) => {
      if (params["id"]) {
        this.assetId = params["id"];
        this.form = this.initForm();
        this.onSelectionChange();
        this.getData();
      }
    });
  }

  initForm() {
    return this.fb.group({
      selectedOption: [this.assetId ? OPTIONS.ID : ""],
      assetId: [this.assetId || ""],
    });
  }

  getData() {
    if (this.getSelectedId() && this.getSelectedOpt() === OPTIONS.ID) {
      this.api
        .getCatalogueComputationalAssetById(this.getSelectedId())
        .subscribe({
          next: (resp: any) => {
            this.data = [resp];
          },
        });
    } else {
      this.api.getCatalogueComputationalAsset().subscribe({
        next: (resp: any) => {
          this.data = [...resp];
        },
      });
    }
  }

  onSelectionChange() {
    this.data = [];
    this.idSelected = this.getSelectedOpt() === OPTIONS.ID;
  }

  getSelectedOpt() {
    return this.form.get("selectedOption")?.value;
  }

  getSelectedId() {
    return this.form.get("assetId")?.value;
  }
}
