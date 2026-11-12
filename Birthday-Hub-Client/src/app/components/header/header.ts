import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { he } from '../../i18n/he';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly auth = inject(AuthService);
  readonly text = he;

  logout(event: MouseEvent): void {
    event.preventDefault();
    this.auth.logout();
  }
}
