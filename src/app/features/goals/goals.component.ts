import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../core/services/goal.service';
import { Goal } from '../../shared/models/goal.model';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsComponent implements OnInit {
  goals = signal<Goal[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);

  newGoal = signal<Partial<Goal>>({ title: '', description: '', status: 'active', dueDate: '' });
  adding = signal<boolean>(false);

  constructor(private goalService: GoalService) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

  fetchGoals(): void {
    this.loading.set(true);
    this.goalService.getGoals().subscribe({
      next: (goals) => {
        this.goals.set(goals);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load goals.');
        this.loading.set(false);
      },
    });
  }

  addGoal(): void {
    if (!this.newGoal().title) return;
    this.adding.set(true);
    this.goalService.createGoal(this.newGoal()).subscribe({
      next: (goal) => {
        this.goals.set([goal, ...this.goals()]);
        this.newGoal.set({ title: '', description: '', status: 'active', dueDate: '' });
        this.adding.set(false);
      },
      error: () => {
        this.error.set('Failed to add goal.');
        this.adding.set(false);
      },
    });
  }

  deleteGoal(id: string): void {
    this.loading.set(true);
    this.goalService.deleteGoal(id).subscribe({
      next: () => {
        this.goals.set(this.goals().filter(g => g.id !== id));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete goal.');
        this.loading.set(false);
      },
    });
  }
}

