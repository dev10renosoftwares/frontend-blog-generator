import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Follower {
  username: string;
  handle: string;
  bio: string;
  image: string;
  followedDate: string;
  verified: boolean;
}

@Component({
  selector: 'app-followers',
  imports:[CommonModule],
  templateUrl: './followers.html',
  styleUrls: ['./followers.css']
})
export class Followers {

  searchText = '';
  sortBy = 'newest';

  followers: Follower[] = [

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


  get filteredFollowers(): Follower[] {

    let result = [...this.followers];

    // Search
    if (this.searchText.trim()) {

      const search = this.searchText
        .toLowerCase()
        .trim();

      result = result.filter(follower =>
        follower.username
          .toLowerCase()
          .includes(search) ||

        follower.handle
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


  viewProfile(follower: Follower) {

    console.log('Opening profile:', follower);

    // Later we can navigate to:
    // /profile/sarah_khan

  }


  removeFollower(follower: Follower) {

    const confirmed = confirm(
      `Remove ${follower.username} from your followers?`
    );

    if (!confirmed) {
      return;
    }

    this.followers = this.followers.filter(
      item => item.handle !== follower.handle
    );

  }

}