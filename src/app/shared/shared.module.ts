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
import { ItemDialogComponent } from './components/item-dialog/item-dialog.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ModalDialogComponent } from './components/modal-dialog.component';

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
    ItemDialogComponent,
    ItemFormComponent,
    ItemListComponent,
    ModalDialogComponent
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
    ItemDialogComponent,
    ItemFormComponent,
    ItemListComponent,
    ModalDialogComponent
  ]
})
export class SharedModule {}
