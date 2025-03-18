import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  provideRouter,
  RouterLink,
  RouterOutlet,
  Routes,
} from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { ObservableComponent } from './components/observable.component';
import { ToSignalComponent } from './components/to-signal.component';
import { ResourceComponent } from './components/resource.component';
import { HttpResourceComponent } from './components/http-resource.component';
import { RxResourceComponent } from './components/rx-resource.component';
import { ObservableLazyComponent } from './components/observable-lazy.component';
import { ToSignalLazyComponent } from './components/to-signal-lazy.component';

const routes: Routes = [
  { path: 'observable-lazy', component: ObservableLazyComponent },
  { path: 'to-signal-lazy', component: ToSignalLazyComponent },
  { path: 'observable', component: ObservableComponent },
  { path: 'to-signal', component: ToSignalComponent },
  { path: 'resource', component: ResourceComponent },
  { path: 'http-resource', component: HttpResourceComponent },
  { path: 'rx-resource', component: RxResourceComponent },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav style="display: flex; gap: 1rem; margin-bottom: 5rem;">
      @for (route of routes; track route) {
        <a [routerLink]="route.path">{{ route.path }}</a>
      }
    </nav>
    <router-outlet></router-outlet>
  `,
})
class App {
  routes = routes;
}

bootstrapApplication(App, {
  providers: [provideHttpClient(), provideRouter(routes)],
});
