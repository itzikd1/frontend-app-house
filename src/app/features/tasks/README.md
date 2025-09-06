# Tasks Feature - Coding Patterns & Architecture Reference

This README documents the coding patterns, architecture, and best practices used in the Tasks feature. Use this as a reference when building similar feature modules.

## 📁 Folder Structure

```
tasks/
├── tasks.component.ts                    # Main container component with tabs
├── tasks.component.html
├── tasks.component.scss
├── tasks-tab/                           # Individual tab components
│   ├── tasks-tab.component.ts
│   ├── tasks-tab.component.html
│   └── tasks-tab.component.scss
├── categories-tab/                      # Second tab component
├── task-category-filter/               # Reusable filter component
├── services/
│   └── task-facade.service.ts          # Feature-specific facade service
├── configs/
│   ├── task-dialog.configs.ts          # Dialog configuration classes
│   └── category-dialog.configs.ts
└── utils/
    └── task.utils.ts                   # Pure utility functions
```

## 🏗️ Architecture Patterns

### 1. Standalone Components
All components use Angular's standalone architecture:

```typescript
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    TabSwitcherComponent,
    TasksTabComponent,
    CategoriesTabComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // Always OnPush!
})
```

**Key Points:**
- Always use `standalone: true`
- Import only what you need in the `imports` array
- Always use `ChangeDetectionStrategy.OnPush` for performance
- Use `styleUrl` (singular) for single stylesheet

### 2. Tab-Based Structure
Main container component manages tabs with shared state:

```typescript
// Constants for type safety
const TASK_TAB_ID = 'tasks' as const;
const CATEGORIES_TAB_ID = 'categories' as const;
type TaskTabId = typeof TASK_TAB_ID | typeof CATEGORIES_TAB_ID;

export class TasksComponent {
  public readonly selectedTab = signal<TaskTabId>(TASK_TAB_ID);
  public readonly tabOptions: TabOption[] = [
    { id: TASK_TAB_ID, label: 'Tasks' },
    { id: CATEGORIES_TAB_ID, label: 'Categories' },
  ] as const;

  // Type-safe tab switching
  private isValidTab(tab: string): tab is TaskTabId {
    return tab === TASK_TAB_ID || tab === CATEGORIES_TAB_ID;
  }
}
```

**Key Points:**
- Use `const` assertions and union types for type safety
- Use signals for reactive state management
- Implement type guards for runtime validation
- Mark arrays as `readonly` where appropriate

### 3. Facade Service Pattern
Feature-specific service that orchestrates core services and manages state:

```typescript
@Injectable({
  providedIn: 'root'
})
export class TaskFacadeService {
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(TaskCategoryService);

  // Private writable signals
  private readonly _tasks = signal<Task[]>([]);
  private readonly _taskLoading = signal<boolean>(false);
  private readonly _taskError = signal<string | null>(null);

  // Public readonly signals
  public readonly tasks = this._tasks.asReadonly();
  public readonly taskLoading = this._taskLoading.asReadonly();
  public readonly taskError = this._taskError.asReadonly();

  // Computed signals for derived state
  public readonly filteredTasks = computed(() => {
    const allTasks = this._tasks();
    const categoryFilter = this._selectedCategory();
    return TaskUtils.filterByCategory(allTasks, categoryFilter);
  });
}
```

**Key Points:**
- Private writable signals with public readonly accessors
- Use `inject()` for dependency injection
- Computed signals for derived state
- Pure utility functions for business logic
- Consistent error handling patterns

### 4. Dialog Configuration Classes
Centralized dialog configurations using static factory methods:

```typescript
export class TaskDialogConfigs {
  static createAddTaskConfig(categories: TaskCategory[]): FormDialogConfig {
    return {
      title: 'Add New Task',
      submitLabel: 'Add Task',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          validators: [Validators.required, Validators.minLength(1)],
          placeholder: 'Enter task title'
        },
        // ... more fields
      ]
    };
  }

  static createEditTaskConfig(task: Task, categories: TaskCategory[]): FormDialogConfig {
    const config = this.createAddTaskConfig(categories);
    return {
      ...config,
      title: 'Edit Task',
      submitLabel: 'Update Task',
      initialData: {
        title: task.title,
        description: task.description || '',
        // ... map task data to form
      }
    };
  }
}
```

**Key Points:**
- Static factory methods for different dialog types
- Reuse base configuration for edit scenarios
- Type-safe field definitions
- Centralized validation rules

### 5. Pure Utility Classes
Business logic separated into pure utility functions:

```typescript
export class TaskUtils {
  // Constants for maintainability
  public static readonly TEMP_ID_PREFIX = 'temp_' as const;
  public static readonly MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

  /**
   * Check if a task is overdue
   */
  public static isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) {
      return false;
    }
    // ... business logic
  }

  /**
   * Sort tasks with completed tasks at the bottom
   */
  public static sortTasks(tasks: readonly Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // ... sorting logic
    });
  }
}
```

**Key Points:**
- Static methods for stateless operations
- Readonly input parameters where possible
- Named constants for magic numbers
- Comprehensive JSDoc documentation
- Pure functions (no side effects)

## 🔄 State Management Patterns

### 1. Signal-Based State
```typescript
// Loading states
private readonly _taskLoading = signal<boolean>(false);
public readonly taskLoading = this._taskLoading.asReadonly();

// Error states  
private readonly _taskError = signal<string | null>(null);
public readonly taskError = this._taskError.asReadonly();

// Data states
private readonly _tasks = signal<Task[]>([]);
public readonly tasks = this._tasks.asReadonly();
```

### 2. Computed Derived State
```typescript
public readonly filteredTasks = computed(() => {
  const allTasks = this._tasks();
  const categoryFilter = this._selectedCategory();
  const dashFilter = this._dashboardFilter();

  let filtered = TaskUtils.filterByCategory(allTasks, categoryFilter);
  
  switch (dashFilter) {
    case DashboardCardFilter.Overdue:
      filtered = filtered.filter(t => TaskUtils.isOverdue(t));
      break;
    // ... more cases
  }

  return TaskUtils.sortTasks(filtered);
});
```

### 3. Component State Exposure
```typescript
export class TasksTabComponent {
  private readonly taskFacade = inject(TaskFacadeService);

  // Expose facade signals directly
  public readonly tasks = this.taskFacade.tasks;
  public readonly filteredTasks = this.taskFacade.filteredTasks;
  public readonly taskLoading = this.taskFacade.taskLoading;
}
```

## 🚀 API Integration Patterns

### 1. Service Integration
```typescript
public loadTasks(): void {
  this._taskLoading.set(true);
  this.taskService.getTasks().subscribe({
    next: (tasks) => {
      this._tasks.set(TaskUtils.sortTasks(tasks));
      this._taskLoading.set(false);
      this._taskError.set(null);
    },
    error: () => {
      this._taskError.set('Failed to load tasks.');
      this._taskLoading.set(false);
    }
  });
}
```

### 2. Optimistic Updates
```typescript
public async addTask(taskData: Partial<Task>): Promise<void> {
  const tempId = TaskUtils.generateTempId();
  const optimisticTask = { ...taskData, id: tempId } as Task;
  
  // Add optimistically
  this._tasks.update(tasks => [...tasks, optimisticTask]);
  
  try {
    const savedTask = await firstValueFrom(this.taskService.create(taskData));
    // Replace temp with real task
    this._tasks.update(tasks => 
      tasks.map(t => t.id === tempId ? savedTask : t)
    );
  } catch (error) {
    // Remove optimistic task on error
    this._tasks.update(tasks => tasks.filter(t => t.id !== tempId));
    this._taskError.set('Failed to add task.');
  }
}
```

## 🎨 Component Patterns

### 1. Dialog Integration
```typescript
public openAddTaskDialog(): void {
  const config = TaskDialogConfigs.createAddTaskConfig(this.categories());

  this.formDialogService.openFormDialog(config).subscribe(result => {
    if (result) {
      this.taskFacade.addTask(result);
    }
  });
}
```

### 2. Shared Components
```typescript
// Use shared components consistently
imports: [
  CommonModule,
  LoadingSpinnerComponent,           // Loading states
  ItemCardComponent,                 // List items  
  DashboardSummaryCardsComponent,   // Dashboard cards
  TaskCategoryFilterComponent,      // Feature-specific filter
]
```

### 3. Template Patterns
```html
<!-- Conditional rendering with loading states -->
<app-loading-spinner *ngIf="taskLoading()"></app-loading-spinner>

<!-- Error states -->
<div *ngIf="taskError()" class="error-message">
  {{ taskError() }}
</div>

<!-- Data rendering -->
<app-item-card
  *ngFor="let task of filteredTasks()"
  [item]="task"
  [isOverdue]="isOverdue(task.dueDate)"
  (edit)="openEditTaskDialog(task)"
  (delete)="deleteTask(task.id)"
></app-item-card>
```

## 🎯 Best Practices Summary

### Code Organization
- ✅ Use standalone components
- ✅ Implement facade services for complex state
- ✅ Separate utility functions into pure classes
- ✅ Create configuration classes for dialogs
- ✅ Use consistent folder structure

### State Management
- ✅ Private writable signals, public readonly accessors
- ✅ Use computed signals for derived state
- ✅ Implement loading/error states consistently
- ✅ Apply optimistic updates where appropriate

### Type Safety
- ✅ Use const assertions and union types
- ✅ Implement type guards for validation
- ✅ Define interfaces for all data structures
- ✅ Use readonly parameters where possible

### Performance
- ✅ Always use OnPush change detection
- ✅ Minimize component re-renders with signals
- ✅ Use pure utility functions
- ✅ Lazy load components when possible

### Maintainability
- ✅ Extract constants for magic values
- ✅ Use descriptive naming conventions
- ✅ Write comprehensive documentation
- ✅ Consistent error handling patterns
- ✅ Reuse shared components

## 🔧 Usage Example

When creating a new feature similar to tasks:

1. **Create main container component** with tab structure
2. **Implement facade service** for state management
3. **Create individual tab components** for different views
4. **Add dialog configuration classes** for forms
5. **Extract utility functions** for business logic
6. **Use shared components** for consistency
7. **Implement proper error handling** and loading states
8. **Add type safety** with unions and type guards

This pattern ensures consistency, maintainability, and scalability across your application.
