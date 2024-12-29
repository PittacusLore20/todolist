import { Component, inject, model, signal } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation/confirmation.component';

interface ITodo {
  id: number;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatCardModule, MatCheckboxModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  todoList = signal<ITodo[]>([]);
  description = model('');
  readonly dialog = inject(MatDialog);
  selectedIndex: number = -1;

  save(): void {
    const obj: ITodo = {
      description: this.description(),
      done: false,
      id: this.todoList().length + 1
    };

    this.todoList().push(obj);
    this.description.set('');
  }

  checkMarkedChanged(index: number): void {
    this.todoList()[index].done = !this.todoList()[index].done;
    this.todoList.set(this.todoList());
  }

  deleteConfirmation(index: number): void {
    this.dialog.open(ConfirmationComponent, {
      width: '250px'
    }).afterClosed().subscribe((res) => {
      if (res === 'YES') {
        this.todoList().splice(index, 1);
      }
    });
  }

  editItem(index: number, item: ITodo) {
    this.selectedIndex = index;
    this.description.set(item.description);
  }

  update() {
    if(this.selectedIndex >= 0) {
      this.todoList()[this.selectedIndex].description = this.description();
      this.description.set('');
      this.selectedIndex = -1;
    }
  }
}
