import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  GenerateBlogRequestDto
} from '../ServiceModels/v1/AIBlog/GenerateBlogRequestDto';

import {
  GenerateBlogResponseDto
} from '../ServiceModels/v1/AIBlog/GenerateBlogResponseDto';

import {
  CategoryResponseDto
} from '../ServiceModels/v1/Category/CategoryResponseDto';

import {
  BlogLanguage
} from '../Enums_TypeScript/BlogLanguage';

import {
  BlogTone
} from '../Enums_TypeScript/BlogTone';

import {
  BlogAudience
} from '../Enums_TypeScript/BlogAudience';

import {
  BlogWordCount
} from '../Enums_TypeScript/BlogWordCount';

import {
  BlogService
} from '../services/blog';


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
export class CreateBlogComponent
  implements OnInit {


  // ============================================================
  // DROPDOWN DATA
  // ============================================================

  languages: string[] = [
    'English',
    'Urdu',
    'Kashmiri',
    'Spanish',
    'Arabic',
    'Turkish'
  ];


  tones: string[] = [
    'Professional',
    'Formal',
    'Casual',
    'Friendly',
    'Persuasive',
    'Creative',
    'Humorous'
  ];


  audiences: string[] = [
    'Students',
    'Developers',
    'Business Owners',
    'Professionals',
    'Teachers',
    'Marketers',
    'Entrepreneurs',
    'General'
  ];


  wordCounts: number[] = [
    300,
    500,
    1000,
    1500,
    2000
  ];


  categories:
    CategoryResponseDto[] = [];


  // ============================================================
  // FORM
  // ============================================================

  blog = {

    language: '',

    category: '',

    tone: '',

    topic: '',

    audience: '',

    wordCount:
      null as number | null
  };


  // ============================================================
  // UI STATE
  // ============================================================

  isGenerating =
    false;

  showMessage =
    false;

  successMessage =
    '';

  errorMessage =
    '';


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.loadCategories();

  }


  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  loadCategories(): void {

    this.blogService
      .getCategories()
      .subscribe({

        next: (
          response: CategoryResponseDto[]
        ) => {

          console.log(
            'CATEGORIES:',
            response
          );

          this.categories =
            response ?? [];

        },

        error: (
          error: any
        ) => {

          console.error(
            'CATEGORY ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ??
            error?.error?.Message ??
            error?.error?.title ??
            error?.message ??
            'Unable to load categories.';

          this.showMessage =
            true;

        }

      });

  }


  // ============================================================
  // GO BACK
  // ============================================================

  goback(): void {

    this.router.navigate([
      '/'
    ]);

  }


  // ============================================================
  // CONVERT LANGUAGE
  // ============================================================

  private getLanguageValue():
    BlogLanguage | null {

    switch (
      this.blog.language
    ) {

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
        return null;
    }

  }


  // ============================================================
  // CONVERT TONE
  // ============================================================

  private getToneValue():
    BlogTone | null {

    switch (
      this.blog.tone
    ) {

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
        return null;
    }

  }


  // ============================================================
  // CONVERT AUDIENCE
  // ============================================================

  private getAudienceValue():
    BlogAudience | null {

    switch (
      this.blog.audience
    ) {

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
        return null;
    }

  }


  // ============================================================
  // CONVERT WORD COUNT
  // ============================================================

  private getWordCountValue():
    BlogWordCount | null {

    switch (
      this.blog.wordCount
    ) {

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
        return null;
    }

  }


  // ============================================================
  // GENERATE BLOG
  // ============================================================

  generateBlog(): void {

    console.log(
      '======================================'
    );

    console.log(
      'GENERATE BLOG BUTTON CLICKED'
    );

    console.log(
      'CURRENT FORM:',
      this.blog
    );

    console.log(
      'AVAILABLE CATEGORIES:',
      this.categories
    );

    console.log(
      '======================================'
    );


    // ----------------------------------------------------------
    // RESET MESSAGES
    // ----------------------------------------------------------

    this.showMessage =
      false;

    this.successMessage =
      '';

    this.errorMessage =
      '';


    // ----------------------------------------------------------
    // PREVENT DOUBLE REQUEST
    // ----------------------------------------------------------

    if (
      this.isGenerating
    ) {

      return;
    }


    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (
      !this.blog.language
    ) {

      this.errorMessage =
        'Please select a language.';

      this.showMessage =
        true;

      return;
    }


    if (
      !this.blog.category
    ) {

      this.errorMessage =
        'Please select a category.';

      this.showMessage =
        true;

      return;
    }


    if (
      !this.blog.tone
    ) {

      this.errorMessage =
        'Please select a tone.';

      this.showMessage =
        true;

      return;
    }


    if (
      !this.blog.topic.trim()
    ) {

      this.errorMessage =
        'Please enter a topic.';

      this.showMessage =
        true;

      return;
    }


    if (
      !this.blog.audience
    ) {

      this.errorMessage =
        'Please select an audience.';

      this.showMessage =
        true;

      return;
    }


    if (
      this.blog.wordCount === null
    ) {

      this.errorMessage =
        'Please select a word count.';

      this.showMessage =
        true;

      return;
    }


    // ----------------------------------------------------------
    // FIND CATEGORY
    // ----------------------------------------------------------

    const selectedCategory =
      this.categories.find(
        category =>
          category.name ===
          this.blog.category
      );


    if (
      !selectedCategory
    ) {

      this.errorMessage =
        'Selected category was not found.';

      this.showMessage =
        true;

      console.error(
        'SELECTED CATEGORY NOT FOUND:',
        this.blog.category
      );

      return;
    }


    // ----------------------------------------------------------
    // ENUM VALUES
    // ----------------------------------------------------------

    const languageValue =
      this.getLanguageValue();

    const toneValue =
      this.getToneValue();

    const audienceValue =
      this.getAudienceValue();

    const wordCountValue =
      this.getWordCountValue();


    if (
      languageValue === null ||
      toneValue === null ||
      audienceValue === null ||
      wordCountValue === null
    ) {

      this.errorMessage =
        'Invalid blog form values.';

      this.showMessage =
        true;

      return;
    }


    // ----------------------------------------------------------
    // BACKEND REQUEST DTO
    // ----------------------------------------------------------

    const requestBody:
      GenerateBlogRequestDto = {

      categoryId:
        selectedCategory.categoryId,

      topic:
        this.blog.topic.trim(),

      audience:
        audienceValue,

      tone:
        toneValue,

      wordCount:
        wordCountValue,

      language:
        languageValue
    };


    console.log(
      'GENERATE BLOG REQUEST BODY:',
      requestBody
    );


    // ----------------------------------------------------------
    // START REQUEST
    // ----------------------------------------------------------

    this.isGenerating =
      true;


    this.blogService
      .generateBlog(
        requestBody
      )
      .subscribe({

        next: (
          response:
            GenerateBlogResponseDto
        ) => {

          console.log(
            'GENERATED BLOG RESPONSE:',
            response
          );


          this.isGenerating =
            false;


          // ----------------------------------------------------
          // CHECK RESPONSE
          // ----------------------------------------------------

          if (
            !response
          ) {

            this.errorMessage =
              'The server returned an empty response.';

            this.showMessage =
              true;

            return;
          }


          if (
            !response.blogId ||
            response.blogId <= 0
          ) {

            console.error(
              'INVALID GENERATED BLOG RESPONSE:',
              response
            );

            this.errorMessage =
              'The blog was generated, but the server did not return a valid blog ID.';

            this.showMessage =
              true;

            return;
          }


          // ----------------------------------------------------
          // SAVE GENERATED BLOG
          // ----------------------------------------------------

          this.blogService
            .setGeneratedBlog(
              response
            );


          console.log(
            'GENERATED BLOG SAVED:',
            this.blogService.getGeneratedBlog()
          );


          // ----------------------------------------------------
          // NAVIGATE TO CREATED BLOG
          // ----------------------------------------------------

          this.router
            .navigate([
              '/createdblog',
              response.blogId
            ])
            .then(
              navigationResult => {

                console.log(
                  'CREATED BLOG NAVIGATION RESULT:',
                  navigationResult
                );

              }
            )
            .catch(
              navigationError => {

                console.error(
                  'CREATED BLOG NAVIGATION ERROR:',
                  navigationError
                );

                this.errorMessage =
                  'Blog was generated, but the created blog page could not be opened.';

                this.showMessage =
                  true;

              }
            );

        },


        error: (
          error: any
        ) => {

          console.error(
            '======================================'
          );

          console.error(
            'GENERATE BLOG ERROR:',
            error
          );

          console.error(
            'ERROR BODY:',
            error?.error
          );

          console.error(
            'ERROR MESSAGE:',
            error?.message
          );

          console.error(
            'HTTP STATUS:',
            error?.status
          );

          console.error(
            '======================================'
          );


          this.isGenerating =
            false;


          this.errorMessage =
            error?.error?.message ??
            error?.error?.Message ??
            error?.error?.title ??
            error?.message ??
            'Unable to generate the blog.';

          this.showMessage =
            true;

        }

      });

  }

}