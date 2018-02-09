export interface ResultsModel {
  title: string;
  name: string;
  format: string;
  fullpath: string;
  absolute_path: string;
  thumb: string;
  download: string;
  modified: string;
  keywords: string[];
}

export interface SolrResponse {
  results: ResultsModel[];
  numFound: number;
}

export interface Facets {
  formats: Facet[];
  keywords: Facet[];
}

export interface Facet {
  label: string;
  count: number;
}

export interface Filter {
  formats: string[];
  keywords: string[];
}
