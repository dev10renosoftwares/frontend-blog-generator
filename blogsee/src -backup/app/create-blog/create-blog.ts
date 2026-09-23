import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { GenerateBlogRequestDto } from '../ServiceModels/v1/AIBlog/GenerateBlogRequestDto';
import { GenerateBlogResponseDto } from '../ServiceModels/v1/AIBlog/GenerateBlogResponseDto';
import { CategoryResponseDto } from '../ServiceModels/v1/Category/CategoryResponseDto';

import { BlogLanguage } from '../Enums_TypeScript/BlogLanguage';
import { BlogTone } from '../Enums_TypeScript/BlogTone';
import { BlogAudience } from '../Enums_TypeScript/BlogAudience';
import { BlogWordCount } from '../Enums_TypeScript/BlogWordCount';

import { BlogService } from '../services/createblog';

@Component({
selector: 'app-create-blog',
standalone: true,

imports: [
CommonModule,
FormsModule
],

templateUrl: './create-blog.html',
styleUrl: './create-blog.css'
})
export class CreateBlogComponent implements OnInit {

// =====================================================
// CATEGORIES
// =====================================================

categories: CategoryResponseDto[] = [];

// =====================================================
// LANGUAGES
// =====================================================

languages = [
'English',
'Urdu',
'Kashmiri',
'Spanish',
'Arabic',
'Turkish'
];

// =====================================================
// TONES
// =====================================================

tones = [
'Professional',
'Formal',
'Casual',
'Friendly',
'Persuasive',
'Creative',
'Humorous'
];

// =====================================================
// AUDIENCES
// =====================================================

audiences = [
'Students',
'Developers',
'Business Owners',
'Professionals',
'Teachers',
'Marketers',
'Entrepreneurs',
'General'
];

// =====================================================
// WORD COUNTS
// =====================================================

wordCounts = [
300,
500,
1000,
1500,
2000
];

// =====================================================
// STATES
// =====================================================

isGenerating = false;

showMessage = false;

successMessage = '';

errorMessage = '';

// =====================================================
// BLOG FORM
// =====================================================

blog = {
language: '',
category: '',
tone: '',
topic: '',
audience: '',
wordCount: null as number | null
};

// =====================================================
// CONSTRUCTOR
// =====================================================

constructor(
private blogService: BlogService,
private router: Router
) {}

// =====================================================
// INIT
// =====================================================

ngOnInit(): void {


this.loadCategories();

}

// =====================================================
// GO BACK
// =====================================================

goBack(): void {

this.router.navigate([
  '/'
]);


}

// =====================================================
// LOAD CATEGORIES
// =====================================================

loadCategories(): void {

this.blogService
  .getCategories()
  .subscribe({

    next: (response: CategoryResponseDto[]) => {

      console.log(
        'Category API Response:',
        response
      );

      this.categories =
        Array.isArray(response)
          ? response
          : [];

    },

    error: (error: HttpErrorResponse) => {

      console.error(
        'Category API Error:',
        error
      );

      this.categories = [];

    }

  });


}

// =====================================================
// LANGUAGE ENUM
// =====================================================

private getLanguageEnumValue(
language: string
): BlogLanguage {


switch (language) {

  case 'English':
    return BlogLanguage.English;

  case 'Urdu':
    return BlogLanguage.Urdu;

  case 'Kashmiri':
    return BlogLanguage.Kashmiri;

  case 'Spanish':
    return BlogLanguage.Spanish;

  case 'Arabic':
    return BlogLanguage.Arabic;

  case 'Turkish':
    return BlogLanguage.Turkish;

  default:
    return BlogLanguage.English;
}

}

// =====================================================
// TONE ENUM
// =====================================================

private getToneEnumValue(
tone: string
): BlogTone {

switch (tone) {

  case 'Professional':
    return BlogTone.Professional;

  case 'Formal':
    return BlogTone.Formal;

  case 'Casual':
    return BlogTone.Casual;

  case 'Friendly':
    return BlogTone.Friendly;

  case 'Persuasive':
    return BlogTone.Persuasive;

  case 'Creative':
    return BlogTone.Creative;

  case 'Humorous':
    return BlogTone.Humorous;

  default:
    return BlogTone.Professional;
}

}

// =====================================================
// AUDIENCE ENUM
// =====================================================

private getAudienceEnumValue(
audience: string
): BlogAudience {


switch (audience) {

  case 'Students':
    return BlogAudience.Students;

  case 'Developers':
    return BlogAudience.Developers;

  case 'Business Owners':
    return BlogAudience.BusinessOwners;

  case 'Professionals':
    return BlogAudience.Professionals;

  case 'Teachers':
    return BlogAudience.Teachers;

  case 'Marketers':
    return BlogAudience.Marketers;

  case 'Entrepreneurs':
    return BlogAudience.Entrepreneurs;

  case 'General':
    return BlogAudience.General;

  default:
    return BlogAudience.General;
}


}

// =====================================================
// WORD COUNT ENUM
// =====================================================

private getWordCountEnumValue(
wordCount: number
): BlogWordCount {


switch (wordCount) {

  case 300:
    return BlogWordCount.Words300;

  case 500:
    return BlogWordCount.Words500;

  case 1000:
    return BlogWordCount.Words1000;

  case 1500:
    return BlogWordCount.Words1500;

  case 2000:
    return BlogWordCount.Words2000;

  default:
    return BlogWordCount.Words500;
}


}

// =====================================================
// GENERATE BLOG
// =====================================================

generateBlog(): void {


this.errorMessage = '';

this.successMessage = '';

this.showMessage = false;


// ===================================================
// VALIDATION
// ===================================================

if (
  !this.blog.language ||
  !this.blog.category ||
  !this.blog.tone ||
  !this.blog.topic ||
  !this.blog.audience ||
  !this.blog.wordCount
) {

  this.errorMessage =
    'Please fill in all the required fields.';

  this.showMessage = true;

  return;
}


// ===================================================
// SELECT CATEGORY
// ===================================================

const selectedCategory =
  this.categories.find(
    category =>
      category.name === this.blog.category
  );


if (!selectedCategory) {

  this.errorMessage =
    'Please select a valid category.';

  this.showMessage = true;

  return;
}


// ===================================================
// CONVERT FORM VALUES TO ENUM VALUES
// ===================================================

const languageValue =
  this.getLanguageEnumValue(
    this.blog.language
  );


const toneValue =
  this.getToneEnumValue(
    this.blog.tone
  );


const audienceValue =
  this.getAudienceEnumValue(
    this.blog.audience
  );


const wordCountValue =
  this.getWordCountEnumValue(
    this.blog.wordCount
  );


// ===================================================
// CREATE REQUEST DTO
// ===================================================

const requestBody: GenerateBlogRequestDto = {

  categoryId:
    selectedCategory.categoryId,

  topic:
    this.blog.topic,

  audience:
    audienceValue,

  tone:
    toneValue,

  wordCount:
    wordCountValue,

  language:
    languageValue

};


// ===================================================
// CHECK REQUEST
// ===================================================

console.log(
  'GENERATE BLOG REQUEST:',
  requestBody
);


// ===================================================
// GENERATE BLOG
// ===================================================

this.isGenerating = true;


this.blogService
  .generateBlog(requestBody)
  .subscribe({

    // ===============================================
    // SUCCESS
    // ===============================================

    next: (
      response: GenerateBlogResponseDto
    ) => {

      console.log(
        'GENERATE BLOG RESPONSE:',
        response
      );


      this.isGenerating = false;


      this.successMessage =
        'Blog generated successfully!';


      this.showMessage = true;


      // Store generated blog
      this.blogService
        .setGeneratedBlog(response);


      // Navigate to generated blog page
      this.router.navigate([
        '/createdblog'
      ]);

    },


    // ===============================================
    // ERROR
    // ===============================================

    error: (
      error: HttpErrorResponse
    ) => {

      console.error(
        'GENERATE BLOG ERROR:',
        error
      );


      console.error(
        'STATUS:',
        error.status
      );


      console.error(
        'BACKEND RESPONSE:',
        error.error
      );


      console.error(
        'VALIDATION ERRORS:',
        error.error?.errors
      );


      this.isGenerating = false;


      if (error.status === 400) {

        this.errorMessage =
          'Invalid blog request. Please check your selected options.';

      }

      else if (error.status === 401) {

        this.errorMessage =
          'Your session has expired. Please log in again.';

      }

      else if (error.status === 402) {

        this.errorMessage =
          'You do not have enough credits to generate this blog.';

      }

      else if (error.status === 500) {

        this.errorMessage =
          error.error?.message ||
          'Server error while generating the blog.';

      }

      else {

        this.errorMessage =
          'Unable to generate the blog. Please try again.';

      }


      this.showMessage = true;

    }

  });


}

}
