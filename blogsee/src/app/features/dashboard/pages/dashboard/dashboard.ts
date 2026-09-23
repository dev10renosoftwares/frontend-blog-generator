import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';

import { Router, RouterLink } from '@angular/router';

import { CategoryResponseDto } from '../../../../ServiceModels/v1/Category/CategoryResponseDto';
import { FeedBlogDto } from '../../../../ServiceModels/v1/PublicFeed/FeedBlogDto';

import { BlogService } from '../../../../services/blog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  // ==========================================================
  // PUBLIC BLOGS
  // ==========================================================

  blogs: FeedBlogDto[] = [];

  blogError = '';


  // ==========================================================
  // CATEGORIES
  // ==========================================================

  categories: CategoryResponseDto[] = [];

  categoryError = '';

  selectedCategoryId: number | null = null;


  // ==========================================================
  // SEARCH
  // ==========================================================

  searchText = '';


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private router: Router,
    private blogService: BlogService
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    // All category is selected by default
    this.selectedCategoryId = null;

    // Load categories immediately
    this.loadCategories();

    // Load public feed immediately
    this.loadPublicFeed();
  }


  // ==========================================================
  // LOAD PUBLIC FEED
  // ==========================================================

  loadPublicFeed(): void {

    this.blogError = '';

    this.blogService
      .getPublicFeed()
      .subscribe({

        next: (response: any) => {

          console.log(
            'DASHBOARD PUBLIC FEED:',
            response
          );

          /*
           * API may return:
           *
           * [
           *   {...},
           *   {...}
           * ]
           *
           * OR:
           *
           * {
           *   data: [
           *     {...},
           *     {...}
           *   ]
           * }
           */

          if (Array.isArray(response)) {

            this.blogs =
              response as FeedBlogDto[];

          } else if (
            response &&
            Array.isArray(response.data)
          ) {

            this.blogs =
              response.data as FeedBlogDto[];

          } else {

            this.blogs = [];

            console.warn(
              'Unexpected public feed response:',
              response
            );
          }

          console.log(
            'DASHBOARD BLOGS:',
            this.blogs
          );

        },

        error: (error: any) => {

          console.error(
            'DASHBOARD PUBLIC FEED ERROR:',
            error
          );

          this.blogs = [];

          this.blogError =
            'Unable to load published blogs.';
        }

      });
  }


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  loadCategories(): void {

    this.categoryError = '';

    this.blogService
      .getCategories()
      .subscribe({

        next: (response: any) => {

          console.log(
            'DASHBOARD CATEGORIES:',
            response
          );

          /*
           * API may return:
           *
           * [
           *   {...},
           *   {...}
           * ]
           *
           * OR:
           *
           * {
           *   data: [
           *     {...},
           *     {...}
           *   ]
           * }
           */

          if (Array.isArray(response)) {

            this.categories =
              response as CategoryResponseDto[];

          } else if (
            response &&
            Array.isArray(response.data)
          ) {

            this.categories =
              response.data as CategoryResponseDto[];

          } else {

            this.categories = [];

            console.warn(
              'Unexpected categories response:',
              response
            );
          }

          console.log(
            'DASHBOARD CATEGORIES:',
            this.categories
          );

        },

        error: (error: any) => {

          console.error(
            'DASHBOARD CATEGORIES ERROR:',
            error
          );

          this.categories = [];

          this.categoryError =
            'Unable to load categories.';
        }

      });
  }


  // ==========================================================
  // FILTER BY CATEGORY
  // ==========================================================

  selectCategory(
    categoryId: number | null
  ): void {

    /*
     * IMPORTANT:
     *
     * Do NOT modify this.blogs here.
     *
     * this.blogs contains the complete public feed.
     *
     * The filteredBlogs getter handles the actual
     * category filtering.
     */

    this.selectedCategoryId =
      categoryId;

    console.log(
      'SELECTED CATEGORY:',
      this.selectedCategoryId
    );
  }


  // ==========================================================
  // FILTERED BLOGS
  // ==========================================================

  get filteredBlogs(): FeedBlogDto[] {

    let result =
      [...this.blogs];


    // --------------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------------

    if (
      this.selectedCategoryId !== null
    ) {

      result =
        result.filter(
          (blog: FeedBlogDto) => {

            return (
              Number(blog.categoryId) ===
              Number(this.selectedCategoryId)
            );

          }
        );

    }


    // --------------------------------------------------------
    // SEARCH FILTER
    // --------------------------------------------------------

    if (
      this.searchText.trim() !== ''
    ) {

      const search =
        this.searchText
          .trim()
          .toLowerCase();

      result =
        result.filter(
          (blog: FeedBlogDto) => {

            const title =
              blog.title || '';

            const excerpt =
              blog.excerpt || '';

            const author =
              blog.authorName || '';

            const category =
              blog.categoryName || '';

            return (

              title
                .toLowerCase()
                .includes(search) ||

              excerpt
                .toLowerCase()
                .includes(search) ||

              author
                .toLowerCase()
                .includes(search) ||

              category
                .toLowerCase()
                .includes(search)

            );

          }
        );

    }


    return result;
  }


  // ==========================================================
  // TRENDING BLOGS
  // ==========================================================

  get trendingBlogs(): FeedBlogDto[] {

    const sortedBlogs =
      [...this.blogs];

    sortedBlogs.sort(
      (
        first: FeedBlogDto,
        second: FeedBlogDto
      ) => {

        const firstTime =
          first.publishedAt
            ? new Date(
                first.publishedAt
              ).getTime()
            : 0;

        const secondTime =
          second.publishedAt
            ? new Date(
                second.publishedAt
              ).getTime()
            : 0;

        return secondTime - firstTime;

      }
    );

    return sortedBlogs.slice(
      0,
      5
    );
  }


  // ==========================================================
  // OPEN BLOG
  // ==========================================================

  readBlog(
    blogId: number
  ): void {

    if (
      !blogId ||
      blogId <= 0
    ) {

      return;
    }

    this.router.navigate([
      '/blog-details',
      blogId
    ]);
  }


  // ==========================================================
  // AUTHOR INITIAL
  // ==========================================================

  getAuthorInitial(
    authorName: string | null | undefined
  ): string {

    if (
      !authorName ||
      authorName.trim() === ''
    ) {

      return 'U';
    }

    return authorName
      .trim()
      .charAt(0)
      .toUpperCase();
  }


  // ==========================================================
  // READ TIME
  // ==========================================================

  getReadTime(
    wordCount: number
  ): number {

    if (
      !wordCount ||
      wordCount <= 0
    ) {

      return 1;
    }

    return Math.max(
      1,
      Math.ceil(
        wordCount / 200
      )
    );
  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(
    date: string | null | undefined
  ): string {

    if (!date) {

      return '';
    }

    const parsedDate =
      new Date(date);

    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return '';
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );
  }


  // ==========================================================
  // SEARCH
  // ==========================================================

  onSearch(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.searchText =
      input.value;
  }

}