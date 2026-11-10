import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Employee } from '../../models/employee';

@Component({
  imports: [DatePipe],
  selector: 'app-birthday-card',
  styleUrl: './birthday-card.scss',
  templateUrl: './birthday-card.html',
})
export class BirthdayCard {
  @Input({ required: true }) employee!: Employee;
}
