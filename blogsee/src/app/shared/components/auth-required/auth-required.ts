import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';


@Component({
  selector: 'app-auth-required',
  standalone: true,
  imports: [],
  templateUrl: './auth-required.html',
  styleUrl: './auth-required.css'
})
export class AuthRequiredComponent {

 
  constructor(
    public  authService: AuthService,
   
    private router: Router
  ) {}

  // open():void{
  //   this.showAuthRequired = this.authService.openAuthRequired();
  // }
  close(): void {
    this.authService.closeAuthRequired();
  }

  login(): void {

    this.authService.closeAuthRequired();

    this.router.navigate(['/login']);

  }

  register(): void {

    this.authService.closeAuthRequired();

    this.router.navigate(['/register']);

  }

}