import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard';
import { BlogDetails } from './features/blog-details/blog-details';
import { UpdateProfile } from './update-profile/update-profile';
import { Feedback } from './feedback/feedback';
import { RaiseQueryComponent } from './raise-query/raise-query';
import { NotificationsComponent } from './notification/notification';
import { CreateBlogComponent } from './create-blog/create-blog';
import { Createdblog } from './createdblog/createdblog';
import { Topup } from './topup/topup';
import { Followers } from './followers/followers';
import { Following } from './following/following';
import { UserProfile } from './user-profile/user-profile';
import { Likedblog } from './likedblog/likedblog';

export const routes: Routes = [

  {
    path: '',
    component: Dashboard
  },

  {
    path: 'user-dashboard',
    component: UserDashboardComponent
  },

  {
    path: 'blog',
    component: BlogDetails
  },
  {
    path: 'update-profile',
    component: UpdateProfile
  },

  {
    path: 'feedback',
    component: Feedback
  },

  {
    path: 'raise-query',
    component: RaiseQueryComponent
  },

  {
    path: 'notification',
    component: NotificationsComponent
  },

  {
    path: 'create-blog',
    component: CreateBlogComponent
  },

  {
    path: 'createdblog',
    component: Createdblog
  },

  {
    path: 'topup',
    component: Topup
  },
  {
    path: 'followers',
    component: Followers
  },
  {
    path: 'following',
    component: Following
  },
  {
    path: 'userprofile',
    component: UserProfile
  },
  {
    path: 'likedblog',
    component: Likedblog
  }
];