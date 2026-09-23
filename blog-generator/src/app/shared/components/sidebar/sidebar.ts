import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  constructor(
    private authService: AuthService
  ) {}

  createBlog(): void {

    this.authService.openAuthRequired();
    

  }
}