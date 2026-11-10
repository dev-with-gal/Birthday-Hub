import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ApplicationsApiService } from '../../services/applications-api.service';

export interface MiniGameMember {
  id: string;
  name: string;
  birthdate: string;
}

@Component({
  selector: 'app-mini-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-game.html',
  styleUrl: './mini-game.scss',
})
export class MiniGame implements OnInit {
  private readonly applicationsApi = inject(ApplicationsApiService);

  readonly allMembers = signal<MiniGameMember[]>([]);
  readonly orderedMembers = signal<MiniGameMember[]>([]);
  readonly message = signal('');
  readonly correctCount = signal<number | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.applicationsApi
      .findApproved()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (applications) => {
          this.allMembers.set(
            applications.map((application) => ({
              id: application.id,
              name: `${application.firstName} ${application.lastName}`,
              birthdate: application.birthday.slice(0, 10),
            })),
          );
          this.newRound();
        },
        error: () => this.message.set('לא ניתן לטעון את הנתונים כרגע.'),
      });
  }

  newRound(): void {
    this.message.set('');
    this.correctCount.set(null);

    if (this.allMembers().length < 4) {
      this.orderedMembers.set([]);
      this.message.set('צריך לפחות 4 ימי הולדת מאושרים כדי להתחיל.');
      return;
    }

    const shuffled = this.shuffle([...this.allMembers()]);
    this.orderedMembers.set(this.shuffle(shuffled.slice(0, 4)));
  }

  swapAdjacent(index: number): void {
    const orderedMembers = this.orderedMembers();
    if (index < 0 || index >= orderedMembers.length - 1) return;

    const movedMembers = [...orderedMembers];
    [movedMembers[index], movedMembers[index + 1]] = [movedMembers[index + 1], movedMembers[index]];
    this.orderedMembers.set(movedMembers);
    this.message.set('');
    this.correctCount.set(null);
  }

  checkOrder(): void {
    const orderedMembers = this.orderedMembers();
    const correctOrder = [...orderedMembers].sort((a, b) => a.birthdate.localeCompare(b.birthdate));

    const correctCount = orderedMembers.reduce(
      (count, member, index) => count + (member === correctOrder[index] ? 1 : 0),
      0,
    );

    this.correctCount.set(correctCount);
    this.message.set(correctCount === 4 ? 'כל הכבוד! הסדר נכון.' : 'נסו שוב!');
  }

  private shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
}
