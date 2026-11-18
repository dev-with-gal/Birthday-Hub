import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Signup } from './components/signup/signup';
import { MyRequests } from './components/my-requests/my-requests';
import { AllRequests } from './components/all-requests/all-requests';
import { MiniGame } from './components/mini-game/mini-game';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'all-requests', component: AllRequests },
      { path: 'my-requests', component: MyRequests },
      { path: 'mini-game', component: MiniGame },
    ],
  },
  { path: '**', redirectTo: '' },
];
