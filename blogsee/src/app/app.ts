import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { AuthRequiredComponent } from './shared/components/auth-required/auth-required';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    AuthRequiredComponent,
    Navbar
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

}