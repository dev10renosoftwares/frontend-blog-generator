import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

interface FollowingUser {
  username: string;
  handle: string;
  bio: string;
  image: string;
  followedDate: string;
  verified: boolean;
}

@Component({
  selector: 'app-following',
  imports: [CommonModule, RouterLink],
  templateUrl: './following.html',
  styleUrls: ['./following.css']
})
export class Following {

  searchText = '';
  sortBy = 'newest';

  following: FollowingUser[] = [

    {
      username: 'Sarah Khan',
      handle: 'sarah_khan',
      bio: 'AI enthusiast | Content Writer | Lifelong learner',
      image: 'https://i.pravatar.cc/300?img=47',
      followedDate: '24 Aug, 2026',
      verified: true
    },

    {
      username: 'Aiman',
      handle: 'aiman_7',
      bio: 'Tech lover | Exploring AI and beyond',
      image: 'https://i.pravatar.cc/300?img=12',
      followedDate: '23 Aug, 2026',
      verified: true
    },

    {
      username: 'Noor Creates',
      handle: 'noor_creates',
      bio: 'Creative mind | Blog reader | Dream big',
      image: 'https://i.pravatar.cc/300?img=44',
      followedDate: '22 Aug, 2026',
      verified: false
    },

    {
      username: 'Hamza',
      handle: 'its_hamza',
      bio: 'Developer | UI/UX Designer | Coffee addict',
      image: 'https://i.pravatar.cc/300?img=11',
      followedDate: '21 Aug, 2026',
      verified: true
    },

    {
      username: 'Areeba',
      handle: 'areeba.m',
      bio: 'Books | Blogs | Everything in between',
      image: 'https://i.pravatar.cc/300?img=32',
      followedDate: '20 Aug, 2026',
      verified: false
    },

    {
      username: 'Ali Writes',
      handle: 'writes_by_ali',
      bio: 'Writer | Poet | Storyteller',
      image: 'https://i.pravatar.cc/300?img=68',
      followedDate: '19 Aug, 2026',
      verified: true
    },

    {
      username: 'Shayan',
      handle: 'shayan.x',
      bio: 'Exploring ideas. Sharing thoughts.',
      image: 'https://i.pravatar.cc/300?img=5',
      followedDate: '18 Aug, 2026',
      verified: false
    },

    {
      username: 'Sana',
      handle: 'blog.with.sana',
      bio: 'Sharing insights that inspire ✨',
      image: 'https://i.pravatar.cc/300?img=49',
      followedDate: '17 Aug, 2026',
      verified: true
    },

    {
      username: 'Usman Dev',
      handle: 'usman.dev',
      bio: 'Code. Build. Repeat. Always learning.',
      image: 'https://i.pravatar.cc/300?img=15',
      followedDate: '16 Aug, 2026',
      verified: false
    }

  ];


  get filteredFollowing(): FollowingUser[] {

    let result = [...this.following];

    // Search
    if (this.searchText.trim()) {

      const search = this.searchText
        .toLowerCase()
        .trim();

      result = result.filter(following =>
        following.username
          .toLowerCase()
          .includes(search) ||

        following.handle
          .toLowerCase()
          .includes(search)
      );
    }


    // Sort
    if (this.sortBy === 'name') {

      result.sort((a, b) =>
        a.username.localeCompare(b.username)
      );

    } else if (this.sortBy === 'oldest') {

      result.reverse();

    }

    return result;
  }


  viewProfile(following: FollowingUser) {

    console.log('Opening profile:', following);

    // Later we can navigate to:
    // /profile/sarah_khan

  }


  removeuser(following: FollowingUser) {

    const confirmed = confirm(
      `Remove ${following.username} from your followers?`
    );

    if (!confirmed) {
      return;
    }

    this.following = this.following.filter(
      item => item.handle !== following.handle
    );

  }

}