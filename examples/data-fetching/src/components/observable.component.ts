import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-observable',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @let todo = todo$ | async;
    @if (!todo) {
      <p>Loading...</p>
    } @else {
      <h1>{{ todo.title }}</h1>
    }
  `,
})
export class ObservableComponent {
  http = inject(HttpClient);
  id$ = new BehaviorSubject(1);
  todo$ = this.id$.pipe(
    switchMap((id) =>
      this.http.get<{ id: number; title: string }>(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
      ),
    ),
  );
}
