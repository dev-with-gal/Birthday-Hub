import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RequestItem, RequestItemData } from '../request-item/request-item';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RequestItem],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests {
  @Input() requests: RequestItemData[] = [];
}
