import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ...MATERIAL_MODULES,
    HeaderComponent
  ],
  exports: [
    ...MATERIAL_MODULES,
    HeaderComponent
  ]
})
export class SharedModule {
}
