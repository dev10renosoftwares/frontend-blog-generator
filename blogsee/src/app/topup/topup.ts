import { Component } from '@angular/core';

interface TopupPlan {
  id: number;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

@Component({
  selector: 'app-topup',
  imports: [],
  templateUrl: './topup.html',
  styleUrl: './topup.css',
})
export class Topup {
   
   currentCredits = 95;

  plans: TopupPlan[] = [
    {
      id: 1,
      name: 'Advance Plan',
      price: 100,
      credits: 100,
      features: [
        '100 Credits',
        'Great for getting started',
        'Access to all basic features',
        'Standard support'
      ]
    },
    {
      id: 2,
      name: 'Pro Plan',
      price: 300,
      credits: 300,
      features: [
        '300 Credits',
        'More generations',
        'All premium features',
        'Priority support'
      ]
    },
    {
      id: 3,
      name: 'Super Pro Plan',
      price: 500,
      credits: 500,
      features: [
        '500 Credits',
        'Maximum generations',
        'All premium features',
        'Priority support'
      ]
    }
  ];

  goBack(): void {
    window.history.back();
  }

  buyPlan(plan: TopupPlan): void {
    console.log('Selected plan:', plan);

    // Payment API will be connected here later.
  }
}
