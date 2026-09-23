import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  BlogService
} from '../services/blog';

import {
  GenerateBlogResponseDto
} from '../ServiceModels/v1/AIBlog/GenerateBlogResponseDto';

import {
  GenerateImageRequestDto
} from '../ServiceModels/v1/AIBlog/GenerateImageRequestDto';

import {
  GenerateImageResponseDto
} from '../ServiceModels/v1/AIBlog/GenerateImageResponseDto';

import {
  GenerateTagsResponseDto
} from '../ServiceModels/v1/AIBlog/GenerateTagsResponseDto';

import {
  RewriteBlogRequestDto
} from '../ServiceModels/v1/AIBlog/RewriteBlogRequestDto';

import {
  BlogDetailsDto
} from '../ServiceModels/v1/Blog/BlogDetailsDto';

import {
  VersionType
} from '../Enums_TypeScript/VersionType';


@Component({
  selector: 'app-createdblog',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './createdblog.html',

  styleUrl: './createdblog.css'
})
export class CreatedblogComponent
  implements OnInit {


  // ============================================================
  // BLOG
  // ============================================================

  blog = {

    blogId: 0,

    title: 'Generated Blog',

    content: '',

    wordCount: 0,

    category: '',

    language: '',

    excerpt: ''
  };


  // ============================================================
  // CONTENT PARAGRAPHS
  // ============================================================

  contentParagraphs:
    string[] = [];


  // ============================================================
  // PAGE MODE
  // ============================================================

  isExistingBlogView =
    false;

  isEditMode =
    false;


  // ============================================================
  // VERSION
  // ============================================================

  currentVersion:
    VersionType =
      VersionType.Original;

  currentVersionLabel =
    'Original';


  // ============================================================
  // IMAGE
  // ============================================================

  imageUrl:
    string | null = null;

  isGeneratingImage =
    false;


  // ============================================================
  // TAGS
  // ============================================================

  tagsList:
    string[] = [];

  isGeneratingTags =
    false;


  // ============================================================
  // REWRITE STATES
  // ============================================================

  isRegenerating =
    false;

  isShortening =
    false;

  isExpanding =
    false;


  // ============================================================
  // DELETE
  // ============================================================

  isDeleting =
    false;


  // ============================================================
  // BLOG STATUS
  // ============================================================

  isDraft =
    true;

  isPublished =
    false;


  // ============================================================
  // LOADING
  // ============================================================

  isLoading =
    false;


  // ============================================================
  // MESSAGE
  // ============================================================

  actionMessage =
    '';


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  // ============================================================
  // INIT
  // ============================================================

ngOnInit(): void {

  const routeBlogId =
    Number(
      this.route.snapshot.paramMap.get(
        'blogId'
      )
    );


  if (
    !routeBlogId ||
    routeBlogId <= 0
  ) {

    this.showMessage(
      'No blog was found.'
    );

    return;
  }


  // ============================================================
  // PAGE MODE
  // ============================================================

  const mode =
    this.route.snapshot.queryParamMap.get(
      'mode'
    );

  const status =
    this.route.snapshot.queryParamMap.get(
      'status'
    );


  this.isExistingBlogView =
    mode === 'view' ||
    mode === 'edit';

  this.isEditMode =
    mode === 'edit';


  // ============================================================
  // STATUS
  // ============================================================

  if (
    status === 'published'
  ) {

    this.isPublished =
      true;

    this.isDraft =
      false;

  }

  else {

    this.isPublished =
      false;

    this.isDraft =
      true;

  }


  // ============================================================
  // IMAGE
  // ============================================================

  this.imageUrl =
    this.blogService.getBlogImage(
      routeBlogId
    );


  // ============================================================
  // READ BLOG PASSED FROM USER BLOGS
  // ============================================================

  const navigationState:
    any =
      history.state;


  const passedBlog:
    any =
      navigationState?.blog;


  console.log(
    'BLOG PASSED FROM USER BLOGS:',
    passedBlog
  );


  /*
   * THIS IS THE IMPORTANT FIX.
   *
   * BlogResponseDto contains the actual content.
   * We display it immediately.
   */

  if (
    passedBlog &&
    passedBlog.blogId === routeBlogId
  ) {

    this.blog = {

      blogId:
        passedBlog.blogId,

      title:
        passedBlog.title ??
        'Generated Blog',

      content:
        passedBlog.content ??
        '',

      wordCount:
        passedBlog.wordCount ??
        0,

      category:
        this.blog.category ??
        '',

      language:
        this.blog.language ??
        '',

      excerpt:
        passedBlog.excerpt ??
        ''

    };


    this.updateContentParagraphs();


    console.log(
      'BLOG DISPLAYED IMMEDIATELY FROM ROUTER STATE:',
      this.blog
    );

  }


  // ============================================================
  // GENERATED BLOG CACHE
  // ============================================================

  const generatedBlog =
    this.blogService.getGeneratedBlog();


  if (
    !this.blog.content &&
    generatedBlog &&
    generatedBlog.blogId === routeBlogId
  ) {

    this.loadGeneratedBlog(
      generatedBlog
    );

  }


  // ============================================================
  // BACKEND REFRESH
  // ============================================================

  this.loadBlogDetails(
    routeBlogId
  );

}

  // ============================================================
  // LOAD GENERATED BLOG
  // ============================================================

  private loadGeneratedBlog(
    response:
      GenerateBlogResponseDto
  ): void {

    this.blog = {

      blogId:
        response.blogId,

      title:
        response.title ||
        'Generated Blog',

      content:
        response.content ||
        '',

      wordCount:
        this.calculateWordCount(
          response.content
        ),

      category:
        this.blog.category,

      language:
        this.blog.language,

      excerpt:
        response.excerpt ??
        ''
    };


    this.updateContentParagraphs();


    this.setVersion(
      VersionType.Original
    );


    /*
     * Only new generated blogs use
     * the normal Draft → Publish flow.
     */

    if (
      !this.isExistingBlogView
    ) {

      this.isDraft =
        true;

      this.isPublished =
        false;

    }


    console.log(
      'GENERATED BLOG DISPLAYED:',
      this.blog
    );

  }


  // ============================================================
  // LOAD COMPLETE BLOG DETAILS
  // ============================================================

private loadBlogDetails(
  blogId: number
): void {

  this.isLoading =
    true;


  this.blogService
    .getBlogDetails(
      blogId
    )
    .subscribe({

      next: (
        response: BlogDetailsDto
      ) => {

        console.log(
          'BLOG DETAILS RESPONSE:',
          response
        );


        /*
         * Keep the content we already have.
         *
         * Only replace it if the backend actually
         * returned non-empty content.
         */

        const currentContent =
          this.blog.content;


        const backendContent =
          response?.content ??
          '';


        const finalContent =
          backendContent.trim().length > 0
            ? backendContent
            : currentContent;


        this.blog = {

          blogId:
            response?.blogId ||
            blogId,

          title:
            response?.title ||
            this.blog.title ||
            'Generated Blog',

          content:
            finalContent,

          wordCount:
            response?.wordCount > 0
              ? response.wordCount
              : this.calculateWordCount(
                  finalContent
                ),

          category:
            response?.category ||
            this.blog.category ||
            '',

          language:
            this.blog.language ||
            '',

          excerpt:
            this.blog.excerpt ||
            ''

        };


        /*
         * Update content immediately after
         * the backend response.
         */

        this.updateContentParagraphs();


        this.isLoading =
          false;


        console.log(
          'FINAL CONTENT:',
          this.blog.content
        );

      },


      error: (
        error: any
      ) => {

        console.error(
          'BLOG DETAILS ERROR:',
          error
        );


        this.isLoading =
          false;


        /*
         * IMPORTANT:
         *
         * If the router already gave us the content,
         * don't erase it just because the second request
         * failed.
         */

        if (
          this.blog.content &&
          this.blog.content.trim()
        ) {

          return;

        }


        this.showMessage(
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load blog details.'
        );

      }

    });

}

  // ============================================================
  // UPDATE CONTENT PARAGRAPHS
  // ============================================================

  private updateContentParagraphs(): void {

    if (
      !this.blog.content ||
      !this.blog.content.trim()
    ) {

      this.contentParagraphs =
        [];

      return;

    }


    this.contentParagraphs =
      this.blog.content
        .split(
          /\n\s*\n/
        )
        .map(
          paragraph =>
            paragraph.trim()
        )
        .filter(
          paragraph =>
            paragraph.length > 0
        );

  }


  // ============================================================
  // WORD COUNT
  // ============================================================

  private calculateWordCount(
    content: string
  ): number {

    if (
      !content ||
      !content.trim()
    ) {

      return 0;

    }


    return content
      .trim()
      .split(/\s+/)
      .filter(
        word =>
          word.length > 0
      )
      .length;

  }


  // ============================================================
  // AI IMAGE
  // ============================================================

  aiImage(): void {

    if (
      this.isGeneratingImage
    ) {

      return;

    }


    if (
      !this.blog.blogId
    ) {

      this.showMessage(
        'Blog ID is missing. Cannot generate image.'
      );

      return;

    }


    this.isGeneratingImage =
      true;


    const request:
      GenerateImageRequestDto = {

      prompt:
        this.blog.title

    };


    this.blogService
      .generateImage(
        this.blog.blogId,
        request
      )
      .subscribe({

    next: (
  response: GenerateImageResponseDto
) => {

  console.log(
    'GENERATE IMAGE RESPONSE:',
    response
  );


  this.isGeneratingImage =
    false;


  this.imageUrl =
    response.imageUrl ??
    null;


  if (!this.imageUrl) {

    this.showMessage(
      'The image API did not return an image URL.'
    );

    return;

  }


  this.blogService
    .saveBlogImage(
      this.blog.blogId,
      this.imageUrl
    );


  this.showMessage(
    'AI image generated successfully.'
  );

},

        error: (
          error: any
        ) => {

          console.error(
            'GENERATE IMAGE ERROR:',
            error
          );


          this.isGeneratingImage =
            false;


          this.handleApiError(
            error,
            'Unable to generate image.'
          );

        }

      });

  }


  // ============================================================
  // GENERATE TAGS
  // ============================================================

  tags(): void {

    if (
      this.isGeneratingTags
    ) {

      return;

    }


    if (
      !this.blog.blogId
    ) {

      this.showMessage(
        'Blog ID is missing. Cannot generate tags.'
      );

      return;

    }


    this.isGeneratingTags =
      true;


    this.blogService
      .generateTags(
        this.blog.blogId
      )
      .subscribe({

        next: (
          response:
            GenerateTagsResponseDto
        ) => {

          console.log(
            'GENERATE TAGS RESPONSE:',
            response
          );


          this.isGeneratingTags =
            false;


          this.tagsList =
            response.tags ??
            [];


          this.showMessage(
            'SEO tags generated successfully.'
          );

        },


        error: (
          error: any
        ) => {

          console.error(
            'GENERATE TAGS ERROR:',
            error
          );


          this.isGeneratingTags =
            false;


          this.handleApiError(
            error,
            'Unable to generate tags.'
          );

        }

      });

  }


  // ============================================================
  // SHORTEN
  // ============================================================

  shortenBlog(): void {

    if (
      !this.blog.blogId
    ) {

      this.showMessage(
        'Blog ID is missing.'
      );

      return;

    }


    const promptText =
      window.prompt(
        'Enter instructions for shortening the blog:',
        'Make the blog shorter and more concise.'
      );


    if (
      !promptText
    ) {

      return;

    }


    const request:
      RewriteBlogRequestDto = {

      instructions:
        promptText

    };


    this.isShortening =
      true;


    this.blogService
      .shortenBlog(
        this.blog.blogId,
        request
      )
      .subscribe({

        next: (
          response:
            GenerateBlogResponseDto
        ) => {

          this.isShortening =
            false;


          this.updateBlogAfterRewrite(
            response,
            VersionType.Shortened
          );

        },


        error: (
          error: any
        ) => {

          this.isShortening =
            false;


          this.handleApiError(
            error,
            'Unable to shorten the blog.'
          );

        }

      });

  }


  // ============================================================
  // EXPAND
  // ============================================================

  expandBlog(): void {

    if (
      !this.blog.blogId
    ) {

      this.showMessage(
        'Blog ID is missing.'
      );

      return;

    }


    const promptText =
      window.prompt(
        'Enter instructions for expanding the blog:',
        'Expand the blog with more useful details.'
      );


    if (
      !promptText
    ) {

      return;

    }


    const request:
      RewriteBlogRequestDto = {

      instructions:
        promptText

    };


    this.isExpanding =
      true;


    this.blogService
      .expandBlog(
        this.blog.blogId,
        request
      )
      .subscribe({

        next: (
          response:
            GenerateBlogResponseDto
        ) => {

          this.isExpanding =
            false;


          this.updateBlogAfterRewrite(
            response,
            VersionType.Expanded
          );

        },


        error: (
          error: any
        ) => {

          this.isExpanding =
            false;


          this.handleApiError(
            error,
            'Unable to expand the blog.'
          );

        }

      });

  }


  // ============================================================
  // REGENERATE
  // ============================================================

  regenerateBlog(): void {

    if (
      !this.blog.blogId
    ) {

      this.showMessage(
        'Blog ID is missing.'
      );

      return;

    }


    const promptText =
      window.prompt(
        'Enter instructions for regenerating the blog:',
        'Regenerate the blog with improved content.'
      );


    if (
      !promptText
    ) {

      return;

    }


    const request:
      RewriteBlogRequestDto = {

      instructions:
        promptText

    };


    this.isRegenerating =
      true;


    this.blogService
      .regenerateBlog(
        this.blog.blogId,
        request
      )
      .subscribe({

        next: (
          response:
            GenerateBlogResponseDto
        ) => {

          this.isRegenerating =
            false;


          this.updateBlogAfterRewrite(
            response,
            VersionType.Regenerated
          );

        },


        error: (
          error: any
        ) => {

          this.isRegenerating =
            false;


          this.handleApiError(
            error,
            'Unable to regenerate the blog.'
          );

        }

      });

  }


  // ============================================================
  // UPDATE BLOG AFTER AI OPERATION
  // ============================================================

  private updateBlogAfterRewrite(
    response:
      GenerateBlogResponseDto,
    version:
      VersionType
  ): void {

    if (
      !response ||
      !response.blogId
    ) {

      this.showMessage(
        'The server did not return a valid blog.'
      );

      return;

    }


    if (
      response.content &&
      response.content.trim()
    ) {

      this.blog = {

        blogId:
          response.blogId,

        title:
          response.title ||
          this.blog.title,

        content:
          response.content,

        wordCount:
          this.calculateWordCount(
            response.content
          ),

        category:
          this.blog.category,

        language:
          this.blog.language,

        excerpt:
          response.excerpt ??
          this.blog.excerpt

      };


      this.updateContentParagraphs();

    }


    this.setVersion(
      version
    );


    this.blogService
      .setGeneratedBlog(
        response
      );


    this.showMessage(
      'Blog updated successfully.'
    );


    if (
      !response.content ||
      !response.content.trim()
    ) {

      this.loadBlogDetails(
        response.blogId
      );

    }

  }


  // ============================================================
  // VERSION
  // ============================================================

  setVersion(
    version:
      VersionType
  ): void {

    this.currentVersion =
      version;


    switch (
      version
    ) {

      case VersionType.Original:
        this.currentVersionLabel =
          'Original';
        break;

      case VersionType.Edited:
        this.currentVersionLabel =
          'Edited';
        break;

      case VersionType.Rewritten:
        this.currentVersionLabel =
          'Rewritten';
        break;

      case VersionType.Regenerated:
        this.currentVersionLabel =
          'Regenerated';
        break;

      case VersionType.Expanded:
        this.currentVersionLabel =
          'Expanded';
        break;

      case VersionType.Shortened:
        this.currentVersionLabel =
          'Shortened';
        break;

      case VersionType.Translated:
        this.currentVersionLabel =
          'Translated';
        break;

      case VersionType.SEOOptimized:
        this.currentVersionLabel =
          'SEO Optimized';
        break;

      case VersionType.Summary:
        this.currentVersionLabel =
          'Summary';
        break;

      default:
        this.currentVersionLabel =
          'Original';
        break;

    }

  }


  // ============================================================
  // EDIT BLOG
  // ============================================================

  editBlog(): void {

    this.isExistingBlogView =
      true;

    this.isEditMode =
      true;

  }


  // ============================================================
  // DONE EDITING
  // ============================================================

  doneEditing(): void {

    this.isEditMode =
      false;

  }


  // ============================================================
  // DELETE BLOG
  // ============================================================

  deleteBlog(): void {

    if (
      !this.blog.blogId
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        'Are you sure you want to delete this blog?'
      );


    if (
      !confirmed
    ) {

      return;

    }


    this.isDeleting =
      true;


    this.blogService
      .deleteBlog(
        this.blog.blogId
      )
      .subscribe({

        next: (
          response: any
        ) => {

          console.log(
            'DELETE BLOG RESPONSE:',
            response
          );


          this.isDeleting =
            false;


          this.blogService
            .clearBlogImage(
              this.blog.blogId
            );


          this.blogService
            .clearGeneratedBlog();


          this.showMessage(
            'Blog deleted successfully.'
          );


          this.router.navigate([
            '/userblogs'
          ]);

        },


        error: (
          error: any
        ) => {

          console.error(
            'DELETE BLOG ERROR:',
            error
          );


          this.isDeleting =
            false;


          this.handleApiError(
            error,
            'Unable to delete the blog.'
          );

        }

      });

  }


  // ============================================================
  // SAVE DRAFT
  // ============================================================

  saveDraft(): void {

    this.isDraft =
      true;

    this.isPublished =
      false;


    this.showMessage(
      'Blog saved as draft successfully.'
    );

  }


  // ============================================================
  // PUBLISH
  // ============================================================

  publishBlog(): void {

    if (
      this.isPublished
    ) {

      return;

    }


    if (
      !this.blog.blogId
    ) {

      this.showMessage(
        'Blog ID is missing. Cannot publish blog.'
      );

      return;

    }


    const confirmed =
      window.confirm(
        'Are you sure you want to publish this blog?'
      );


    if (
      !confirmed
    ) {

      return;

    }


    this.blogService
      .publishBlog(
        this.blog.blogId
      )
      .subscribe({

       next: (
  response: any
) => {

  console.log(
    'PUBLISH RESPONSE:',
    response
  );


  /*
   * Update the current page.
   */

  this.isDraft =
    false;

  this.isPublished =
    true;


  /*
   * Remember this blog as Published locally.
   * User Blogs will use this when the page opens.
   */

  this.blogService
    .markBlogPublished(
      this.blog.blogId
    );


  /*
   * Keep image available as well.
   */

  if (
    this.imageUrl
  ) {

    this.blogService
      .saveBlogImage(
        this.blog.blogId,
        this.imageUrl
      );

  }


  this.showMessage(
    'Blog published successfully.'
  );

},

        error: (
          error: any
        ) => {

          console.error(
            'PUBLISH ERROR:',
            error
          );


          this.handleApiError(
            error,
            'Unable to publish the blog.'
          );

        }

      });

  }


  // ============================================================
  // MESSAGE
  // ============================================================

  private showMessage(
    message:
      string
  ): void {

    this.actionMessage =
      message;


    setTimeout(() => {

      this.actionMessage =
        '';

    }, 3000);

  }


  // ============================================================
  // ERROR
  // ============================================================

  private handleApiError(
    error:
      any,
    defaultMessage:
      string
  ): void {

    console.error(
      'API ERROR:',
      error
    );


    if (
      error?.status === 401
    ) {

      this.showMessage(
        'Your session is no longer valid. Please login again.'
      );

      return;

    }


    this.showMessage(
      error?.error?.message ??
      error?.error?.Message ??
      defaultMessage
    );

  }

}