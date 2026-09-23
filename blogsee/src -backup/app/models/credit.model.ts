
export interface CreditPricing {

  serviceName: string;

  creditsRequired: number;

  description: string;

}


export interface CreditPricingResponse {

  success: boolean;

  message: string;

  data: CreditPricing[];

  errors: any;

}


export interface CreditResponse {

  success: boolean;

  message: string;

  data: {

    availableCredits: number;

  };

  errors: any;

}
