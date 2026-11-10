import { Component, Input } from '@angular/core';
import { RequestItemData } from '../request-item/request-item';
import { Requests } from '../requests/requests';
import { NewRequest } from '../new-request/new-request';

const MOCK_APPLICATIONS: RequestItemData[] = [
  { name: 'דנה ראשוני', birthdate: '1988-04-12', department: 'הנדסה', image: null },
  { name: 'נועם שלישון', birthdate: '1995-09-23', department: 'שיווק', image: null },
  { name: 'מיה שני', birthdate: '1991-01-05', department: 'עיצוב', image: null },
  { name: 'אורי רביעי', birthdate: '2000-07-18', department: 'מכירות', image: null },
];

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [Requests, NewRequest],
  templateUrl: './all-requests.html',
  styleUrl: './all-requests.scss',
})
export class AllRequests {
  @Input() applications: RequestItemData[] = [...MOCK_APPLICATIONS];
}
