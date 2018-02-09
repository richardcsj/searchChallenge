import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Facet, Facets, Filter, ResultsModel, SolrResponse} from './results.model';

const url = 'http://odn.voyagersearch.com/solr/v0/select?';
const fl = 'title,name:[name],format,fullpath:[absolute],absolute_path:[absolute],' +
  'thumb:[thumbURL],download:[downloadURL],modified,keywords';
const sort = 'score desc';
const wt = 'json';
const facetFields = ['keywords', 'format'];

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {
  }

  fetchFacets(query: string): Promise<Facets> {
    const finalURL = `${url}q=${query}${this.facets()}&wt=${wt}`;
    return new Promise((resolve, reject) => {
      this.http.get(finalURL)
        .toPromise()
        .then((res: any) => {
            const formatFacet: Facet[] = [];
            const keywordsFacet: Facet[] = [];
            if (res.facet_counts && res.facet_counts.facet_fields) {
              const formats = res.facet_counts.facet_fields.format;
              for (let i = 0; formats && i < formats.length && formats[i + 1] > 0; i += 2) {
                formatFacet.push({
                  label: formats[i],
                  count: formats[i + 1],
                });
              }
              const keywords = res.facet_counts.facet_fields.keywords;
              for (let i = 0; keywords && i < keywords.length && keywords[i + 1] > 0; i += 2) {
                keywordsFacet.push({
                  label: keywords[i],
                  count: keywords[i + 1],
                });
              }
            }
            const facets: Facets = {
              formats: formatFacet,
              keywords: keywordsFacet,
            };
            resolve(facets);
          }
        );
    });
  }

  fetchResults(query: string, fq: Filter, start = 0, rows = 10): Promise<SolrResponse> {
    const finalURL = `${url}q=${query}&fl=${fl}${this.formatFq(fq)}&start=${start}&rows=${rows}&sort=${sort}&wt=${wt}`;
    return new Promise((resolve, reject) => {
      this.http.get(finalURL)
        .toPromise()
        .then((res: any) => {
            const results = (res.response.docs as ResultsModel[]);
            const solrResult: SolrResponse = {
              results: results,
              numFound: res.response.numFound
            };
            resolve(solrResult);
          }
        );
    });
  }

  formatFq(fq: Filter): string {
    if (!fq) {
      return '';
    }

    let fqStr = '';
    if (fq.formats.length > 0) {
      fqStr += `&fq={!tag=format}format:(`;
      for (const value of fq.formats) {
        fqStr += value.replace(/\s/g, '\\ ') + ' ';
      }
      fqStr = fqStr.trim() + ')';
    }
    if (fq.keywords.length > 0) {
      fqStr += `&fq={!tag=keywords}keywords:(`;
      for (const value of fq.keywords) {
        fqStr += value.replace(/\s/g, '\\ ') + ' ';
      }
      fqStr = fqStr.trim() + ')';
    }
    return fqStr;
  }

  facets(): string {
    let facet = '&facet=true';
    for (const field of facetFields) {
      facet += `&facet.field=${field}`;
    }
    return facet;
  }

}
