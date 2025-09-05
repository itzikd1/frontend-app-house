import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recipe-tag-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './recipe-tag-filter.component.html',
  styleUrl: './recipe-tag-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeTagFilterComponent {
  @Input() selectedTag: string | null = null;
  @Input() availableTags: string[] = [];
  @Output() tagChange = new EventEmitter<string | null>();

  /**
   * Handle tag selection
   */
  public selectTag(tag: string): void {
    const newTag = this.selectedTag === tag ? null : tag;
    this.tagChange.emit(newTag);
  }

  /**
   * Clear tag filter
   */
  public clearFilter(): void {
    this.tagChange.emit(null);
  }
}
