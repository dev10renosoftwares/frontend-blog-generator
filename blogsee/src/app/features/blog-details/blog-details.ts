import { CommonModule } from '@angular/common';
import {
Component,
ElementRef,
OnInit,
ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BlogService } from '../../services/blog';

import { CommentDto } from '../../ServiceModels/v1/BlogInteraction/CommentDto';
import { CreateCommentDto } from '../../ServiceModels/v1/BlogInteraction/CreateCommentDto';
import { UpdateCommentDto } from '../../ServiceModels/v1/BlogInteraction/UpdateCommentDto';
import { BlogLikeUserDto } from '../../ServiceModels/v1/BlogInteraction/BlogLikeUserDto';

@Component({
selector: 'app-blog-details',
standalone: true,
imports: [
CommonModule,
FormsModule
],
templateUrl: './blog-details.html',
styleUrl: './blog-details.css'
})
export class BlogDetails implements OnInit {

@ViewChild('commentTextArea')
commentTextArea!: ElementRef<HTMLTextAreaElement>;

/*
 * Blog object returned from the API.
 * Using any here prevents a mismatch between
 * FeedBlogDetailsDto and BlogDetailsDto while
 * we normalize the backend response.
 */
blog: any = null;

blogId: number = 0;

/*
 * Comments
 */
comments: CommentDto[] = [];
commentText: string = '';

feedBlogs: any[] = [];

editingCommentId: number | null = null;
editingCommentText: string = '';

/*
 * Likes
 */
likeUsers: BlogLikeUserDto[] = [];

/*
 * Interaction states
 */
isLiked: boolean = false;
isSaved: boolean = false;
isReposted: boolean = false;
isFollowingAuthor: boolean = false;

/*
 * Errors
 */
blogError: string = '';
commentError: string = '';
interactionError: string = '';


constructor(
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService
) {}


// =========================================================
// PAGE INITIALIZATION
// =========================================================

ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

        const id = params.get('id');

        console.log(
            'BLOG DETAILS ROUTE ID:',
            id
        );

        if (!id) {

            this.blogError =
                'Blog ID was not found.';

            return;
        }

        const numericId = Number(id);

        if (
            isNaN(numericId) ||
            numericId <= 0
        ) {

            this.blogError =
                'Invalid blog ID.';

            return;
        }

        this.blogId = numericId;

        console.log(
            'BLOG DETAILS PAGE OPENED FOR BLOG:',
            this.blogId
        );

        this.loadBlogDetails();

        this.loadComments();

        this.loadLikeUsers();

        this.loadInteractionStatus();

    });
}


// =========================================================
// LOAD BLOG DETAILS
// =========================================================

loadBlogDetails(): void {

    this.blogError = '';
    this.blog = null;

    console.log('REQUESTING BLOG DETAILS FOR:', this.blogId);

    /*
     * First get the public feed.
     *
     * The PublicFeed response already contains:
     * authorName
     * coverImageUrl
     * categoryName
     * title
     * etc.
     *
     * We use these values for the details page.
     */

    this.blogService.getPublicFeed().subscribe({

        next: (feedBlogs: any[]) => {

            console.log('PUBLIC FEED FOR DETAILS:', feedBlogs);

            let feedBlog: any = null;

            for (const item of feedBlogs) {

                const itemId =
                    item.blogId ??
                    item.BlogId;

                if (Number(itemId) === Number(this.blogId)) {
                    feedBlog = item;
                    break;
                }
            }

            console.log('MATCHING FEED BLOG:', feedBlog);


            /*
             * Now get the complete blog details.
             */

            this.blogService
                .getBlogDetails(this.blogId)
                .subscribe({

                    next: (response: any) => {

                        console.log(
                            'BLOG DETAILS RAW RESPONSE:',
                            response
                        );


                        /*
                         * -----------------------------------------
                         * NORMALIZE DETAILS RESPONSE
                         * -----------------------------------------
                         */

                        let data: any = response;


                        if (
                            data &&
                            data.data !== undefined &&
                            data.data !== null
                        ) {
                            data = data.data;
                        }


                        if (
                            data &&
                            data.Data !== undefined &&
                            data.Data !== null
                        ) {
                            data = data.Data;
                        }


                        if (
                            data &&
                            data.blog !== undefined &&
                            data.blog !== null
                        ) {
                            data = data.blog;
                        }


                        if (
                            data &&
                            data.Blog !== undefined &&
                            data.Blog !== null
                        ) {
                            data = data.Blog;
                        }


                        /*
                         * Sometimes API returns an array.
                         */

                        if (Array.isArray(data)) {

                            let foundBlog: any = null;

                            for (const item of data) {

                                const itemId =
                                    item.blogId ??
                                    item.BlogId;

                                if (
                                    Number(itemId) ===
                                    Number(this.blogId)
                                ) {
                                    foundBlog = item;
                                    break;
                                }
                            }

                            data = foundBlog ?? data[0];
                        }


                        if (
                            !data ||
                            typeof data !== 'object'
                        ) {

                            console.error(
                                'INVALID BLOG DETAILS:',
                                data
                            );

                            /*
                             * If details response is unusable,
                             * still display the feed blog.
                             */

                            if (feedBlog) {

                                this.blog = {
                                    ...feedBlog,

                                    blogId:
                                        feedBlog.blogId ??
                                        this.blogId,

                                    content:
                                        feedBlog.content ??
                                        '',

                                    authorName:
                                        feedBlog.authorName ??
                                        'User',

                                    coverImageUrl:
                                        feedBlog.coverImageUrl ??
                                        null
                                };

                                return;
                            }

                            this.blogError =
                                'Blog details were not found.';

                            return;
                        }


                        /*
                         * -----------------------------------------
                         * AUTHOR
                         * -----------------------------------------
                         *
                         * IMPORTANT:
                         * Prefer PublicFeed authorName because
                         * PublicFeed already returns it correctly.
                         */

                        let authorName =
                            feedBlog?.authorName ??
                            feedBlog?.AuthorName ??
                            data.authorName ??
                            data.AuthorName ??
                            data.userName ??
                            data.UserName ??
                            data.username ??
                            data.Username ??
                            data.authorUsername ??
                            data.AuthorUsername ??
                            data.user?.userName ??
                            data.user?.UserName ??
                            data.user?.username ??
                            data.user?.Username ??
                            data.author?.userName ??
                            data.author?.UserName ??
                            data.author?.username ??
                            data.author?.Username ??
                            'User';


                        /*
                         * -----------------------------------------
                         * IMAGE
                         * -----------------------------------------
                         *
                         * Prefer PublicFeed coverImageUrl.
                         */

                        let coverImageUrl =
                            feedBlog?.coverImageUrl ??
                            feedBlog?.CoverImageUrl ??
                            data.coverImageUrl ??
                            data.CoverImageUrl ??
                            data.imageUrl ??
                            data.ImageUrl ??
                            data.coverImage ??
                            data.CoverImage ??
                            data.image ??
                            data.Image ??
                            data.blogImageUrl ??
                            data.BlogImageUrl ??
                            data.generatedImageUrl ??
                            data.GeneratedImageUrl ??
                            null;


                        /*
                         * Nested image object support.
                         */

                        if (
                            !coverImageUrl &&
                            data.image &&
                            typeof data.image === 'object'
                        ) {

                            coverImageUrl =
                                data.image.url ??
                                data.image.Url ??
                                data.image.imageUrl ??
                                data.image.ImageUrl ??
                                null;
                        }


                        if (
                            !coverImageUrl &&
                            data.coverImage &&
                            typeof data.coverImage === 'object'
                        ) {

                            coverImageUrl =
                                data.coverImage.url ??
                                data.coverImage.Url ??
                                data.coverImage.imageUrl ??
                                data.coverImage.ImageUrl ??
                                null;
                        }


                        /*
                         * -----------------------------------------
                         * CREATE FINAL BLOG OBJECT
                         * -----------------------------------------
                         */

                        this.blog = {

                            blogId:
                                data.blogId ??
                                data.BlogId ??
                                feedBlog?.blogId ??
                                this.blogId,


                            title:
                                data.title ??
                                data.Title ??
                                feedBlog?.title ??
                                feedBlog?.Title ??
                                'Untitled Blog',


                            content:
                                data.content ??
                                data.Content ??
                                '',


                            excerpt:
                                data.excerpt ??
                                data.Excerpt ??
                                feedBlog?.excerpt ??
                                feedBlog?.Excerpt ??
                                '',


                            slug:
                                data.slug ??
                                data.Slug ??
                                feedBlog?.slug ??
                                feedBlog?.Slug ??
                                '',


                            /*
                             * THIS IS THE IMPORTANT FIX
                             */
                            coverImageUrl:
                                coverImageUrl,


                            userId:
                                data.userId ??
                                data.UserId ??
                                feedBlog?.userId ??
                                feedBlog?.UserId ??
                                data.user?.userId ??
                                data.user?.UserId ??
                                0,


                            /*
                             * THIS IS THE IMPORTANT FIX
                             */
                            authorName:
                                authorName,


                            categoryId:
                                data.categoryId ??
                                data.CategoryId ??
                                feedBlog?.categoryId ??
                                0,


                            categoryName:
                                data.categoryName ??
                                data.CategoryName ??
                                feedBlog?.categoryName ??
                                feedBlog?.CategoryName ??
                                'General',


                            wordCount:
                                data.wordCount ??
                                data.WordCount ??
                                feedBlog?.wordCount ??
                                0,


                            publishedAt:
                                data.publishedAt ??
                                data.PublishedAt ??
                                feedBlog?.publishedAt ??
                                feedBlog?.PublishedAt ??
                                data.createdAt ??
                                data.CreatedAt ??
                                null,


                            viewCount:
                                data.viewCount ??
                                data.ViewCount ??
                                feedBlog?.viewCount ??
                                0,


                            likeCount:
                                data.likeCount ??
                                data.LikeCount ??
                                feedBlog?.likeCount ??
                                0,


                            commentCount:
                                data.commentCount ??
                                data.CommentCount ??
                                feedBlog?.commentCount ??
                                0,


                            tags:
                                data.tags ??
                                data.Tags ??
                                feedBlog?.tags ??
                                []

                        };


                        /*
                         * -----------------------------------------
                         * FINAL DEBUG
                         * -----------------------------------------
                         */

                        console.log(
                            '================================='
                        );

                        console.log(
                            'FINAL BLOG FOR UI:',
                            this.blog
                        );

                        console.log(
                            'FINAL AUTHOR:',
                            this.blog.authorName
                        );

                        console.log(
                            'FINAL IMAGE:',
                            this.blog.coverImageUrl
                        );

                        console.log(
                            'FINAL TITLE:',
                            this.blog.title
                        );

                        console.log(
                            'FINAL CONTENT:',
                            this.blog.content
                        );

                        console.log(
                            '=================================');


                        /*
                         * If author is still missing.
                         */

                        if (
                            !this.blog.authorName ||
                            this.blog.authorName === 'User'
                        ) {

                            console.warn(
                                'AUTHOR IS STILL MISSING'
                            );
                        }


                        /*
                         * If image is still missing.
                         */

                        if (!this.blog.coverImageUrl) {

                            console.warn(
                                'BLOG IMAGE IS STILL MISSING'
                            );
                        }

                    },

                    error: (error) => {

                        console.error(
                            'BLOG DETAILS HTTP ERROR:',
                            error
                        );


                        /*
                         * If /Blogs/{id} fails but the PublicFeed
                         * contains the blog, display the feed data.
                         */

                        if (feedBlog) {

                            this.blog = {

                                ...feedBlog,

                                blogId:
                                    feedBlog.blogId ??
                                    this.blogId,

                                authorName:
                                    feedBlog.authorName ??
                                    'User',

                                coverImageUrl:
                                    feedBlog.coverImageUrl ??
                                    null

                            };

                            return;
                        }


                        this.blogError =
                            'Unable to load this blog. Please try again later.';
                    }

                });

        },

        error: (error) => {

            console.error(
                'PUBLIC FEED ERROR:',
                error
            );

            /*
             * If PublicFeed fails, try the normal details API.
             */

            this.blogService
                .getBlogDetails(this.blogId)
                .subscribe({

                    next: (response: any) => {

                        let data: any = response;

                        if (data?.data) {
                            data = data.data;
                        }

                        if (data?.Data) {
                            data = data.Data;
                        }

                        if (data?.blog) {
                            data = data.blog;
                        }

                        if (data?.Blog) {
                            data = data.Blog;
                        }

                        if (Array.isArray(data)) {
                            data = data[0];
                        }

                        if (!data) {
                            this.blogError =
                                'Blog details were not found.';
                            return;
                        }

                        this.blog = {

                            blogId:
                                data.blogId ??
                                data.BlogId ??
                                this.blogId,

                            title:
                                data.title ??
                                data.Title ??
                                'Untitled Blog',

                            content:
                                data.content ??
                                data.Content ??
                                '',

                            excerpt:
                                data.excerpt ??
                                data.Excerpt ??
                                '',

                            slug:
                                data.slug ??
                                data.Slug ??
                                '',

                            coverImageUrl:
                                data.coverImageUrl ??
                                data.CoverImageUrl ??
                                data.imageUrl ??
                                data.ImageUrl ??
                                null,

                            userId:
                                data.userId ??
                                data.UserId ??
                                0,

                            authorName:
                                data.authorName ??
                                data.AuthorName ??
                                data.userName ??
                                data.UserName ??
                                data.username ??
                                data.Username ??
                                'User',

                            categoryId:
                                data.categoryId ??
                                data.CategoryId ??
                                0,

                            categoryName:
                                data.categoryName ??
                                data.CategoryName ??
                                'General',

                            wordCount:
                                data.wordCount ??
                                data.WordCount ??
                                0,

                            publishedAt:
                                data.publishedAt ??
                                data.PublishedAt ??
                                data.createdAt ??
                                data.CreatedAt ??
                                null,

                            viewCount:
                                data.viewCount ??
                                data.ViewCount ??
                                0,

                            likeCount:
                                data.likeCount ??
                                data.LikeCount ??
                                0,

                            commentCount:
                                data.commentCount ??
                                data.CommentCount ??
                                0,

                            tags:
                                data.tags ??
                                data.Tags ??
                                []

                        };

                    },

                    error: (detailsError) => {

                        console.error(
                            'DETAILS FALLBACK ERROR:',
                            detailsError
                        );

                        this.blogError =
                            'Unable to load this blog. Please try again later.';
                    }

                });

        }

    });
}


// =========================================================
// COMMENTS
// =========================================================

loadComments(): void {

    /*
     * Keep this method because your comments API
     * can be connected here.
     */
    console.log(
        'LOAD COMMENTS FOR BLOG:',
        this.blogId
    );

}


loadLikeUsers(): void {

    /*
     * Keep this method for your like-users API.
     */
    console.log(
        'LOAD LIKE USERS FOR BLOG:',
        this.blogId
    );

}


loadInteractionStatus(): void {

    /*
     * Keep this method for your interaction-status API.
     */
    console.log(
        'LOAD INTERACTION STATUS FOR BLOG:',
        this.blogId
    );

}


// =========================================================
// LIKE BLOG
// =========================================================

likeBlog(): void {

    this.isLiked = !this.isLiked;


    if (this.blog) {

        if (this.isLiked) {

            this.blog.likeCount =
                (this.blog.likeCount || 0) + 1;

        } else {

            this.blog.likeCount =
                Math.max(
                    0,
                    (this.blog.likeCount || 0) - 1
                );

        }

    }


    console.log(
        this.isLiked
            ? 'BLOG LIKED:'
            : 'BLOG UNLIKED:',
        this.blogId
    );

}


// =========================================================
// SAVE BLOG
// =========================================================

saveBlog(): void {

    this.isSaved = !this.isSaved;


    console.log(
        this.isSaved
            ? 'BLOG SAVED:'
            : 'BLOG UNSAVED:',
        this.blogId
    );

}


// =========================================================
// REPOST BLOG
// =========================================================

repostBlog(): void {

    this.isReposted = !this.isReposted;


    console.log(
        this.isReposted
            ? 'BLOG REPOSTED:'
            : 'BLOG UNREPOSTED:',
        this.blogId
    );

}


// =========================================================
// ADD COMMENT
// =========================================================

addComment(): void {

    const content =
        this.commentText.trim();


    if (!content) {
        return;
    }


    const request: CreateCommentDto = {
        content: content
    };


    console.log(
        'CREATE COMMENT REQUEST:',
        request
    );

}


// =========================================================
// EDIT COMMENT
// =========================================================

startEditComment(
    comment: CommentDto
): void {

    this.editingCommentId =
        comment.commentId;

    this.editingCommentText =
        comment.content;

}


cancelEditComment(): void {

    this.editingCommentId = null;

    this.editingCommentText = '';

}


updateComment(): void {

    if (
        this.editingCommentId === null ||
        !this.editingCommentText.trim()
    ) {

        return;
    }


    const request: UpdateCommentDto = {
        content:
            this.editingCommentText.trim()
    };


    console.log(
        'UPDATE COMMENT:',
        this.editingCommentId,
        request
    );

}


deleteComment(
    commentId: number
): void {

    console.log(
        'DELETE COMMENT:',
        commentId
    );

}


likeComment(
    comment: CommentDto
): void {

    console.log(
        'LIKE COMMENT:',
        comment.commentId
    );

}


// =========================================================
// FOLLOW AUTHOR
// =========================================================

followAuthor(): void {

    if (!this.blog) {
        return;
    }


    this.isFollowingAuthor =
        !this.isFollowingAuthor;


    console.log(
        this.isFollowingAuthor
            ? 'FOLLOWING AUTHOR:'
            : 'UNFOLLOWED AUTHOR:',
        this.blog.userId
    );

}


// =========================================================
// COMMENT BOX
// =========================================================

focusCommentBox(): void {

    if (
        this.commentTextArea &&
        this.commentTextArea.nativeElement
    ) {

        this.commentTextArea
            .nativeElement
            .focus();

    }

}


// =========================================================
// NAVIGATION
// =========================================================

goBack(): void {

    this.router.navigate(['/']);

}


// =========================================================
// AUTHOR INITIAL
// =========================================================

getAuthorInitial(): string {

    if (
        !this.blog ||
        !this.blog.authorName
    ) {

        return '?';
    }


    return this.blog.authorName
        .charAt(0)
        .toUpperCase();

}


// =========================================================
// COMMENT INITIAL
// =========================================================

getCommentInitial(
    comment: CommentDto
): string {

    if (!comment.userName) {
        return '?';
    }


    return comment.userName
        .charAt(0)
        .toUpperCase();

}


// =========================================================
// READ TIME
// =========================================================

getReadTime(): number {

    if (
        !this.blog ||
        !this.blog.wordCount
    ) {

        return 1;
    }


    const minutes =
        Math.ceil(
            this.blog.wordCount / 200
        );


    return minutes > 0
        ? minutes
        : 1;

}


// =========================================================
// BLOG DATE
// =========================================================

formatDate(
    date: string | null
): string {

    if (!date) {
        return '';
    }


    const blogDate =
        new Date(date);


    if (
        isNaN(
            blogDate.getTime()
        )
    ) {

        return date;
    }


    return blogDate.toLocaleDateString(
        'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    );

}


// =========================================================
// COMMENT DATE
// =========================================================

formatCommentDate(
    date: string
): string {

    return this.formatDate(date);

}


// =========================================================
// TRACK COMMENTS
// =========================================================

trackComment(
    index: number,
    comment: CommentDto
): number {

    return comment.commentId;

}

}
