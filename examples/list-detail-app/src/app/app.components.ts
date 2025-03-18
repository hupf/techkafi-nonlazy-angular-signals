import { Component, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { TodosService } from './app.services';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}

@Component({
  selector: 'my-todos',
  imports: [RouterOutlet],
  providers: [TodosService],
  template: `<router-outlet></router-outlet>`,
})
export class TodosComponent {}

@Component({
  selector: 'my-todos-list',
  imports: [RouterLink],
  template: `
    <ul>
      @if (todos.isLoading()) { Loading... } @else { @for (todo of
      todos.value(); track todo.id) {
      <li>
        <a [routerLink]="['/todos', todo.id]">{{ todo.title }}</a>
      </li>
      } }
    </ul>
  `,
})
export class TodosListComponent {
  private todosService = inject(TodosService);
  todos = this.todosService.todos;
}

@Component({
  selector: 'my-todo-detail',
  imports: [RouterLink],
  template: `
    <button (click)="toggle()">Show todo</button>
    @if (show()) { @if (!todo) {
    <p>Loading...</p>
    } @else {
    <p>Todo {{ todo.value()?.id }}: {{ todo.value()?.title }}</p>
    } }
    <a [routerLink]="['/todos']">To list</a>
  `,
})
export class TodoDetailComponent {
  private activatedRoute = inject(ActivatedRoute);
  todoId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );
  todo = resource<
    {
      id: number;
      title: string;
      completed: boolean;
      userId: number;
    },
    { id: number }
  >({
    request: () => ({ id: this.todoId() }),
    loader: async ({ request: { id }, abortSignal }) => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          signal: abortSignal,
        }
      );
      return res.json();
    },
  });
  show = signal(false);
  toggle() {
    this.show.update((v) => !v);
  }
}
