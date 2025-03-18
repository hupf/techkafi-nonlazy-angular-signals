import { Component, resource, signal } from '@angular/core';

@Component({
  selector: 'app-resource',
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
export class ResourceComponent {
  id = signal(1);
  todo = resource<
    {
      id: number;
      title: string;
      completed: boolean;
      userId: number;
    },
    { id: number }
  >({
    request: () => ({ id: this.id() }),
    loader: async ({ request: { id }, abortSignal }) => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          signal: abortSignal,
        },
      );
      return res.json();
    },
  });
}
