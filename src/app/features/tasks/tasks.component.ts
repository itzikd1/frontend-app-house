import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {
  tasks = signal<Task[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);

  // New task form state
  newTask = signal<Partial<Task>>({ title: '', description: '', priority: 'Medium', dueDate: '' });
  adding = signal<boolean>(false);

  // Edit task state
  editing = signal<boolean>(false);
  editTask = signal<Task | null>(null);
  editTaskForm: Partial<Task> | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks.');
        this.loading.set(false);
      }
    });
  }

  addTask(): void {
    if (!this.newTask().title) return;
    this.adding.set(true);
    this.taskService.createTask(this.newTask()).subscribe({
      next: (task) => {
        this.tasks.set([task, ...this.tasks()]);
        this.newTask.set({ title: '', description: '', priority: 'Medium', dueDate: '' });
        this.adding.set(false);
      },
      error: () => {
        this.error.set('Failed to add task.');
        this.adding.set(false);
      }
    });
  }

  startEdit(task: Task): void {
    this.editing.set(true);
    this.editTask.set({ ...task });
    this.editTaskForm = { ...task };
  }

  updateTask(): void {
    const originalTask = this.editTask();
    if (!originalTask || !this.editTaskForm) return;
    this.loading.set(true);
    this.taskService.updateTask(originalTask.id, this.editTaskForm).subscribe({
      next: (updated) => {
        this.tasks.set(this.tasks().map(t => t.id === updated.id ? updated : t));
        this.editing.set(false);
        this.editTask.set(null);
        this.editTaskForm = null;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to update task.');
        this.loading.set(false);
      }
    });
  }

  deleteTask(id: string): void {
    this.loading.set(true);
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.set(this.tasks().filter(t => t.id !== id));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete task.');
        this.loading.set(false);
      }
    });
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.editTask.set(null);
    this.editTaskForm = null;
  }
}
