import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard';
import { BlogDetails } from './features/blog-details/blog-details';
import { UpdateProfileComponent } from './update-profile/update-profile';
import { Feedback } from './feedback/feedback';
import { RaiseQueryComponent } from './raise-query/raise-query';
import { NotificationsComponent } from './notification/notification';
import { CreateBlogComponent } from './create-blog/create-blog';
import { CreatedblogComponent } from './createdblog/createdblog';
import { Topup } from './topup/topup';
import { Followers } from './followers/followers';
import { Following } from './following/following';
import { UserProfile } from './user-profile/user-profile';
import { Likedblog } from './likedblog/likedblog';
import{ Createprompt } from './createprompt/createprompt';
import { UserBlogs } from './userblogs/userblogs';

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
    path: 'blog-details/:id',
    component: BlogDetails
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent
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
    component: CreatedblogComponent
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
  },
 {
    path: 'createdblog/:blogId',
    component: CreatedblogComponent
  },
  {
    path: 'create-prompt',
    component: Createprompt
  },
   {
    path: 'userblogs',
    component: UserBlogs
  }
];