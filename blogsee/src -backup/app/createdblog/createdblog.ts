
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlogService } from '../services/createblog';

@Component({
  selector: 'app-createdblog',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './createdblog.html',
  styleUrl: './createdblog.css'
})
export class CreatedblogComponent implements OnInit {

  /* =====================================================
     BLOG DATA
  ===================================================== */

  blog = {
    title: 'Generated Blog',
    content: '',
    wordCount: 0,
    category: '',
    language: ''
  };


  /* =====================================================
     BLOG STATUS
  ===================================================== */

  isDraft = true;
  isPublished = false;


  /* =====================================================
     ACTION MESSAGE
  ===================================================== */

  actionMessage = '';


  /* =====================================================
     CONSTRUCTOR
  ===================================================== */

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}


  /* =====================================================
     INITIALIZE
  ===================================================== */

  ngOnInit(): void {

    const response = this.blogService.getGeneratedBlog();

    console.log('Generated blog response:', response);

    if (!response) {

      this.actionMessage =
        'No generated blog found. Please generate a blog first.';

      return;
    }

    this.loadBlog(response);
  }


  /* =====================================================
     LOAD BLOG FROM API RESPONSE
  ===================================================== */

  private loadBlog(response: any): void {

    /*
      Expected backend response:

      {
        Success: true,
        Message: "...",
        Data: {
          title: "...",
          content: "...",
          wordCount: 500,
          category: "...",
          language: "..."
        }
      }
    */

    const data = response?.Data ?? response?.data ?? response;

    if (!data) {

      this.actionMessage =
        response?.Message ||
        response?.message ||
        'Unable to load the generated blog.';

      return;
    }


    this.blog = {

      title:
        data.title ??
        data.Title ??
        'Generated Blog',

      content:
        data.content ??
        data.Content ??
        '',

      wordCount:
        data.wordCount ??
        data.WordCount ??
        0,

      category:
        data.category ??
        data.Category ??
        '',

      language:
        data.language ??
        data.Language ??
        ''
    };


    /*
      New generated blogs start as drafts.
    */

    this.isDraft = true;
    this.isPublished = false;

    this.actionMessage = '';

    console.log('Loaded blog:', this.blog);
  }


  /* =====================================================
     AI IMAGE
  ===================================================== */

  aiImage(): void {

    this.actionMessage =
      'AI Image generation will be available soon.';

    this.clearMessageAfterDelay();
  }



  //generate tags
  tags(): void {

    this.actionMessage =
      'Tag generation will be available soon.';

    this.clearMessageAfterDelay();
  }

  /* =====================================================
     SHORTEN BLOG
  ===================================================== */

  shortenBlog(): void {

    if (!this.blog.content) {
      return;
    }

    this.actionMessage =
      'Shorten feature will be connected to the AI service soon.';

    this.clearMessageAfterDelay();
  }


  /* =====================================================
     EXPAND BLOG
  ===================================================== */

  expandBlog(): void {

    if (!this.blog.content) {
      return;
    }

    this.actionMessage =
      'Expand feature will be connected to the AI service soon.';

    this.clearMessageAfterDelay();
  }


  /* =====================================================
     RE-GENERATE BLOG
  ===================================================== */

  regenerateBlog(): void {

    /*
      Return to Create Blog page so the user
      can generate another blog using the API.
    */

    this.blogService.clearGeneratedBlog();

    this.router.navigate(['/create-prompt']);
  }


  /* =====================================================
     SAVE AS DRAFT
  ===================================================== */

  saveDraft(): void {

    this.isDraft = true;
    this.isPublished = false;

    this.actionMessage =
      'Blog saved as draft successfully.';

    this.clearMessageAfterDelay();
  }


  /* =====================================================
     PUBLISH BLOG
  ===================================================== */

  publishBlog(): void {

    this.isDraft = false;
    this.isPublished = true;

    this.actionMessage =
      'Blog published successfully.';

    this.clearMessageAfterDelay();
  }


  /* =====================================================
     CLEAR MESSAGE
  ===================================================== */

  private clearMessageAfterDelay(): void {

    setTimeout(() => {

      this.actionMessage = '';

    }, 3000);
  }

}
