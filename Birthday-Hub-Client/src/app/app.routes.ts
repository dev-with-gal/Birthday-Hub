import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Signup } from './components/signup/signup';
import { MyRequests } from './components/my-requests/my-requests';
import { AllRequests } from './components/all-requests/all-requests';
import { MiniGame } from './components/mini-game/mini-game';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Home },
  { path: 'signup', component: Signup },
  { path: 'all-requests', component: AllRequests },
  { path: 'my-requests', component: MyRequests },
  { path: 'mini-game', component: MiniGame },
];
