import { Component } from '@angular/core';
import { Router } from '@angular/router';
import{RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboardComponent {

  username = 'Tamanna';

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

 

}