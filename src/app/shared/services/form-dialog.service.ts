import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormDialogComponent, FormDialogConfig } from '../components/form-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class FormDialogService {
  private readonly dialog = inject(MatDialog);

  public openFormDialog(config: FormDialogConfig): Observable<Record<string, string | number | Date> | null> {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: config,
      width: '500px',
      disableClose: true,
      autoFocus: true,
    });

    return dialogRef.afterClosed();
  }
}
