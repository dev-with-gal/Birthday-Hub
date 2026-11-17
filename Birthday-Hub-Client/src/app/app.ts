import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Header } from './components/header/header';
import { he } from './i18n/he';

@Component({
  imports: [RouterOutlet, Header],
  selector: 'app-root',
  styles: [],
  template: `
    <app-header></app-header>
    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('Birthday-Hub-Client');

  constructor(title: Title) {
    title.setTitle(he.header.title);
  }
}
