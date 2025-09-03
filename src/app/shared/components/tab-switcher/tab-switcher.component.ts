import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import {CommonModule} from '@angular/common';

export interface TabOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-tab-switcher',
  templateUrl: './tab-switcher.component.html',
  styleUrls: ['./tab-switcher.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabSwitcherComponent {
  @Input() tabs: TabOption[] = [];
  @Input() selectedTab = '';
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(tabId: string): void {
    if (tabId !== this.selectedTab) {
      this.tabChange.emit(tabId);
    }
  }
}

