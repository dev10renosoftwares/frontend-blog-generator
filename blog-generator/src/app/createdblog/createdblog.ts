import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-createdblog',
  imports: [CommonModule],
  templateUrl: './createdblog.html',
  styleUrl: './createdblog.css',
})
export class Createdblog {
  blog = {
    title: 'The Future of Artificial Intelligence',
    topic: 'Artificial Intelligence',
    wordCount: 700,
    category: 'Technology',
    language: 'English',

    content: `
Artificial Intelligence is rapidly transforming the way we live, work, and interact with technology. From intelligent virtual assistants to advanced systems capable of analyzing enormous amounts of information, AI has become an important part of modern life.

The growth of artificial intelligence has created new opportunities across industries. Businesses are using AI to automate repetitive tasks, improve customer experiences, analyze data, and make better decisions. In healthcare, AI can assist professionals in identifying patterns and supporting diagnosis, while in education it can help create personalized learning experiences.

However, the development of AI also introduces important challenges. Questions surrounding privacy, security, employment, bias, and responsible use need to be carefully considered. As these systems become more powerful, organizations and governments will need to establish responsible practices for their development and use.
  The future of artificial intelligence will likely involve greater collaboration between humans and intelligent systems. Rather than simply replacing human work, AI can be used to support creativity, improve productivity, and help people solve complex problems.

Ultimately, the impact of artificial intelligence will depend on how responsibly we develop and use it. With appropriate safeguards and thoughtful implementation, AI has the potential to become one of the most useful technologies of the coming decades.
  `
  };

  actionMessage = '';

  isPublished = false;
  isDraft = false;

  publishBlog(): void {
    this.isPublished = true;
    this.isDraft = false;

    this.actionMessage = 'Your blog has been published successfully.';
  }  
  saveDraft(): void {
    this.isDraft = true;
    this.isPublished = false;

    this.actionMessage = 'Your blog has been saved as a draft.';
  }

  aiImage(): void {
    this.actionMessage = 'AI image generation will be connected later.';
  }

  shortenBlog(): void {
    this.actionMessage = 'Shorten functionality will be connected later.';
  }

  expandBlog(): void {
    this.actionMessage = 'Expand functionality will be connected later.';
  }

  regenerateBlog(): void {
    this.actionMessage = 'Regenerate functionality will be connected later.';
  }
}
