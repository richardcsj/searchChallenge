import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatCheckboxChange} from '@angular/material';
import {Facet, Filter} from '../../services/results.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  formats: Facet[] = [];
  checkedFormats: string[] = [];
  keywords: Facet[] = [];
  checkedKeywords: string[] = [];

  onFilter = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.formats = data.formats;
    this.keywords = data.keywords;
    if (data.filters) {
      for (const keyword of data.filters.keywords) {
        this.checkedKeywords.push(keyword);
      }
      for (const format of data.filters.formats) {
        this.checkedFormats.push(format);
      }
    }
  }

  ngOnInit() {
  }

  filter() {
    const filter: Filter = {
      formats: this.checkedFormats,
      keywords: this.checkedKeywords
    };
    this.onFilter.emit(filter);
  }

  formatsChange(event: MatCheckboxChange, format: string) {
    if (event.checked) {
      this.checkedFormats.push(format);
    } else {
      this.checkedFormats.splice(this.checkedFormats.indexOf(format));
    }
  }

  keywordsChange(event: MatCheckboxChange, keyword: string) {
    if (event.checked) {
      this.checkedKeywords.push(keyword);
    } else {
      this.checkedKeywords.splice(this.checkedKeywords.indexOf(keyword));
    }
  }

}
