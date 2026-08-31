import { Component,OnInit } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { SidebarComponent} from '../../../../shared/components/sidebar/sidebar';
import{ Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../../services/blog';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar,
    SidebarComponent, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  blogs: any[] = [];

  loadingBlogs = false;
  blogError = '';

  constructor(
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.loadPublicFeed();
  }

  loadPublicFeed(): void {

    this.loadingBlogs = true;
    this.blogError = '';

    this.blogService.getPublicFeed().subscribe({

      next: (response) => {

        console.log('Public Feed Response:', response);

        this.blogs = response;

        this.loadingBlogs = false;
      },

      error: (error) => {

        console.error('Public Feed Error:', error);

        this.blogError =
          'Unable to load public blogs.';

        this.loadingBlogs = false;
      }

    });

  }

  readBlog(): void {
    this.router.navigate(['/blog']);
  }

}
