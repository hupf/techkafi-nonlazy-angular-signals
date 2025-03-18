import { Routes } from '@angular/router';
import {
  TodoDetailComponent,
  TodosComponent,
  TodosListComponent,
} from './app.components';

export const routes: Routes = [
  {
    path: 'todos',
    component: TodosComponent,
    children: [
      { path: '', component: TodosListComponent },
      { path: ':id', component: TodoDetailComponent },
    ],
  },
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
];
