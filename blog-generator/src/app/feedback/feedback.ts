import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  

 

constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

}
