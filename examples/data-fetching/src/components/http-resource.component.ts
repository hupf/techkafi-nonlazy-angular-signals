import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-http-resource',
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
export class HttpResourceComponent {
  id = signal(1);
  todo = httpResource<{
    id: number;
    title: string;
    completed: boolean;
    userId: number;
  }>(() => `https://jsonplaceholder.typicode.com/todos/${this.id()}`);
}
