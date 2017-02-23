import VueRouter from 'vue-router'

const home = { template: '<div>this is home page</div>' };
const news = { template: '<div>this is news page！<router-link :to="{ name: \'profile\', params: { userId: 123 }}">profile</router-link> <router-view></router-view></div>' };
const about = { template: '<div>this is about page</div>' };

const UserProfile = { template: '<div>this is UserProfile</div>' };
const UserPosts = { template: '<div>this is UserPosts</div>' };

const routes = [
  { path: '/home', component: home },
  { path: '/news', component: news, children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          name: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          name: 'posts',
          component: UserPosts
        }
      ] },
  { path: '/about', component: about }
];

const router = new VueRouter({ routes });

export default router;