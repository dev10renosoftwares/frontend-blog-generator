import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  forkJoin,
  of
} from 'rxjs';

import {
  catchError
} from 'rxjs/operators';

import {
  BlogService
} from '../services/blog';

import {
  BlogListDto
} from '../ServiceModels/v1/Blog/BlogListDto';

import {
  BlogResponseDto
} from '../ServiceModels/v1/Blog/BlogResponseDto';


@Component({
  selector: 'app-user-blogs',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './userblogs.html',

  styleUrl: './userblogs.css'
})
export class UserBlogs
  implements OnInit {


  // ============================================================
  // ALL BLOGS
  // ============================================================

  blogs:
    BlogListDto[] = [];


  // ============================================================
  // DRAFT BLOGS
  // ============================================================

  draftBlogs:
    BlogResponseDto[] = [];


  // ============================================================
  // PUBLISHED BLOGS
  // ============================================================

  publishedBlogs:
    BlogResponseDto[] = [];


  // ============================================================
  // STATUS MAP
  // ============================================================

  private statusMap:
    Map<number, 'draft' | 'published'> =
      new Map();


  // ============================================================
  // FILTER
  // ============================================================

  selectedFilter:
    'all' |
    'draft' |
    'published' =
      'all';


  // ============================================================
  // ERROR
  // ============================================================

  errorMessage =
    '';


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private blogService:
      BlogService,

    private router:
      Router
  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.loadUserBlogs();

  }

 goback(): void {

    this.router.navigate([
      '/'
    ]);

  }
  // ============================================================
  // LOAD BLOGS
  // ============================================================

  loadUserBlogs(): void {

    this.errorMessage =
      '';


    this.blogs =
      [];

    this.draftBlogs =
      [];

    this.publishedBlogs =
      [];

    this.statusMap.clear();


    forkJoin({

      all:
        this.blogService
          .getUserBlogs()
          .pipe(
            catchError(
              error => {

                console.error(
                  'ALL BLOGS ERROR:',
                  error
                );

                return of(
                  [] as BlogListDto[]
                );

              }
            )
          ),

      drafts:
        this.blogService
          .getDraftBlogs()
          .pipe(
            catchError(
              error => {

                console.error(
                  'DRAFT BLOGS ERROR:',
                  error
                );

                return of(
                  [] as BlogResponseDto[]
                );

              }
            )
          ),

      published:
        this.blogService
          .getPublishedBlogs()
          .pipe(
            catchError(
              error => {

                console.error(
                  'PUBLISHED BLOGS ERROR:',
                  error
                );

                return of(
                  [] as BlogResponseDto[]
                );

              }
            )
          )

    })
    .subscribe({

      next: ({
        all,
        drafts,
        published
      }) => {

        console.log(
          'ALL API:',
          all
        );

        console.log(
          'DRAFT API:',
          drafts
        );

        console.log(
          'PUBLISHED API:',
          published
        );


        this.draftBlogs =
          drafts ?? [];


        this.publishedBlogs =
          published ?? [];


        // ======================================================
        // STATUS - PUBLISHED
        // ======================================================

        for (
          const blog
          of this.publishedBlogs
        ) {

          if (
            blog?.blogId
          ) {

            this.statusMap.set(
              blog.blogId,
              'published'
            );

          }

        }


        // ======================================================
        // STATUS - DRAFT
        // ======================================================

        for (
          const blog
          of this.draftBlogs
        ) {

          if (
            blog?.blogId &&
            !this.statusMap.has(
              blog.blogId
            )
          ) {

            this.statusMap.set(
              blog.blogId,
              'draft'
            );

          }

        }


        // ======================================================
        // LOCAL PUBLISHED STATUS
        // ======================================================

        const localPublishedIds =
          this.blogService
            .getLocallyPublishedBlogIds();


        for (
          const blogId
          of localPublishedIds
        ) {

          this.statusMap.set(
            blogId,
            'published'
          );

        }


        // ======================================================
        // CREATE ALL BLOGS
        // ======================================================

        const uniqueBlogs:
          Map<number, BlogListDto> =
            new Map();


        // ------------------------------------------------------
        // FROM /Blogs
        // ------------------------------------------------------

        for (
          const blog
          of all ?? []
        ) {

          if (
            blog?.blogId
          ) {

            uniqueBlogs.set(
              blog.blogId,
              blog
            );

          }

        }


        // ------------------------------------------------------
        // FROM DRAFTS
        // ------------------------------------------------------

        for (
          const blog
          of this.draftBlogs
        ) {

          if (
            !blog?.blogId
          ) {

            continue;

          }


          if (
            !uniqueBlogs.has(
              blog.blogId
            )
          ) {

            uniqueBlogs.set(
              blog.blogId,
              {

                blogId:
                  blog.blogId,

                title:
                  blog.title,

                category:
                  '',

                wordCount:
                  blog.wordCount,

                createdAt:
                  blog.createdAt,

                updatedAt:
                  blog.updatedAt ?? ''

              }

            );

          }

        }


        // ------------------------------------------------------
        // FROM PUBLISHED
        // ------------------------------------------------------

        for (
          const blog
          of this.publishedBlogs
        ) {

          if (
            !blog?.blogId
          ) {

            continue;

          }


          if (
            !uniqueBlogs.has(
              blog.blogId
            )
          ) {

            uniqueBlogs.set(
              blog.blogId,
              {

                blogId:
                  blog.blogId,

                title:
                  blog.title,

                category:
                  '',

                wordCount:
                  blog.wordCount,

                createdAt:
                  blog.createdAt,

                updatedAt:
                  blog.updatedAt ?? ''

              }

            );

          }

        }


        // ------------------------------------------------------
        // FINAL ALL ARRAY
        // ------------------------------------------------------

        this.blogs =
          Array.from(
            uniqueBlogs.values()
          );


        /*
         * Remove locally published blogs from draft state.
         */

        for (
          const blog
          of this.blogs
        ) {

          if (
            this.statusMap.has(
              blog.blogId
            )
          ) {

            continue;

          }


          /*
           * If backend did not classify the blog,
           * treat it as draft.
           */

          this.statusMap.set(
            blog.blogId,
            'draft'
          );

        }


        console.log(
          'FINAL BLOGS:',
          this.blogs
        );

        console.log(
          'FINAL STATUS MAP:',
          this.statusMap
        );

      },

      error: (
        error: any
      ) => {

        console.error(
          'USER BLOGS ERROR:',
          error
        );


        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load your blogs.';

      }

    });

  }


  // ============================================================
  // FILTER
  // ============================================================

  selectFilter(
    filter:
      'all' |
      'draft' |
      'published'
  ): void {

    this.selectedFilter =
      filter;

  }


  // ============================================================
  // FILTERED BLOGS
  // ============================================================

  getFilteredBlogs():
    BlogListDto[] {

    if (
      this.selectedFilter ===
      'all'
    ) {

      return this.blogs;

    }


    return this.blogs.filter(
      blog => {

        const status =
          this.statusMap.get(
            blog.blogId
          );


        return (
          status ===
          this.selectedFilter
        );

      }
    );

  }


  // ============================================================
  // IS PUBLISHED
  // ============================================================

  isPublished(
    blogId:
      number
  ): boolean {

    return (
      this.statusMap.get(
        blogId
      ) === 'published'
    );

  }


  // ============================================================
  // STATUS LABEL
  // ============================================================

  getStatusLabel(
    blogId:
      number
  ): string {

    return this.isPublished(
      blogId
    )
      ? 'Published'
      : 'Draft';

  }


  // ============================================================
  // DRAFT COUNT
  // ============================================================

  getDraftCount():
    number {

    return this.blogs.filter(
      blog =>
        this.statusMap.get(
          blog.blogId
        ) === 'draft'
    ).length;

  }


  // ============================================================
  // PUBLISHED COUNT
  // ============================================================

  getPublishedCount():
    number {

    return this.blogs.filter(
      blog =>
        this.statusMap.get(
          blog.blogId
        ) === 'published'
    ).length;

  }


  // ============================================================
  // BLOG IMAGE
  // ============================================================

  getBlogImage(
    blogId:
      number
  ):
    string | null {

    return this.blogService
      .getBlogImage(
        blogId
      );

  }


  // ============================================================
  // OPEN BLOG
  // ============================================================

  openBlog(
    blogId:
      number
  ): void {

    if (
      !blogId
    ) {

      return;

    }


    const status =
      this.isPublished(
        blogId
      )
        ? 'published'
        : 'draft';


    /*
     * Get the full BlogResponseDto if available.
     */

    const fullBlog =
      this.publishedBlogs.find(
        blog =>
          blog.blogId ===
          blogId
      )
      ??
      this.draftBlogs.find(
        blog =>
          blog.blogId ===
          blogId
      )
      ??
      null;


    this.router.navigate(
      [
        '/createdblog',
        blogId
      ],
      {

        queryParams: {

          mode:
            'view',

          status:
            status

        },

        state: {

          blog:
            fullBlog

        }

      }
    );

  }

}