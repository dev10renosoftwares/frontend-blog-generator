import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css'
})
export class CreateBlogComponent {
  

  blog = {
    language:'',
    category: '',
    tone: '',
    topic: '',
    audience: '',
  wordCount: null as number | null
  };

  isGenerating = false;
  showMessage = false;

  categories = [
    'Technology',
    'Artificial Intelligence',
    'Education',
    'Business',
    'Health',
    'Lifestyle',
    'Travel',
    'Finance'
  ];

  tones = [
    'Professional',
    'Casual',
    'Friendly',
    'Academic',
    'Persuasive',
    'Creative'
  ];

constructor(
  private router: Router
) {}
 generateBlog(): void {

  this.isGenerating = true;

  setTimeout(() => {

    this.isGenerating = false;

    this.router.navigate(['/createdblog']);

  }, 800);
}

}