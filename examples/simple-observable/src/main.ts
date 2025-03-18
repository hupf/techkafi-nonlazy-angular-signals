import { AsyncPipe } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <ul>
      @for (post of posts$ | async; track post.id) {
        <li>{{ post.title }}</li>
      }
    </ul>
  `,
})
export class App {
  http = inject(HttpClient)
  posts$ = this.http.get<ReadonlyArray<{ id: number; title: string }>>("https://jsonplaceholder.typicode.com/todos");
}

bootstrapApplication(App, {providers: [
  provideHttpClient(),
]});
