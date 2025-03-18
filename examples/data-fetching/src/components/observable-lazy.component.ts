import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-observable-lazy',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <button (click)="toggle()">Toggle</button>
    @if (show()) {
      <ul>
        @for (todo of todos$ | async; track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
  `,
})
export class ObservableLazyComponent {
  http = inject(HttpClient);
  show = signal(false);
  todos$ = this.http.get<ReadonlyArray<{ id: number; title: string }>>(
    'https://jsonplaceholder.typicode.com/todos',
  );

  toggle() {
    this.show.update((v) => !v);
  }
}
