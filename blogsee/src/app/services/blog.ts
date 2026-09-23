import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  map
} from 'rxjs';

import {
  environment
} from '../../environments/environment.development';

import {
  GenerateBlogRequestDto
} from '../ServiceModels/v1/AIBlog/GenerateBlogRequestDto';

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
  CategoryResponseDto
} from '../ServiceModels/v1/Category/CategoryResponseDto';

import {
  BlogDetailsDto
} from '../ServiceModels/v1/Blog/BlogDetailsDto';

import {
  BlogListDto
} from '../ServiceModels/v1/Blog/BlogListDto';

import {
  BlogResponseDto
} from '../ServiceModels/v1/Blog/BlogResponseDto';

import {
  FeedBlogDto
} from '../ServiceModels/v1/PublicFeed/FeedBlogDto';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // ============================================================
  // API URLS
  // ============================================================

  private readonly blogBaseUrl =
    `${environment.apiUrl}/AIBlog`;

  private readonly blogDetailsBaseUrl =
    `${environment.apiUrl}/Blogs`;

  private readonly categoryBaseUrl =
    `${environment.apiUrl}/Category`;

  private readonly publicFeedBaseUrl =
    `${environment.apiUrl}/PublicFeed`;


  // ============================================================
  // GENERATED BLOG
  // ============================================================

  private generatedBlog:
    GenerateBlogResponseDto | null =
      null;


  // ============================================================
  // REGENERATION PROMPT
  // ============================================================

  private regenerationPrompt =
    '';


  // ============================================================
  // LOCAL STORAGE KEYS
  // ============================================================

  private readonly imageStoragePrefix =
    'blogsee_blog_image_';

  private readonly publishedStorageKey =
    'blogsee_published_blog_ids';


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private http: HttpClient
  ) {}


  // ============================================================
  // COMMON RESPONSE ARRAY
  // ============================================================

  private getResponseArray(
    response: any
  ): any[] {

    const possibleArrays = [

      response?.data?.items,

      response?.Data?.Items,

      response?.data?.blogs,

      response?.Data?.Blogs,

      response?.data?.data,

      response?.Data?.Data,

      response?.data?.$values,

      response?.Data?.$values,

      response?.items,

      response?.Items,

      response?.data,

      response?.Data,

      response

    ];


    for (
      const value of possibleArrays
    ) {

      if (
        Array.isArray(value)
      ) {

        return value;

      }

    }


    return [];

  }


  // ============================================================
  // COMMON RESPONSE OBJECT
  // ============================================================

  private getResponseData(
    response: any
  ): any {

    return (

      response?.data?.blog ??

      response?.Data?.Blog ??

      response?.data ??

      response?.Data ??

      response

    );

  }


  // ============================================================
  // MAP GENERATED BLOG
  // ============================================================

  private mapGeneratedBlogResponse(
    response: any,
    fallbackBlogId:
      number = 0
  ): GenerateBlogResponseDto {

    const data =
      this.getResponseData(
        response
      );


    return {

      blogId:
        data?.blogId ??
        data?.BlogId ??
        fallbackBlogId,

      title:
        data?.title ??
        data?.Title ??
        '',

      content:
        data?.content ??
        data?.Content ??
        '',

      excerpt:
        data?.excerpt ??
        data?.Excerpt ??
        null,

      creditsUsed:
        data?.creditsUsed ??
        data?.CreditsUsed ??
        0,

      remainingCredits:
        data?.remainingCredits ??
        data?.RemainingCredits ??
        0

    };

  }


  // ============================================================
  // PUBLIC FEED
  // GET /PublicFeed
  // ============================================================

  getPublicFeed():
    Observable<FeedBlogDto[]> {

    console.log(
      'GET PUBLIC FEED:',
      this.publicFeedBaseUrl
    );


    return this.http
      .get<any>(
        this.publicFeedBaseUrl
      )
      .pipe(

        map(
          (
            response: any
          ): FeedBlogDto[] => {

            console.log(
              'PUBLIC FEED RAW RESPONSE:',
              response
            );


            const data =
              this.getResponseArray(
                response
              );


            console.log(
              'PUBLIC FEED ARRAY:',
              data
            );


            return data as FeedBlogDto[];

          }
        )

      );

  }


  // ============================================================
  // GET USER BLOGS
  // GET /Blogs
  // ============================================================

  getUserBlogs():
    Observable<BlogListDto[]> {

    console.log(
      'GET USER BLOGS:',
      this.blogDetailsBaseUrl
    );


    return this.http
      .get<any>(
        this.blogDetailsBaseUrl
      )
      .pipe(

        map(
          (
            response: any
          ): BlogListDto[] => {

            console.log(
              'GET /Blogs RAW:',
              response
            );


            const data =
              this.getResponseArray(
                response
              );


            console.log(
              'GET /Blogs ARRAY:',
              data
            );


            return data as BlogListDto[];

          }
        )

      );

  }


  // ============================================================
  // GET DRAFT BLOGS
  // GET /Blogs/drafts
  // ============================================================

  getDraftBlogs():
    Observable<BlogResponseDto[]> {

    console.log(
      'GET DRAFT BLOGS:',
      `${this.blogDetailsBaseUrl}/drafts`
    );


    return this.http
      .get<any>(
        `${this.blogDetailsBaseUrl}/drafts`
      )
      .pipe(

        map(
          (
            response: any
          ): BlogResponseDto[] => {

            console.log(
              'GET /Blogs/drafts RAW:',
              response
            );


            const data =
              this.getResponseArray(
                response
              );


            console.log(
              'GET /Blogs/drafts ARRAY:',
              data
            );


            return data as BlogResponseDto[];

          }
        )

      );

  }


  // ============================================================
  // GET PUBLISHED BLOGS
  // GET /Blogs/published
  // ============================================================

  getPublishedBlogs():
    Observable<BlogResponseDto[]> {

    console.log(
      'GET PUBLISHED BLOGS:',
      `${this.blogDetailsBaseUrl}/published`
    );


    return this.http
      .get<any>(
        `${this.blogDetailsBaseUrl}/published`
      )
      .pipe(

        map(
          (
            response: any
          ): BlogResponseDto[] => {

            console.log(
              'GET /Blogs/published RAW:',
              response
            );


            const data =
              this.getResponseArray(
                response
              );


            console.log(
              'GET /Blogs/published ARRAY:',
              data
            );


            return data as BlogResponseDto[];

          }
        )

      );

  }


  // ============================================================
  // GENERATE BLOG
  // ============================================================

  generateBlog(
    blogData:
      GenerateBlogRequestDto
  ):
    Observable<GenerateBlogResponseDto> {

    return this.http
      .post<any>(
        `${this.blogBaseUrl}/generate`,
        blogData
      )
      .pipe(

        map(
          (
            response: any
          ): GenerateBlogResponseDto => {

            const blog =
              this.mapGeneratedBlogResponse(
                response
              );


            this.generatedBlog =
              blog;


            return blog;

          }
        )

      );

  }


  // ============================================================
  // GENERATE IMAGE
  // ============================================================

  generateImage(
    blogId:
      number,
    request:
      GenerateImageRequestDto
  ):
    Observable<GenerateImageResponseDto> {

    return this.http
      .post<GenerateImageResponseDto>(
        `${this.blogBaseUrl}/${blogId}/generate-image`,
        request
      );

  }


  // ============================================================
  // GENERATE TAGS
  // ============================================================

  generateTags(
    blogId:
      number
  ):
    Observable<GenerateTagsResponseDto> {

    return this.http
      .post<GenerateTagsResponseDto>(
        `${this.blogBaseUrl}/${blogId}/generate-tags`,
        {}
      );

  }


  // ============================================================
  // REGENERATE BLOG
  // ============================================================

  regenerateBlog(
    blogId:
      number,
    request:
      RewriteBlogRequestDto
  ):
    Observable<GenerateBlogResponseDto> {

    return this.http
      .post<any>(
        `${this.blogBaseUrl}/${blogId}/regenerate`,
        request
      )
      .pipe(

        map(
          (
            response: any
          ): GenerateBlogResponseDto => {

            const blog =
              this.mapGeneratedBlogResponse(
                response,
                blogId
              );


            this.generatedBlog =
              blog;


            return blog;

          }
        )

      );

  }


  // ============================================================
  // SHORTEN BLOG
  // ============================================================

  shortenBlog(
    blogId:
      number,
    request:
      RewriteBlogRequestDto
  ):
    Observable<GenerateBlogResponseDto> {

    return this.http
      .post<any>(
        `${this.blogBaseUrl}/${blogId}/shorten`,
        request
      )
      .pipe(

        map(
          (
            response: any
          ): GenerateBlogResponseDto => {

            const blog =
              this.mapGeneratedBlogResponse(
                response,
                blogId
              );


            this.generatedBlog =
              blog;


            return blog;

          }
        )

      );

  }


  // ============================================================
  // EXPAND BLOG
  // ============================================================

  expandBlog(
    blogId:
      number,
    request:
      RewriteBlogRequestDto
  ):
    Observable<GenerateBlogResponseDto> {

    return this.http
      .post<any>(
        `${this.blogBaseUrl}/${blogId}/expand`,
        request
      )
      .pipe(

        map(
          (
            response: any
          ): GenerateBlogResponseDto => {

            const blog =
              this.mapGeneratedBlogResponse(
                response,
                blogId
              );


            this.generatedBlog =
              blog;


            return blog;

          }
        )

      );

  }


  // ============================================================
  // PUBLISH BLOG
  // ============================================================

  publishBlog(
    blogId:
      number
  ):
    Observable<any> {

    console.log(
      'PUBLISH BLOG:',
      blogId
    );


    return this.http
      .post<any>(
        `${this.blogBaseUrl}/${blogId}/publish`,
        {}
      );

  }


  // ============================================================
  // CATEGORIES
  // ============================================================

  getCategories():
    Observable<CategoryResponseDto[]> {

    return this.http
      .get<any>(
        this.categoryBaseUrl
      )
      .pipe(

        map(
          (
            response: any
          ): CategoryResponseDto[] => {

            const data =
              this.getResponseArray(
                response
              );


            return data as CategoryResponseDto[];

          }
        )

      );

  }


  // ============================================================
  // GET BLOG DETAILS
  // ============================================================

getBlogDetails(blogId: number): Observable<any> {


console.log('GET BLOG DETAILS:', blogId);

return this.http.get<any>(
    `${this.blogDetailsBaseUrl}/${blogId}`
);


}



  // ============================================================
  // DELETE BLOG
  // ============================================================

  deleteBlog(
    blogId:
      number
  ):
    Observable<any> {

    return this.http
      .delete<any>(
        `${this.blogDetailsBaseUrl}/${blogId}`
      );

  }


  // ============================================================
  // GENERATED BLOG
  // ============================================================

  setGeneratedBlog(
    response:
      GenerateBlogResponseDto
  ): void {

    this.generatedBlog =
      response;

  }


  getGeneratedBlog():
    GenerateBlogResponseDto | null {

    return this.generatedBlog;

  }


  clearGeneratedBlog(): void {

    this.generatedBlog =
      null;

  }


  // ============================================================
  // PUBLISHED STATUS - LOCAL CACHE
  // ============================================================

  markBlogPublished(
    blogId:
      number
  ): void {

    const currentIds =
      this.getLocallyPublishedBlogIds();


    if (
      !currentIds.includes(
        blogId
      )
    ) {

      currentIds.push(
        blogId
      );

    }


    localStorage.setItem(
      this.publishedStorageKey,
      JSON.stringify(
        currentIds
      )
    );

  }


  getLocallyPublishedBlogIds():
    number[] {

    try {

      const value =
        localStorage.getItem(
          this.publishedStorageKey
        );


      if (
        !value
      ) {

        return [];

      }


      const ids =
        JSON.parse(
          value
        );


      if (
        !Array.isArray(ids)
      ) {

        return [];

      }


      return ids
        .map(
          (
            id: any
          ) =>
            Number(id)
        )
        .filter(
          (
            id: number
          ) =>
            id > 0
        );

    } catch (
      error
    ) {

      console.error(
        'PUBLISHED ID CACHE ERROR:',
        error
      );


      return [];

    }

  }


  removeLocallyPublishedBlog(
    blogId:
      number
  ): void {

    const ids =
      this.getLocallyPublishedBlogIds()
        .filter(
          id =>
            id !== blogId
        );


    localStorage.setItem(
      this.publishedStorageKey,
      JSON.stringify(
        ids
      )
    );

  }


  // ============================================================
  // BLOG IMAGE - SAVE
  // ============================================================

  saveBlogImage(
    blogId:
      number,
    imageUrl:
      string
  ): void {

    if (
      !blogId ||
      !imageUrl
    ) {

      return;

    }


    localStorage.setItem(
      `${this.imageStoragePrefix}${blogId}`,
      imageUrl
    );

  }


  // ============================================================
  // BLOG IMAGE - GET
  // ============================================================

  getBlogImage(
    blogId:
      number
  ):
    string | null {

    if (
      !blogId
    ) {

      return null;

    }


    return localStorage.getItem(
      `${this.imageStoragePrefix}${blogId}`
    );

  }


  // ============================================================
  // BLOG IMAGE - DELETE
  // ============================================================

  clearBlogImage(
    blogId:
      number
  ): void {

    if (
      !blogId
    ) {

      return;

    }


    localStorage.removeItem(
      `${this.imageStoragePrefix}${blogId}`
    );

  }


  // ============================================================
  // REGENERATION PROMPT
  // ============================================================

  setRegenerationPrompt(
    prompt:
      string
  ): void {

    this.regenerationPrompt =
      prompt;

  }


  getRegenerationPrompt():
    string {

    return this.regenerationPrompt;

  }


  clearRegenerationPrompt(): void {

    this.regenerationPrompt =
      '';

  }

}