import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {
  private readonly countryCodeMapping: { [key: string]: string } = {
    'AD': 'AND', 'AE': 'ARE', 'AF': 'AFG', 'AG': 'ATG', 'AI': 'AIA',
    'AL': 'ALB', 'AM': 'ARM', 'AO': 'AGO', 'AR': 'ARG', 'AT': 'AUT',
    'AU': 'AUS', 'AW': 'ABW', 'AZ': 'AZE', 'BA': 'BIH', 'BB': 'BRB',
    'BD': 'BGD', 'BE': 'BEL', 'BF': 'BFA', 'BG': 'BGR', 'BH': 'BHR',
    'BI': 'BDI', 'BJ': 'BEN', 'BM': 'BMU', 'BN': 'BRN', 'BO': 'BOL',
    'BR': 'BRA', 'BS': 'BHS', 'BT': 'BTN', 'BW': 'BWA', 'BY': 'BLR',
    'BZ': 'BLZ', 'CA': 'CAN', 'CH': 'CHE', 'CL': 'CHL', 'CN': 'CHN',
    'CO': 'COL', 'CR': 'CRI', 'CU': 'CUB', 'CV': 'CPV', 'CY': 'CYP',
    'CZ': 'CZE', 'DE': 'DEU', 'DK': 'DNK', 'DO': 'DOM', 'DZ': 'DZA',
    'EC': 'ECU', 'EE': 'EST', 'EG': 'EGY', 'ES': 'ESP', 'FI': 'FIN',
    'FJ': 'FJI', 'FR': 'FRA', 'GB': 'GBR', 'GR': 'GRC', 'HK': 'HKG',
    'HU': 'HUN', 'ID': 'IDN', 'IE': 'IRL', 'IL': 'ISR', 'IN': 'IND',
    'IQ': 'IRQ', 'IR': 'IRN', 'IS': 'ISL', 'IT': 'ITA', 'JM': 'JAM',
    'JO': 'JOR', 'JP': 'JPN', 'KE': 'KEN', 'KR': 'KOR', 'KW': 'KWT',
    'LB': 'LBN', 'LK': 'LKA', 'LT': 'LTU', 'LU': 'LUX', 'LV': 'LVA',
    'MA': 'MAR', 'MC': 'MCO', 'MD': 'MDA', 'MX': 'MEX', 'MY': 'MYS',
    'NG': 'NGA', 'NI': 'NIC', 'NL': 'NLD', 'NO': 'NOR', 'NZ': 'NZL',
    'OM': 'OMN', 'PA': 'PAN', 'PE': 'PER', 'PH': 'PHL', 'PK': 'PAK',
    'PL': 'POL', 'PT': 'PRT', 'PY': 'PRY', 'QA': 'QAT', 'RO': 'ROU',
    'RU': 'RUS', 'SA': 'SAU', 'SE': 'SWE', 'SG': 'SGP', 'SI': 'SVN',
    'SK': 'SVK', 'SV': 'SLV', 'TH': 'THA', 'TN': 'TUN', 'TR': 'TUR',
    'TW': 'TWN', 'UA': 'UKR', 'US': 'USA', 'UY': 'URY', 'VE': 'VEN',
    'VN': 'VNM', 'YE': 'YEM', 'ZA': 'ZAF'
  };

  toAlpha3(alpha2Code: string): string {
    if (!alpha2Code) return '';
    
    const code = alpha2Code.toUpperCase();
    return this.countryCodeMapping[code] || '';
  }
}