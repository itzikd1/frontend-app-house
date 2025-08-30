import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../core/services/goal.service';
import { Goal } from '../../shared/models/goal.model';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { AddGoalDialogWrapperComponent } from './add-goal-dialog-wrapper.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, FabButtonComponent],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsComponent implements OnInit {
  goals = signal<Goal[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);
  adding = signal<boolean>(false);

  private goalService = inject(GoalService);
  private dialog = inject(MatDialog);

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

  openAddGoalDialog(): void {
    const dialogRef = this.dialog.open(AddGoalDialogWrapperComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: Partial<Goal> | undefined) => {
      if (result && result.title) {
        this.adding.set(true);
        this.goalService.createGoal(result).subscribe({
          next: (goal) => {
            this.goals.set([goal, ...this.goals()]);
            this.adding.set(false);
          },
          error: () => {
            this.error.set('Failed to add goal.');
            this.adding.set(false);
          },
        });
      }
    });
  }

  public deleteGoal(id: string): void {
    this.loading.set(true);
    this.goalService.deleteGoal(id).subscribe({
      next: () => {
        this.goals.set(this.goals().filter(goal => goal.id !== id));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete goal.');
        this.loading.set(false);
      },
    });
  }
}
