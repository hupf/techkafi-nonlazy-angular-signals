import { Injectable, resource } from '@angular/core';

@Injectable()
export class TodosService {
  constructor() {
    console.log('TodosService');
  }
  todos = resource<
    ReadonlyArray<{
      id: number;
      title: string;
      completed: boolean;
      userId: number;
    }>,
    void
  >({
    loader: async ({ abortSignal }) => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        signal: abortSignal,
      });
      return res.json();
    },
  });
}
