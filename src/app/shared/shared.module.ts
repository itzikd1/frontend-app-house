import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { FabButtonComponent } from './components/fab-button/fab-button.component';
import { HealthStatusCardComponent } from './components/health-status-card/health-status-card.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ModalDialogComponent } from './components/modal-dialog.component';
import { DashboardSummaryCardsComponent } from './components/dashboard-summary-cards/dashboard-summary-cards.component';
import { TabSwitcherComponent } from './components/tab-switcher/tab-switcher.component';
import { TaskCategoryFilterModule } from '../features/tasks/task-category-filter/task-category-filter.module';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...MATERIAL_MODULES,
    HeaderComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SuccessMessageComponent,
    FabButtonComponent,
    HealthStatusCardComponent,
    ItemCardComponent,
    ItemListComponent,
    ModalDialogComponent,
    DashboardSummaryCardsComponent,
    TabSwitcherComponent,
    TaskCategoryFilterModule
  ],
  exports: [
    ...MATERIAL_MODULES,
    HeaderComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SuccessMessageComponent,
    FabButtonComponent,
    HealthStatusCardComponent,
    ItemCardComponent,
    ItemListComponent,
    ModalDialogComponent,
    DashboardSummaryCardsComponent,
    TabSwitcherComponent,
    TaskCategoryFilterModule
  ]
})
export class SharedModule {}
