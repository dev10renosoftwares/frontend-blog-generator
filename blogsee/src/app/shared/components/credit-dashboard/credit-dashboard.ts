import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditPricingResponseDto } from '../../../ServiceModels/v1/Credit/CreditPricingResponseDto';
import { CreditService } from '../../../services/credit';

@Component({
  selector: 'app-credit-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-dashboard.html',
  styleUrl: './credit-dashboard.css'
})
export class CreditDashboard implements OnInit {

  availableCredits = 0;
  creditPricing: CreditPricingResponseDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private creditService: CreditService) {}

  ngOnInit(): void {
    this.loadCredits();
    this.loadPricing();
  }

  loadCredits(): void {
    this.creditService.getCredits().subscribe({
      next: (response) => {
        const credits = 'data' in response
          ? response.data?.availableCredits
          : response.availableCredits;

        this.availableCredits = Number(credits ?? 0);
      },
      error: (error) => {
        console.error('Credit balance error:', error);
      }
    });
  }

  loadPricing(): void {
    this.loading = true;
    this.errorMessage = '';

    this.creditService.getCreditPricing().subscribe({
      next: (response) => {
        this.creditPricing = Array.isArray(response)
          ? response
          : response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Credit pricing error:', error);
        this.creditPricing = [];
        this.loading = false;
        this.errorMessage = 'Unable to load credit pricing.';
      }
    });
  }
}
