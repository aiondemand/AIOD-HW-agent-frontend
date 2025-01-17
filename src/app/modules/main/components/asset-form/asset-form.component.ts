import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "@core/http/api.service";
import * as L from "leaflet";
import { CountryCodeService } from "@core/services/country-code.service";

@Component({
  selector: "app-asset-form",
  templateUrl: "./asset-form.component.html",
  styleUrl: "./asset-form.component.scss",
})
export class AssetFormComponent implements OnChanges, OnInit {
  @Input() data: any;

  @Input() viewMode: boolean = false;

  assetForm: FormGroup = new FormGroup<any>({});
  maps: { [key: number]: L.Map } = {};
  markers: { [key: number]: L.Marker } = {};
  private geocodingTimeout: any;
  customIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private countryCodeService: CountryCodeService
  ) {
    this.loadEmptyForm();
  }
  ngOnInit(): void {
    if (this.data) {
      this.loadData(this.data);
    }

    this.locationControls.forEach((_, index) => {
      setTimeout(() => this.initMap(index), 100);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      this.loadData(changes["data"].currentValue);
    }
  }

  loadEmptyForm() {
    this.assetForm = this.fb.group({
      platform: [""],
      platform_resource_identifier: [""],
      name: [""],
      date_published: [new Date().toISOString()],
      same_as: [null],
      is_accessible_for_free: [false],
      version: [""],
      status_info: [null],
      os: [""],
      kernel: [""],
      pricing_scheme: [""],
      accelerator: this.fb.array([]),
      alternate_name: this.fb.array([]),
      application_area: this.fb.array([]),
      citation: this.fb.array([]),
      contact: this.fb.array([]),
      cpu: this.fb.array([]),
      creator: this.fb.array([]),
      description: this.fb.group({
        plain: [""],
        html: [""],
      }),
      distribution: this.fb.array([]),
      has_part: this.fb.array([]),
      industrial_sector: this.fb.array([]),
      is_part_of: this.fb.array([]),
      keyword: this.fb.array([]),
      license: [null],
      media: this.fb.array([]),
      memory: this.fb.array([]),
      note: this.fb.array([]),
      relevant_link: this.fb.array([]),
      relevant_resource: this.fb.array([]),
      relevant_to: this.fb.array([]),
      research_area: this.fb.array([]),
      scientific_domain: this.fb.array([]),
      storage: this.fb.array([]),
      type: [""],
      location: this.fb.array([]),
    });
  }

  loadData(data: any) {
    if (!data) {
      this.loadEmptyForm();
      return;
    }

    // Update simple fields
    const simpleFields = [
      "platform",
      "platform_resource_identifier",
      "name",
      "date_published",
      "same_as",
      "is_accessible_for_free",
      "version",
      "status_info",
      "os",
      "kernel",
      "pricing_scheme",
      "license",
      "type",
    ];
    simpleFields.forEach((field) => {
      if (data[field] !== undefined) {
        this.assetForm.get(field)?.setValue(data[field]);
      }
    });

    // Update description
    if (data.description) {
      this.assetForm.get("description.plain")?.setValue(data.description.plain);
      this.assetForm.get("description.html")?.setValue(data.description.html);
    }

    // Update simple arrays
    const simpleArrays = [
      "alternate_name",
      "application_area",
      "industrial_sector",
      "keyword",
      "relevant_link",
      "research_area",
      "scientific_domain",
      "relevant_resource",
      "relevant_to",
      "citation",
      "contact",
      "creator",
      "is_part_of",
      "has_part",
    ];
    simpleArrays.forEach((arrayName) => {
      if (data[arrayName] && Array.isArray(data[arrayName])) {
        const formArray = this.assetForm.get(arrayName) as FormArray;
        formArray.clear();
        data[arrayName].forEach((item: string) => {
          formArray.push(this.fb.control(item));
        });
      }
    });

    // Update complex array
    const complexArrays = [
      "accelerator",
      "cpu",
      "media",
      "memory",
      "storage",
      "distribution",
      "location",
    ];
    complexArrays.forEach((arrayName) => {
      if (data[arrayName] && Array.isArray(data[arrayName])) {
        const formArray = this.assetForm.get(arrayName) as FormArray;
        formArray.clear();
        data[arrayName].forEach((item: any) => {
          let formGroup: FormGroup;
          switch (arrayName) {
            case "accelerator":
              formGroup = this.fb.group({
                vendor: [item.vendor || "", [Validators.maxLength(256)]],
                type: [item.type || "", [Validators.maxLength(256)]],
                acc_model_name: [
                  item.acc_model_name || "",
                  [Validators.maxLength(256)],
                ],
                architecture: [
                  item.architecture || "",
                  [Validators.maxLength(256)],
                ],
                cores: [item.cores || "", []],
                memory: [item.memory || "", []],
              });
              break;
            case "cpu":
              formGroup = this.fb.group({
                num_cpu_cores: [item.num_cpu_cores || "", []],
                architecture: [
                  item.architecture || "",
                  [Validators.maxLength(256)],
                ],
                vendor: [item.vendor || "", [Validators.maxLength(256)]],
                cpu_model_name: [
                  item.cpu_model_name || "",
                  [Validators.maxLength(256)],
                ],
                cpu_family: [
                  item.cpu_family || "",
                  [Validators.maxLength(256)],
                ],
                clock_speed: [item.clock_speed || null, []],
              });
              break;
            case "media":
              formGroup = this.fb.group({
                platform: [item.platform || "", [Validators.maxLength(64)]],
                platform_resource_identifier: [
                  item.platform_resource_identifier || "",
                  [Validators.maxLength(256)],
                ],
                checksum: [item.checksum || "", [Validators.maxLength(1800)]],
                checksum_algorithm: [
                  item.checksum_algorithm || "",
                  [Validators.maxLength(64)],
                ],
                copyright: [item.copyright || "", [Validators.maxLength(256)]],
                content_url: [
                  item.content_url || "",
                  [
                    Validators.maxLength(1800),
                    Validators.pattern("https?://.*"),
                  ],
                ],
                content_size_kb: [item.content_size_kb || "", []],
                date_published: [
                  item.date_published || new Date().toISOString(),
                ],
                description: [
                  item.description || "",
                  [Validators.maxLength(1800)],
                ],
                encoding_format: [
                  item.encoding_format || "",
                  [Validators.maxLength(256)],
                ],
                name: [item.name || "", [Validators.maxLength(256)]],
                technology_readiness_level: [
                  item.technology_readiness_level || "",
                  [, Validators.max(9)],
                ],
              });
              break;
            case "memory":
              formGroup = this.fb.group({
                type: [item.type || "", [Validators.maxLength(256)]],
                amount_gb: [item.amount_gb || "", []],
                read_bandwidth: [item.read_bandwidth || null, []],
                write_bandwidth: [item.write_bandwidth || null, []],
                rdma: [item.rdma || false, [Validators.maxLength(256)]],
              });
              break;
            case "storage":
              formGroup = this.fb.group({
                model: [item.model || "", [Validators.maxLength(256)]],
                vendor: [item.vendor || "", [Validators.maxLength(256)]],
                amount: [item.amount || "", []],
                type: [item.type || "", [Validators.maxLength(256)]],
                read_bandwidth: [item.read_bandwidth || null, []],
                write_bandwidth: [item.write_bandwidth || null, []],
              });
              break;
            case "distribution":
              formGroup = this.fb.group({
                platform: [item.platform || "", [Validators.maxLength(64)]],
                platform_resource_identifier: [
                  item.platform_resource_identifier || "",
                  [Validators.maxLength(256)],
                ],
                checksum: [item.checksum || "", [Validators.maxLength(1800)]],
                checksum_algorithm: [
                  item.checksum_algorithm || "",
                  [Validators.maxLength(64)],
                ],
                copyright: [item.copyright || "", [Validators.maxLength(256)]],
                content_url: [
                  item.content_url || "",
                  [
                    Validators.maxLength(1800),
                    Validators.pattern("https?://.*"),
                  ],
                ],
                content_size_kb: [item.content_size_kb || "", []],
                date_published: [item.date_published || "", []],
                description: [
                  item.description || "",
                  [Validators.maxLength(1800)],
                ],
                encoding_format: [
                  item.encoding_format || "",
                  [Validators.maxLength(256)],
                ],
                name: [item.name || "", [Validators.maxLength(256)]],
                technology_readiness_level: [
                  item.technology_readiness_level || "",
                  [Validators.max(9)],
                ],
              });
              break;
            case "location":
              formGroup = this.fb.group({
                address: this.fb.group({
                  region: [item.address?.region || "", []],
                  locality: [item.address?.locality || "", []],
                  street: [item.address?.street || "", []],
                  postal_code: [item.address?.postal_code || "", []],
                  address: [item.address?.address || "", []],
                  country: [item.address?.country || "", []],
                }),
                geo: this.fb.group({
                  latitude: [item.geo?.latitude || 0],
                  longitude: [item.geo?.longitude || 0],
                  elevation_millimeters: [item.geo?.elevation_millimeters || 0],
                }),
              });
              break;
            default:
              formGroup = this.fb.group({});
              Object.keys(item).forEach((key) => {
                formGroup.addControl(key, this.fb.control(item[key] || ""));
              });
          }
          formArray.push(formGroup);
        });
      }
    });

    // Update notes
    if (data.note && Array.isArray(data.note)) {
      const noteArray = this.assetForm.get("note") as FormArray;
      noteArray.clear();
      data.note.forEach((note: any) => {
        noteArray.push(this.fb.group({ value: note.value }));
      });
    }

    // Activate validations
    this.assetForm.markAllAsTouched();
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      region: ["", [Validators.maxLength(256)]],
      locality: ["", [Validators.maxLength(256)]],
      street: ["", [Validators.maxLength(256)]],
      postal_code: ["", [Validators.maxLength(64)]],
      address: ["", [Validators.maxLength(256)]],
      country: ["", []],
    });
  }

  createGeoGroup(): FormGroup {
    return this.fb.group({
      latitude: ["", []],
      longitude: ["", []],
      elevation_millimeters: ["", []],
    });
  }

  // Getter methods for form arrays
  get acceleratorControls() {
    return (this.assetForm.get("accelerator") as FormArray).controls;
  }

  get alternateNameControls() {
    return (this.assetForm.get("alternate_name") as FormArray).controls;
  }

  get applicationAreaControls() {
    return (this.assetForm.get("application_area") as FormArray).controls;
  }

  get industrialSectorControls() {
    return (this.assetForm.get("industrial_sector") as FormArray).controls;
  }

  get keywordControls() {
    return (this.assetForm.get("keyword") as FormArray).controls;
  }

  get relevantLinkControls() {
    return (this.assetForm.get("relevant_link") as FormArray).controls;
  }

  get researchAreaControls() {
    return (this.assetForm.get("research_area") as FormArray).controls;
  }

  get scientificDomainControls() {
    return (this.assetForm.get("scientific_domain") as FormArray).controls;
  }

  get mediaControls() {
    return (this.assetForm.get("media") as FormArray).controls;
  }

  get memoryControls() {
    return (this.assetForm.get("memory") as FormArray).controls;
  }

  get relevantResourceControls() {
    return (this.assetForm.get("relevant_resource") as FormArray).controls;
  }

  get relevantToControls() {
    return (this.assetForm.get("relevant_to") as FormArray).controls;
  }

  get storageControls() {
    return (this.assetForm.get("storage") as FormArray).controls;
  }

  get cpuControls() {
    return (this.assetForm.get("cpu") as FormArray).controls;
  }

  get citationControls() {
    return (this.assetForm.get("citation") as FormArray).controls;
  }

  get contactControls() {
    return (this.assetForm.get("contact") as FormArray).controls;
  }

  get creatorControls() {
    return (this.assetForm.get("creator") as FormArray).controls;
  }

  get isPartOfControls() {
    return (this.assetForm.get("is_part_of") as FormArray).controls;
  }

  get hasPartControls() {
    return (this.assetForm.get("has_part") as FormArray).controls;
  }

  get noteControls() {
    return (this.assetForm.get("note") as FormArray).controls;
  }

  get distributionControls() {
    return (this.assetForm.get("distribution") as FormArray).controls;
  }

  get locationControls() {
    return (this.assetForm.get("location") as FormArray).controls;
  }

  addAccelerator() {
    const acceleratorForm = this.fb.group({
      vendor: ["", [Validators.maxLength(256)]],
      type: ["", [Validators.maxLength(256)]],
      acc_model_name: ["", [Validators.maxLength(256)]],
      architecture: ["", [Validators.maxLength(256)]],
      cores: ["", []],
      memory: ["", []],
    });

    (this.assetForm.get("accelerator") as FormArray).push(acceleratorForm);
  }

  removeAccelerator(index: number) {
    (this.assetForm.get("accelerator") as FormArray).removeAt(index);
  }

  addAlternateName() {
    (this.assetForm.get("alternate_name") as FormArray).push(
      this.fb.control("")
    );
  }

  removeAlternateName(index: number) {
    (this.assetForm.get("alternate_name") as FormArray).removeAt(index);
  }

  addApplicationArea() {
    (this.assetForm.get("application_area") as FormArray).push(
      this.fb.control("")
    );
  }

  removeApplicationArea(index: number) {
    (this.assetForm.get("application_area") as FormArray).removeAt(index);
  }

  addIndustrialSector() {
    (this.assetForm.get("industrial_sector") as FormArray).push(
      this.fb.control("")
    );
  }

  removeIndustrialSector(index: number) {
    (this.assetForm.get("industrial_sector") as FormArray).removeAt(index);
  }

  addKeyword() {
    (this.assetForm.get("keyword") as FormArray).push(this.fb.control(""));
  }

  removeKeyword(index: number) {
    (this.assetForm.get("keyword") as FormArray).removeAt(index);
  }

  addRelevantLink() {
    (this.assetForm.get("relevant_link") as FormArray).push(
      this.fb.control("")
    );
  }

  removeRelevantLink(index: number) {
    (this.assetForm.get("relevant_link") as FormArray).removeAt(index);
  }

  addResearchArea() {
    (this.assetForm.get("research_area") as FormArray).push(
      this.fb.control("")
    );
  }

  removeResearchArea(index: number) {
    (this.assetForm.get("research_area") as FormArray).removeAt(index);
  }

  addScientificDomain() {
    (this.assetForm.get("scientific_domain") as FormArray).push(
      this.fb.control("")
    );
  }

  removeScientificDomain(index: number) {
    (this.assetForm.get("scientific_domain") as FormArray).removeAt(index);
  }

  addMedia() {
    const mediaForm = this.fb.group({
      platform: ["", [Validators.maxLength(64)]],
      platform_resource_identifier: ["", [Validators.maxLength(256)]],
      checksum: ["", [Validators.maxLength(1800)]],
      checksum_algorithm: ["", [Validators.maxLength(64)]],
      copyright: ["", [Validators.maxLength(256)]],
      content_url: [
        "",
        [Validators.maxLength(1800), Validators.pattern("https?://.*")],
      ],
      content_size_kb: ["", []],
      date_published: [null, []],
      description: ["", [Validators.maxLength(1800)]],
      encoding_format: ["", [Validators.maxLength(256)]],
      name: ["", [Validators.maxLength(256)]],
      technology_readiness_level: ["", [, Validators.max(9)]],
    });

    (this.assetForm.get("media") as FormArray).push(mediaForm);
  }

  removeMedia(index: number) {
    (this.assetForm.get("media") as FormArray).removeAt(index);
  }

  addMemory() {
    const memoryForm = this.fb.group({
      type: ["", [Validators.maxLength(256)]],
      amount_gb: ["", []],
      read_bandwidth: [0, []],
      write_bandwidth: [0, []],
      rdma: [false, [Validators.maxLength(256)]],
    });

    (this.assetForm.get("memory") as FormArray).push(memoryForm);
  }

  removeMemory(index: number) {
    (this.assetForm.get("memory") as FormArray).removeAt(index);
  }

  addRelevantResource() {
    (this.assetForm.get("relevant_resource") as FormArray).push(
      this.fb.control("")
    );
  }

  removeRelevantResource(index: number) {
    (this.assetForm.get("relevant_resource") as FormArray).removeAt(index);
  }

  addRelevantTo() {
    (this.assetForm.get("relevant_to") as FormArray).push(this.fb.control(""));
  }

  removeRelevantTo(index: number) {
    (this.assetForm.get("relevant_to") as FormArray).removeAt(index);
  }

  addStorage() {
    const storageForm = this.fb.group({
      model: ["", [Validators.maxLength(256)]],
      vendor: ["", [Validators.maxLength(256)]],
      amount: ["", []],
      type: ["", [Validators.maxLength(256)]],
      read_bandwidth: [0, []],
      write_bandwidth: [0, []],
    });

    (this.assetForm.get("storage") as FormArray).push(storageForm);
  }

  removeStorage(index: number) {
    (this.assetForm.get("storage") as FormArray).removeAt(index);
  }

  addCpu() {
    const cpuForm = this.fb.group({
      num_cpu_cores: ["", []],
      architecture: ["", [Validators.maxLength(256)]],
      vendor: ["", [Validators.maxLength(256)]],
      cpu_model_name: ["", [Validators.maxLength(256)]],
      cpu_family: ["", [Validators.maxLength(256)]],
      clock_speed: [null, []],
    });

    (this.assetForm.get("cpu") as FormArray).push(cpuForm);
  }

  removeCpu(index: number) {
    (this.assetForm.get("cpu") as FormArray).removeAt(index);
  }

  addCitation() {
    (this.assetForm.get("citation") as FormArray).push(this.fb.control(""));
  }

  removeCitation(index: number) {
    (this.assetForm.get("citation") as FormArray).removeAt(index);
  }

  addContact() {
    (this.assetForm.get("contact") as FormArray).push(this.fb.control(""));
  }

  removeContact(index: number) {
    (this.assetForm.get("contact") as FormArray).removeAt(index);
  }

  addCreator() {
    (this.assetForm.get("creator") as FormArray).push(this.fb.control(null));
  }

  removeCreator(index: number) {
    (this.assetForm.get("creator") as FormArray).removeAt(index);
  }

  addIsPartOf() {
    (this.assetForm.get("is_part_of") as FormArray).push(this.fb.control(""));
  }

  removeIsPartOf(index: number) {
    (this.assetForm.get("is_part_of") as FormArray).removeAt(index);
  }

  addHasPart() {
    (this.assetForm.get("has_part") as FormArray).push(this.fb.control(""));
  }

  removeHasPart(index: number) {
    (this.assetForm.get("has_part") as FormArray).removeAt(index);
  }

  addNote() {
    (this.assetForm.get("note") as FormArray).push(
      this.fb.group({
        value: [""],
      })
    );
  }

  removeNote(index: number) {
    (this.assetForm.get("note") as FormArray).removeAt(index);
  }

  addDistribution() {
    const distributionForm = this.fb.group({
      platform: ["", [Validators.maxLength(64)]],
      platform_resource_identifier: ["", [Validators.maxLength(256)]],
      checksum: ["", [Validators.maxLength(1800)]],
      checksum_algorithm: ["", [Validators.maxLength(64)]],
      copyright: ["", [Validators.maxLength(256)]],
      content_url: [
        "",
        [Validators.maxLength(1800), Validators.pattern("https?://.*")],
      ],
      content_size_kb: ["", []],
      date_published: [null, []],
      description: ["", [Validators.maxLength(1800)]],
      encoding_format: ["", [Validators.maxLength(256)]],
      name: ["", [Validators.maxLength(256)]],
      technology_readiness_level: ["", [Validators.max(9)]],
    });

    (this.assetForm.get("distribution") as FormArray).push(distributionForm);
  }

  removeDistribution(index: number) {
    (this.assetForm.get("distribution") as FormArray).removeAt(index);
  }

  addLocation() {
    const locationForm = this.fb.group({
      address: this.fb.group({
        region: ["", []],
        locality: ["", []],
        street: ["", []],
        postal_code: ["", []],
        address: ["", []],
        country: ["", []],
      }),
      geo: this.fb.group({
        latitude: [0],
        longitude: [0],
        elevation_millimeters: [0],
      }),
    });

    (this.assetForm.get("location") as FormArray).push(locationForm);

    const index = this.locationControls.length - 1;
    setTimeout(() => this.initMap(index), 100);
  }

  removeLocation(index: number) {
    if (this.maps[index]) {
      this.maps[index].remove();
      delete this.maps[index];
      delete this.markers[index];
    }
    (this.assetForm.get("location") as FormArray).removeAt(index);
  }

  private initMap(index: number) {
    const mapElement = document.getElementById(`map-${index}`);
    if (!mapElement) return;

    setTimeout(() => {
      const map = L.map(`map-${index}`, {
        center: [0, 0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
        minZoom: 2,
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: true,
      }).addTo(map);

      const marker = L.marker([0, 0], {
        draggable: true,
        autoPan: true,
        icon: this.customIcon
      }).addTo(map);

      this.maps[index] = map;
      this.markers[index] = marker;

      // Force map size update
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      this.setupMapEvents(index, map, marker);
    }, 0);
  }

  private setupMapEvents(index: number, map: L.Map, marker: L.Marker) {
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.updatePosition(index, lat, lng);
    });

    marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      this.updatePosition(index, lat, lng);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.updatePosition(index, latitude, longitude);
          map.setView([latitude, longitude], 13);
        },
        () => {
          // Default position
          map.setView([0, 0], 2);
        }
      );
    }
  }

  private updatePosition(index: number, lat: number, lng: number) {
    const geoGroup = this.locationControls[index].get("geo");
    if (geoGroup) {
      geoGroup.patchValue({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
      });

      if (this.markers[index]) {
        this.markers[index].setLatLng([lat, lng]);
      }

      // Add timeout to avoid too many updates
      clearTimeout(this.geocodingTimeout);
      this.geocodingTimeout = setTimeout(() => {
        this.updateAddressFromCoordinates(index, lat, lng);
      }, 1000);
    }
  }

  private async updateAddressFromCoordinates(
    index: number,
    lat: number,
    lng: number
  ) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      const addressGroup = this.locationControls[index].get("address");

      if (addressGroup && data.address) {
        const countryCode = data.address.country_code
          ? this.countryCodeService.toAlpha3(data.address.country_code)
          : "";

        addressGroup.patchValue({
          region: data.address.state || data.address.region || "",
          locality:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          street: data.address.road || "",
          postal_code: data.address.postcode || "",
          address: [
            data.address.road,
            data.address.house_number,
            data.address.suburb,
          ]
            .filter(Boolean)
            .join(", "),
          country: countryCode,
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }

  async searchAddress(index: number) {
    const addressGroup = this.locationControls[index].get("address");
    if (!addressGroup) return;

    const addressValues = addressGroup.value;
    const searchQuery = [
      addressValues.street,
      addressValues.locality,
      addressValues.region,
      addressValues.country,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data[0]) {
        const { lat, lon } = data[0];
        this.updatePosition(index, parseFloat(lat), parseFloat(lon));
        this.maps[index].setView([parseFloat(lat), parseFloat(lon)], 16);
      }
    } catch (error) {
      console.error("Error searching address:", error);
    }
  }

  onSubmit() {
    if (this.assetForm.valid) {
      this.api
        .createCatalogueComputationalAsset(this.assetForm.value)
        .subscribe({
          next: (resp: any) => {
            this.router.navigate(["/data"], {
              queryParams: { id: resp.identifier },
            });
          },
        });
    } else {
      Object.keys(this.assetForm.controls).forEach((key) => {
        const control = this.assetForm.get(key);
        if (control instanceof FormControl) {
          control.markAsTouched();
        }
      });
    }
  }
}
