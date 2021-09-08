import { HttpClient } from '@angular/common/http';
import { literalMap } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { countryDataSummary } from '../models/country-data';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private baseUrl = 'https://api.corona-zahlen.org';
  
  constructor(private http : HttpClient) { }
  getRequest(url: string){
   
    return this.http.get(this.baseUrl + url);
  }
}
