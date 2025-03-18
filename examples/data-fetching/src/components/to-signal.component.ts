import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-to-signal',
  standalone: true,
  template: `
    @let entry = todo();
    @if (!entry) {
      <p>Loading...</p>
    } @else {
      <h1>{{ entry.title }}</h1>
    }
  `,
})
export class ToSignalComponent {
  http = inject(HttpClient);
  id = signal(1);
  todo = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.http.get<{ id: number; title: string }>(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
        ),
      ),
    ),
    { initialValue: null },
  );
}
