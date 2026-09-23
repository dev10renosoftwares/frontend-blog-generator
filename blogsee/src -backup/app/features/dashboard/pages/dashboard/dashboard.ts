import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Navbar } from '../../../../shared/components/navbar/navbar';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { Router, RouterLink } from '@angular/router';
import{CategoryResponseDto} from '../../../../ServiceModels/v1/Category/CategoryResponseDto';
import{FeedBlogDto} from '../../../../ServiceModels/v1/PublicFeed/FeedBlogDto';
import { BlogService } from '../../../../services/blog';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    Navbar,
    SidebarComponent,
    RouterLink
  ],

  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  // =====================================================
  // BLOGS
  // =====================================================

  blogs: FeedBlogDto[] = [];

  loadingBlogs = false;
  blogError = '';


  // =====================================================
  // CATEGORIES
  // =====================================================

  categories: CategoryResponseDto[] = [];

  loadingCategories = false;
  categoryError = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private router: Router,
    private blogService: BlogService
  ) {}


  // =====================================================
  // ON INIT
  // =====================================================

  ngOnInit(): void {

    // Load public blogs
    this.loadPublicFeed();

    // Load categories
    this.loadCategories();

  }


  // =====================================================
  // LOAD PUBLIC BLOG FEED
  // =====================================================

  loadPublicFeed(): void {

    this.loadingBlogs = true;
    this.blogError = '';

    this.blogService.getPublicFeed().subscribe({

      next: (response: FeedBlogDto[]) => {

        console.log('Public Feed Response:', response);

        this.blogs = response;

        this.loadingBlogs = false;

      },

      error: (error: any) => {

        console.error('Public Feed Error:', error);

        this.blogError = 'Unable to load public blogs.';

        this.loadingBlogs = false;

      }

    });

  }


  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  loadCategories(): void {

    this.loadingCategories = true;
    this.categoryError = '';

    this.blogService.getCategories().subscribe({

      next: (response: CategoryResponseDto[]) => {

        console.log('Categories Response:', response);

        this.categories = response;

        this.loadingCategories = false;

      },

      error: (error: any) => {

        console.error('Categories Error:', error);

        this.categoryError = 'Unable to load categories.';

        this.loadingCategories = false;

      }

    });

  }


  // =====================================================
  // READ BLOG
  // =====================================================

  readBlog(): void {

    this.router.navigate(['/blog']);

  }

}