import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <ul>
      @for (post of posts(); track post.id) {
        <li>{{ post.title }}</li>
      }
    </ul>
  `,
})
export class App {
  http = inject(HttpClient);
  posts = toSignal(
    this.http.get<ReadonlyArray<{ id: number; title: string }>>(
      'https://jsonplaceholder.typicode.com/todos',
    ),
    { initialValue: [] },
  );
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
