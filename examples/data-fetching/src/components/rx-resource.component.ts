import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-rx-resource',
  standalone: true,
  template: `
    @if (todo.isLoading()) {
      <p>Loading...</p>
    } @else if (todo.error()) {
      <p>Error: {{ $any(todo.error())?.status }}</p>
    } @else {
      <h1>{{ todo.value()?.title }}</h1>
    }
  `,
})
export class RxResourceComponent {
  http = inject(HttpClient);
  id = signal(1);
  todo = rxResource({
    request: () => ({ id: this.id() }),
    loader: ({ request: { id } }) =>
      this.http.get<{
        id: number;
        title: string;
        completed: boolean;
        userId: number;
      }>(`https://jsonplaceholder.typicode.com/todos/${id}`),
  });
}
