import { Component, computed, signal } from '@angular/core';
import { BirthdayCard } from '../../components/birthday-card/birthday-card';
import { Employee } from '../../models/employee';
import { KeyValuePipe } from '@angular/common';
import { NewRequest } from '../new-request/new-request';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BirthdayCard, KeyValuePipe, NewRequest],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  employees = signal<Employee[]>([
    {
      id: 1,
      name: 'ג׳ון סמית׳',
      birthday: '1995-11-10',
      department: 'פיתוח',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 2,
      name: 'שרה ג׳ונסון',
      birthday: '1998-11-15',
      department: 'משאבי אנוש',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    {
      id: 3,
      name: 'דייוויד בראון',
      birthday: '1992-11-20',
      department: 'פיתוח',
      avatar: 'https://i.pravatar.cc/150?img=13',
    },
    {
      id: 4,
      name: 'מייק וילסון',
      birthday: '1996-12-02',
      department: 'שיווק',
      avatar: 'https://i.pravatar.cc/150?img=11',
    },
  ]);

  groupedEmployees = computed(() => {
    return this.employees().reduce(
      (groups, employee) => {
        const department = employee.department;

        if (!groups[department]) {
          groups[department] = [];
        }

        groups[department].push(employee);

        return groups;
      },
      {} as Record<string, Employee[]>,
    );
  });
}
