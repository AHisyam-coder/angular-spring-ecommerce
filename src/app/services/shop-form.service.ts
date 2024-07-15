import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.baseUrl + 'countries')
      .pipe(map((response) => response._embedded.countries));
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.httpClient
      .get<GetResponseStates>(
        this.baseUrl + `states/search/findByCountryCode?code=${countryCode}`
      )
      .pipe(map((response) => response._embedded.states));
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    //build array form month dd list

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
