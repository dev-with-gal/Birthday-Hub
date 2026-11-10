import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly auth = inject(AuthService);

  logout(event: MouseEvent): void {
    event.preventDefault();
    this.auth.logout();
  }
}
