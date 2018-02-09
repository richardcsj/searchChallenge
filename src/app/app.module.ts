import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchComponent} from './search/search.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSnackBarModule
} from '@angular/material';
import {SearchService} from './services/search.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FiltersComponent} from './search/filters/filters.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '', component: SearchComponent},
    ]),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  providers: [SearchService],
  bootstrap: [AppComponent],
  entryComponents: [FiltersComponent]
})
export class AppModule {
}
