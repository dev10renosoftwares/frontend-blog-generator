import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  username: string;
  handle: string;
  profileImage: string;
  bio: string;
  about: string;
  followers: number;
  following: number;
  blogs: number;
  verified: boolean;
  online: boolean;
}

interface Blog {
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
  readTime: number;

  liked: boolean;
  reposted: boolean;
  saved: boolean;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  imports:[CommonModule],
  styleUrls: ['./user-profile.css']
})
export class UserProfile {

  isFollowing = false;

  searchBlog = '';

  selectedBlog: Blog | null = null;


  user: User = {

    username: 'Sarah Khan',

    handle: 'sarah_khan',

    profileImage:
      'https://i.pravatar.cc/400?img=47',

    bio:
      'AI enthusiast • Content Writer • Exploring technology and ideas',

    about:
      'I love writing about artificial intelligence, technology, creativity and the future of digital experiences. I share my thoughts, experiments and things I learn along the way.',

    followers: 1248,

    following: 386,

    blogs: 42,

    verified: true,

    online: true

  };


  blogs: Blog[] = [

    {
      title: 'The Future of Artificial Intelligence',

      description:
        'Artificial intelligence is rapidly changing the way we work, communicate and create. But where exactly are we heading next?',

      content:
        `Artificial intelligence has moved far beyond being a futuristic concept. Today, AI is becoming part of everyday life, from the applications we use to the way businesses make decisions.

The next stage of AI will focus heavily on collaboration between humans and intelligent systems. Instead of replacing every task performed by humans, AI will increasingly become a tool that helps people work faster, discover new ideas and make better decisions.

One of the most interesting developments is the growth of generative AI. Systems can now create text, images, code and other forms of content within seconds. This has opened new possibilities for writers, designers, developers and businesses.

However, the future of AI is not only about technology. Questions surrounding privacy, responsibility, transparency and ethical use will become increasingly important.

The most successful future will therefore not simply be about creating more powerful AI systems. It will be about building systems that are useful, responsible and designed around human needs.

As AI continues to evolve, the people who learn how to work alongside these technologies will have an opportunity to shape the future rather than simply experience it.`,

      category: 'Artificial Intelligence',

      date: '24 Aug, 2026',

      readTime: 6,

      liked: false,

      reposted: false,

      saved: false
    },


    {
      title: 'Designing Better Digital Experiences',

      description:
        'Good design is not just about making an interface look beautiful. It is about making technology easier and more enjoyable to use.',

      content:
        `A great digital experience begins with understanding the person who will use the product.

Designers often focus heavily on colors, typography and visual elements, but these are only part of the experience. The most important question is whether the user can accomplish what they came to do without unnecessary confusion.

Simple navigation, clear hierarchy and consistent interactions can dramatically improve usability.

Another important aspect of modern design is accessibility. Digital products should be designed so that people with different abilities can interact with them comfortably.

Good design also requires continuous improvement. User feedback, analytics and real-world observations can reveal problems that may not have been obvious during the initial design process.

Ultimately, successful design combines creativity with empathy. When designers understand the needs and frustrations of their users, they can create experiences that feel natural rather than complicated.`,

      category: 'UI/UX',

      date: '20 Aug, 2026',

      readTime: 5,

      liked: false,

      reposted: false,

      saved: false
    },


    {
      title: 'How Technology Is Changing Education',

      description:
        'Technology is creating new opportunities for students to learn, collaborate and access information from almost anywhere.',

      content:
        `Education has always evolved alongside technology. From printed books to computers and smartphones, every generation has experienced new tools that changed how knowledge is shared.

Today, artificial intelligence, online learning platforms and interactive applications are transforming the classroom.

Students can access educational material from almost anywhere and learn at a pace that suits them. Teachers can also use technology to understand student progress and provide more personalized support.

However, technology should not replace the human side of education. Teachers continue to play an important role in mentorship, motivation and helping students develop critical thinking skills.

The future of education will likely combine technology with human interaction rather than choosing one over the other.`,

      category: 'Technology',

      date: '15 Aug, 2026',

      readTime: 7,

      liked: false,

      reposted: false,

      saved: false
    }

  ];


  get filteredBlogs(): Blog[] {

    if (!this.searchBlog.trim()) {
      return this.blogs;
    }

    const search =
      this.searchBlog.toLowerCase().trim();

    return this.blogs.filter(blog =>
      blog.title
        .toLowerCase()
        .includes(search) ||

      blog.category
        .toLowerCase()
        .includes(search) ||

      blog.description
        .toLowerCase()
        .includes(search)
    );

  }


  toggleFollow(): void {

    this.isFollowing = !this.isFollowing;

    if (this.isFollowing) {

      this.user.followers++;

    } else {

      this.user.followers--;

    }

  }


  openBlog(blog: Blog): void {

    this.selectedBlog = blog;

    document.body.style.overflow = 'hidden';

  }


  closeBlog(): void {

    this.selectedBlog = null;

    document.body.style.overflow = '';

  }


  likeBlog(blog: Blog): void {

    blog.liked = !blog.liked;

  }


  commentBlog(blog: Blog): void {

    console.log(
      'Open comments for:',
      blog.title
    );

  }


  repostBlog(blog: Blog): void {

    blog.reposted = !blog.reposted;

  }


  saveBlog(blog: Blog): void {

    blog.saved = !blog.saved;

  }


  openFollowers(): void {

    console.log(
      'Open followers of',
      this.user.username
    );

  }


  openFollowing(): void {

    console.log(
      'Open following of',
      this.user.username
    );

  }

}