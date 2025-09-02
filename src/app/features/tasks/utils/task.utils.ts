import { Task } from '../../../core/interfaces/task.model';

/**
 * Task-related utility functions
 */
export class TaskUtils {
  /**
   * Check if a task is overdue
   */
  public static isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    return due < now;
  }

  /**
   * Sort tasks with completed tasks at the bottom
   */
  public static sortTasks(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => {
      // First sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by due date (overdue first, then by date)
      const aOverdue = this.isOverdue(a);
      const bOverdue = this.isOverdue(b);

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // Both overdue or both not overdue - sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      // Tasks without due date go to the end
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // Finally sort by title
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Generate a temporary ID for optimistic updates
   */
  public static generateTempId(): string {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Filter tasks by category
   */
  public static filterByCategory(tasks: Task[], categoryId: string): Task[] {
    if (categoryId === 'all') return tasks;
    return tasks.filter(task => task.categoryId === categoryId);
  }

  /**
   * Filter tasks by completion status
   */
  public static filterByCompletion(tasks: Task[], completed?: boolean): Task[] {
    if (completed === undefined) return tasks;
    return tasks.filter(task => task.completed === completed);
  }

  /**
   * Get task priority color
   */
  public static getPriorityColor(priority: 'Low' | 'Medium' | 'High'): string {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  }

  /**
   * Get task status display text
   */
  public static getTaskStatus(task: Task): string {
    if (task.completed) return 'Completed';
    if (this.isOverdue(task)) return 'Overdue';
    return 'Pending';
  }
}
