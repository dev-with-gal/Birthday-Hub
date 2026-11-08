import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface MiniGameMember {
  name: string;
  birthdate: string;
}

const MOCK_MEMBERS: MiniGameMember[] = [
  { name: 'דנה ראשוני', birthdate: '1988-04-12' },
  { name: 'נועם שלישון', birthdate: '1995-09-23' },
  { name: 'מיה שני', birthdate: '1991-01-05' },
  { name: 'אורי רביעי', birthdate: '2000-07-18' },
];

@Component({
  selector: 'app-mini-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-game.html',
  styleUrl: './mini-game.scss',
})
export class MiniGame {
  private allMembers: MiniGameMember[] = [...MOCK_MEMBERS];

  orderedMembers: MiniGameMember[] = [];
  message = '';
  correctCount: number | null = null;

  @Input() set members(value: MiniGameMember[] | null | undefined) {
    this.allMembers = value?.length ? value : [...MOCK_MEMBERS];
    this.newRound();
  }

  newRound(): void {
    this.message = '';
    this.correctCount = null;

    if (this.allMembers.length < 4) {
      this.orderedMembers = [];
      this.message = 'צריך לפחות 4 חברים כדי להתחיל.';
      return;
    }

    const shuffled = this.shuffle([...this.allMembers]);
    this.orderedMembers = this.shuffle(shuffled.slice(0, 4));
  }

  move(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= this.orderedMembers.length) return;

    [this.orderedMembers[index], this.orderedMembers[target]] = [
      this.orderedMembers[target],
      this.orderedMembers[index],
    ];
    this.message = '';
    this.correctCount = null;
  }

  checkOrder(): void {
    const correctOrder = [...this.orderedMembers].sort((a, b) =>
      a.birthdate.localeCompare(b.birthdate),
    );

    this.correctCount = this.orderedMembers.reduce(
      (count, member, index) => count + (member === correctOrder[index] ? 1 : 0),
      0,
    );

    this.message = this.correctCount === 4 ? 'כל הכבוד! הסדר נכון.' : 'נסו שוב!';
  }

  private shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
}
