import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-to-signal-lazy',
  standalone: true,
  template: `
    <button (click)="toggle()">Toggle</button>
    @if (show()) {
      <ul>
        @for (todo of todos(); track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
  `,
})
export class ToSignalLazyComponent {
  http = inject(HttpClient);
  show = signal(false);
  todos = toSignal(
    this.http.get<ReadonlyArray<{ id: number; title: string }>>(
      'https://jsonplaceholder.typicode.com/todos',
    ),
    { initialValue: [] },
  );

  toggle() {
    this.show.update((v) => !v);
  }
}
