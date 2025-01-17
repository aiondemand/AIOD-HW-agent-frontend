import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl: string;
  private httpOptions: object = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  };

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.baseUrl}`;
  }

  // Configuration
  getConfigs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/configurations/`, {
      ...this.httpOptions,
    });
  }

  createConfig(type: string, config: any, headers: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/configurations/${type}`, config, {
      headers,
    });
  }

  deleteConfig(configId: string) {
    return this.http.delete(`${this.baseUrl}/configurations/${configId}`, {
      ...this.httpOptions,
    });
  }

  getPlugins(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plugins/`, {
      ...this.httpOptions,
    });
  }

  reloadPlugins(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/plugins/reload`,
      {},
      {
        ...this.httpOptions,
      }
    );
  }

  // Hw agent assets
  getComputationalAsset() {
    return this.http.get(`${this.baseUrl}/computational-assets`, {
      ...this.httpOptions,
    });
  }

  getComputationalAssetById(configId: string) {
    return this.http.get(`${this.baseUrl}/computational-assets/${configId}`, {
      ...this.httpOptions,
    });
  }

  // Catalogue assets
  getCatalogueComputationalAssetById(assetId: string) {
    return this.http.get(
      `${this.baseUrl}/catalogue/computational-assets/${assetId}`,
      {
        ...this.httpOptions,
      }
    );
  }

  getCatalogueComputationalAsset() {
    return this.http.get(`${this.baseUrl}/catalogue/computational-assets/`, {
      ...this.httpOptions,
    });
  }

  createCatalogueComputationalAsset(data: any) {
    return this.http.post(
      `${this.baseUrl}/catalogue/computational-assets`,
      data,
      {
        ...this.httpOptions,
      }
    );
  }
}
