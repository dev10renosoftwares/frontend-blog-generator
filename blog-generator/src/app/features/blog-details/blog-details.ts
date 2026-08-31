import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css'
})
export class BlogDetails {

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

}