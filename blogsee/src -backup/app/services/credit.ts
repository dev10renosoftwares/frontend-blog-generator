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

private readonly baseUrl =
`${environment.apiUrl}/Credits`;

constructor(
private http: HttpClient
) {}

// =====================================================
// GET AVAILABLE CREDITS
// =====================================================

getCredits(): Observable<GetCreditsResponseDto> {


console.log(
  'Getting credits from:',
  this.baseUrl
);

return this.http.get<GetCreditsResponseDto>(
  this.baseUrl
);


}

// =====================================================
// GET CREDIT PRICING
// =====================================================

getCreditPricing(): Observable<CreditPricingResponseDto> {

console.log(
  'Getting credit pricing from:',
  `${this.baseUrl}/pricing`
);

return this.http.get<CreditPricingResponseDto>(
  `${this.baseUrl}/pricing`
);


}
}
