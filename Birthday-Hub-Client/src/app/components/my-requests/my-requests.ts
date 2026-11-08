import { Component } from '@angular/core';
import { NewRequest } from '../new-request/new-request';

@Component({
  imports: [NewRequest],
  selector: 'app-my-requests',
  styleUrl: './my-requests.scss',
  templateUrl: './my-requests.html',
})
export class MyRequests {}
