import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SearchService} from '../services/search.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Facet, Facets, Filter, ResultsModel, SolrResponse} from '../services/results.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ISubscription} from 'rxjs/Subscription';
import {FiltersComponent} from './filters/filters.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  queryTerm: string;
  results: ResultsModel[];
  numFound: number;
  formats: Facet[] = [];
  keywords: Facet[] = [];
  filters: Filter;
  start = 0;
  loading: boolean;
  hasError: boolean;
  queryParamsSub: ISubscription;
  filterSub: ISubscription;
  @ViewChild('queryInput') queryInputRef: ElementRef;

  constructor(private fb: FormBuilder,
              private searchService: SearchService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  get query() {
    return this.searchForm.get('query').value;
  }

  get hasNoResults() {
    return !this.loading && this.queryTerm && (!this.results || this.results.length === 0);
  }

  get hasResults() {
    return this.queryTerm && this.results && this.results.length > 0;
  }

  get showLoadMore() {
    return !this.loading && this.queryTerm && this.results && this.results.length < this.numFound;
  }

  ngOnInit() {
    this.initSearchForm();
    this.subToQueryParams();
  }

  subToQueryParams() {
    this.queryParamsSub = this.activatedRoute.queryParams.subscribe(params => {
      this.queryTerm = params['q'];
      this.filters = {
        formats: (params['formats']) ? [].concat(params['formats']) : [],
        keywords: (params['keywords']) ? [].concat(params['keywords']) : []
      };
      if (this.queryTerm) {
        this.searchForm.setValue({'query': this.queryTerm});
        this.reinitAttrs();
        this.fetchResults();
        this.fetchFacets();
      } else {
        this.searchForm.setValue({'query': ''});
      }
    });
  }

  fetchResults() {
    this.loading = true;
    this.hasError = false;
    this.searchService.fetchResults(this.queryTerm, this.filters, this.start)
      .then((solrResponse: SolrResponse) => {
        this.loading = false;
        if (!this.results) {
          this.results = solrResponse.results;
        } else {
          this.results = this.results.concat(solrResponse.results);
        }
        this.numFound = solrResponse.numFound;
        this.start += 10;
      })
      .catch((err) => {
        this.loading = false;
        this.hasError = true;
        this.snackBar.open(`Error retrieving results for ${this.queryTerm}`, 'X', {
          duration: 3000,
          extraClasses: ['snack-bar-error'],
        });
      });
  }

  fetchFacets() {
    this.searchService.fetchFacets(this.queryTerm)
      .then((facets: Facets) => {
        this.formats = facets.formats;
        this.keywords = facets.keywords;
      })
      .catch((err) => {
        this.snackBar.open(`Error retrieving facets for ${this.queryTerm}`, 'X', {
          duration: 3000,
          extraClasses: ['snack-bar-error'],
        });
      });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      query: [''],
    });
  }

  search() {
    this.queryTerm = this.query;
    this.router.navigate([], {
      queryParams: {
        q: this.queryTerm,
      },
      relativeTo: this.activatedRoute,
    });
  }

  reinitResults() {
    this.results = null;
    this.start = 0;
  }

  reinitAttrs() {
    this.reinitResults();
    this.formats = [];
    this.keywords = [];
  }

  clearForm() {
    this.searchForm.reset();
    this.queryInputRef.nativeElement.focus();
  }

  filter() {
    const dialogRef = this.dialog.open(FiltersComponent, {
      data: {
        formats: this.formats,
        keywords: this.keywords,
        filters: this.filters
      },
    });
    this.filterSub = dialogRef.componentInstance.onFilter
      .subscribe((filter: Filter) => {
        this.router.navigate([], {
          queryParams: {
            q: this.queryTerm,
            formats: filter.formats,
            keywords: filter.keywords,
          },
          relativeTo: this.activatedRoute,
        });
        this.filterSub.unsubscribe();
      });
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
    this.filterSub.unsubscribe();
  }

}
