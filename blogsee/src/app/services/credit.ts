import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { CreditPricingResponseDto } from '../ServiceModels/v1/Credit/CreditPricingResponseDto';
import { GetCreditsResponseDto } from '../ServiceModels/v1/Credit/GetCreditsResponseDto';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  private readonly baseUrl = `${environment.apiUrl}/Credits`;

  constructor(private http: HttpClient) {}

  getCredits(): Observable<GetCreditsResponseDto | { data: GetCreditsResponseDto }> {
    return this.http.get<GetCreditsResponseDto | { data: GetCreditsResponseDto }>(this.baseUrl);
  }

  getCreditPricing(): Observable<CreditPricingResponseDto[] | { data: CreditPricingResponseDto[] }> {
    return this.http.get<CreditPricingResponseDto[] | { data: CreditPricingResponseDto[] }>(
      `${this.baseUrl}/pricing`
    );
  }
}
