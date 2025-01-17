import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "@core/http/api.service";
import * as yaml from "js-yaml";

@Component({
  selector: "app-new-config",
  templateUrl: "./new-config.component.html",
  styleUrl: "./new-config.component.scss",
})
export class NewConfigComponent implements OnInit {
  configForm!: FormGroup;
  private currentConfig: any = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      type: ["", Validators.required],
      metadata: this.fb.group({
        name: ["", Validators.required],
        description: ["", Validators.required],
        contact: ["", [Validators.required]],
        additionalFields: this.fb.array([]),
      }),
      configInput: ["", Validators.required],
      format: ["", Validators.required],
    });

    this.configForm.get("metadata")?.valueChanges.subscribe((changes) => {
      this.updateConfigInput(changes, "metadata");
    });

    this.configForm.get("configInput")?.valueChanges.subscribe((value) => {
      try {
        const format = this.configForm.get("format")?.value;
        if (value) {
          this.currentConfig =
            format === "application/json"
              ? JSON.parse(value)
              : yaml.load(value);
        }
      } catch (e) {
        console.warn("Failed to parse config input:", e);
      }
    });
  }

  get additionalFields() {
    return this.configForm.get("metadata.additionalFields") as FormArray;
  }

  addField() {
    const field = this.fb.group({
      key: ["", Validators.required],
      value: ["", Validators.required],
    });
    this.additionalFields.push(field);
    const currentMetadata = this.configForm.get("metadata")?.value;
    this.updateConfigInput(currentMetadata, "metadata");
  }

  removeField(index: number) {
    this.additionalFields.removeAt(index);
    const currentMetadata = this.configForm.get("metadata")?.value;
    this.updateConfigInput(currentMetadata, "metadata");
  }

  updateConfigInput(changes: any, type: string) {
    let formChanges;
    if (changes && type === "metadata") {
      formChanges = { ...this.configForm.value, metadata: changes };
    }

    const config = this.buildConfigObject(formChanges);
    const format = this.configForm.get("format")?.value;

    if (format === "application/json") {
      this.configForm.patchValue(
        {
          configInput: JSON.stringify(config, null, 2),
        },
        { emitEvent: false }
      );
    } else if (format === "application/x-yaml") {
      this.configForm.patchValue(
        {
          configInput: yaml.dump(config),
        },
        { emitEvent: false }
      );
    }
  }

  buildConfigObject(changes?: any) {
    const formValue = changes || this.configForm.value;
    const metadata = changes ? changes.metadata : { ...formValue.metadata };

    // Add additional fields to metadata
    formValue.metadata?.additionalFields?.forEach((field: any) => {
      metadata[field.key] = field.value;
    });

    delete metadata.additionalFields;

    return {
      orchestrator_type: formValue.type,
      metadata,
      connection_info: this.getExistingConnectionInfo(),
    };
  }

  private getExistingConnectionInfo() {
    if (this.currentConfig?.connection_info) {
      return this.currentConfig.connection_info;
    }

    return {
      auth_url: "",
      username: "",
      password: "",
      project_name: "",
      user_domain_name: "",
      project_domain_name: "",
    };
  }

  parseConfigInput(input: string): any {
    const format = this.configForm.get("format")?.value;
    try {
      if (format === "application/json") {
        return JSON.parse(input);
      } else if (format === "application/x-yaml") {
        return yaml.load(input);
      }
    } catch (e) {
      console.warn("Failed to parse config input:", e);
    }
    return null;
  }

  onFormatChange() {
    this.configForm.patchValue({
      configInput: "",
    });
  }

  getConfigPlaceholder(): string {
    const format = this.configForm.get("format")?.value;
    if (format === "application/json") {
      return '{\n  "orchestrator_type": "...",\n  ...\n}';
    } else if (format === "application/x-yaml") {
      return "orchestrator_type: ...\nmetadata:\n  ...";
    }
    return "";
  }

  onSubmit() {
    if (this.configForm.valid) {
      const config = this.buildConfigObject();
      const format = this.configForm.get("format")?.value;
      const type = this.configForm.value.type;

      const headers = {
        "Content-Type": format,
      };

      this.api.createConfig(type, config, headers).subscribe({
        next: () => {
          this.router.navigate(["/configuration"]);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
