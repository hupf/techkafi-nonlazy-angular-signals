---
# You can also start simply with 'default'
theme: apple-basic
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Look ma', Angular Signals aren't lazy!
# info: |
#   ## Slidev Starter Template
#   Presentation slides for developers.

#   Learn more at [Sli.dev](https://sli.dev)
# apply unocss classes to the current slide
# class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
layout: intro
---

# Look ma',<br>Angular Signals<br>aren't lazy!

<div class="absolute bottom-10">
  <span class="font-700">
    Tech Kafi 19.03.2025<br>
    Mathis Hofer, Puzzle ITC
  </span>
</div>

---
transition: slide-left
level: 1
---

# Agenda

- Signals vs. observables recap
- On data fetching and lazyness
- Angular v19 resource API
- Impact on architecture

---
transition: slide-up
level: 1
layout: section
---

# Signals vs. observables recap

---
transition: slide-up
level: 2
---

<div class="grid gap-4 grid-cols-2">

# What are signals?
# What are observables?

</div>

<div class="grid gap-4 grid-cols-2">
<div>

- Reactive primitive that represents a value

</div>
<div>

- Reactive primitive that represents values over time (events)

</div>
</div>

<div class="grid gap-4 grid-cols-2">
<div>

- Always has a value

</div>
<div>

- Can have no value emitted yet, can emit multiple values, can cache values, can emit a single value & terminate etc.

</div>
</div>

<div class="grid gap-4 grid-cols-2">
<div>

- Read current value (anytime, synchronously)

</div>
<div>

- Subscribe to get value (asynchronously)

</div>
</div>

<div class="grid gap-4 grid-cols-2">
<div>

- No visible subscriptions → implicitly managed

</div>
<div>

- Explicit `name$.subscribe(...)` or implicit `name$ | async` subscribe/unsubscribe

</div>
</div>

<div class="grid gap-4 grid-cols-2">
<div>

- Write/update current value

</div>
<div>

- Emit new value

</div>
</div>

---
transition: slide-up
level: 2
---

<div class="grid gap-4 grid-cols-2">
<div>

# Signal

```ts
name = signal("Jane");
```

</div>
<div>

# Observable

```ts
name$ = new BehaviorSubject("Jane");
```

</div>
</div>

<div class="grid gap-4 grid-cols-2">
<div>

Read value:

```html
Hi {{ name() }}!
```

```ts
const greeting = `Hi ${this.name()}!`;
// ...
```

</div>
<div>

Read value(s):

```html
Hi {{ name$ | async }}!
```

```ts
// ⚠️ BehaviorSubject-only!
const greeting = `Hi ${this.name$.getValue()}!`;
```

```ts
this.name$
  .pipe(take(1))
  .subscribe((name) => {
    const greeting = `Hi ${name}!`;
    // ...
  });
```

</div>
</div>

<div class="grid gap-4 grid-cols-2">
<div>

Write/update value
```ts
this.name.set("John");
this.name.update(value => `${value}!`);
```

</div>
<div>

Emit value:
```ts
this.name$.next("John");
```

</div>
</div>

---
transition: slide-up
level: 2
---

<div class="grid gap-4 grid-cols-2">
<div>

# Signal

Computed (derived signal):

```ts
firstName = signal("Jane");
lastName = signal("Doe");

fullName = computed(
  () => `${this.firstName()} ${this.lastName()}`
);
```

```html
{{ fullName() }}
```

```ts
console.log(this.fullName());
```

</div>
<div>

# Observable

Derived observable:

```ts
firstName$ = new BehaviorSubject("Jane");
lastName$ = new BehaviorSubject("Doe");

fullName$ = combineLatest([
  this.firstName$,
  this.lastName$
])
  .pipe(
    map(
      ([firstName, lastName]) =>
        `${firstName} ${lastName}`
    )
  );
```

```html
{{ fullName$ | async }}
```

```ts
this.fullName$.getValue(); // 🛑 Doesn't work...

this.fullName$
  .pipe(take(1)) // ⚠️ Beware of leaks!
  .subscribe((fullName) => console.log(fullName));
```

</div>
</div>

---
transition: slide-up
level: 2
layout: quote
---

# Signals are way simpler and have nicer ergonomics.

---
transition: slide-up
level: 2
layout: quote
---

# Signals are designed to handle synchronous state. Every signal has a well defined concept of its current value.

<small>Source: [Angular Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120)</small>

---
transition: slide-up
level: 2
layout: quote
---

# (...) However, not all state in applications is synchronous. Data must be fetched from backends, loaded from async APIs in the browser, or polled from user input that doesn't happen instantaneously.

<small>Source: [Angular Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120)</small>

---
transition: slide-left
level: 2
layout: quote
---

# Ultimately, the state shown to the user must be synchronous – the UI must show something at any given moment, even if the requested data is not yet available or if the request fails.

<small>Source: [Angular Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120)</small>

---
transition: slide-up
level: 1
layout: section
---

# On data fetching and lazyness

---
transition: slide-up
level: 2
---

# Data fetching with observables

```ts
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
```

```html
@let todo = todo$ | async;
@if (!todo) {
  <p>Loading...</p>
} @else {
  <h1>{{ todo.title }}</h1>
}
```

---
transition: fade
level: 2
---

# Data fetching with signals?

```ts
export class ToSignalComponent {
  http = inject(HttpClient);
  id = input.required<number>();
  todo: Signal<{ id: number; title: string }> = // ?
}
```

---
transition: fade
level: 2
---

# Data fetching with signals?

```ts
export class ToSignalComponent {
  http = inject(HttpClient);
  id = input.required<number>();
  todo = computed(() =>
    // 🛑 Apparently, there is no "async computed" that
    // can flatten a promise or an observable...
    this.http.get<{ id: number; title: string }>(
      `https://jsonplaceholder.typicode.com/todos/${this.id()}`,
    )
  );
}
```


---
transition: slide-up
level: 2
---

# Data fetching with signals?

```ts
export class ToSignalComponent {
  http = inject(HttpClient);
  id = input.required<number>();
  todo = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.http.get<{ id: number; title: string }>(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
        ),
      ),
    ),
    { initialValue: null },
  );
}
```

```html
@let entry = todo();
@if (!entry) {
  <p>Loading...</p>
} @else {
  <h1>{{ entry.title }}</h1>
}
```

<!--
Interop: https://angular.dev/ecosystem/rxjs-interop
-->

---
transition: fade
level: 2
---

# But what about lazyness?

With observables:

```ts
export class ObservableLazyComponent {
  http = inject(HttpClient);
  show = signal(false);
  todos$ = this.http.get<ReadonlyArray<{ id: number; title: string }>>(
    'https://jsonplaceholder.typicode.com/todos',
  );
  toggle() {
    this.show.update((v) => !v);
  }
}
```

```html
<button (click)="toggle()">Toggle</button>
@if (show()) {
  <ul>
    @for (todo of todos$ | async; track todo.id) {
      <li>{{ todo.title }}</li>
    }
  </ul>
}
```

---
transition: slide-up
level: 2
---

# But what about lazyness?

With signals:

```ts
export class ToSignalLazyComponent {
  http = inject(HttpClient);
  show = signal(false);
  todos = toSignal(
    this.http.get<ReadonlyArray<{ id: number; title: string }>>(
      'https://jsonplaceholder.typicode.com/todos',
    ),
    { initialValue: [] },
  );
  toggle() {
    this.show.update((v) => !v);
  }
}
```

```html
<button (click)="toggle()">Toggle</button>
@if (show()) {
  <ul>
    @for (todo of todos(); track todo.id) {
      <li>{{ todo.title }}</li>
    }
  </ul>
}
```

---
transition: slide-up
level: 2
layout: bullets
---

# Lazyness observations

- `toSignal` immediately subscribes to observable, making it "hot"
- `toSignal` creates a subscription that is alive as long as the component/service is alive.
- `toLazySignal` (unofficial):

> This function works almost like the original `toSignal()` from Angular core (and uses it), but the subscription will be created not instantly - only when the resulting signal is read for the first time.

https://ngxtension.netlify.app/utilities/signals/to-lazy-signal/

---
transition: slide-up
level: 2
layout: quote
---

# Are we on the right track?

---
transition: slide-up
level: 1
layout: section
---

# Angular v19 resource API<sup>*</sup>

<sup>*</sup>Experimental

[Angular Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120) \
[Angular Resource RFC 2: APIs](https://github.com/angular/angular/discussions/60121)

---
transition: slide-up
level: 2
layout: quote
---

# A resource is a declarative dependency on an asynchronous data source, expressed through signals. Resources bridge the synchronous world of signals with operations that take time (...). You can think of them as a form of asynchronous computed.

<small>Source: [Angular Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120)</small>

---
transition: slide-up
level: 2
layout: quote
---

# The Angular team sees resources and Observables as serving fundamentally different purposes and use cases. Observables work best when used to model _events over time_, while resource is concerned with asynchronously derived state.

<small>Source: [Angular Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120)</small>

---
transition: slide-up
level: 2
---

# The `resource` constructor

```ts
function resource<T, R>({
  request?: (() => R) | undefined;
  loader: (param: ResourceLoaderParams<R>) => PromiseLike<T>;
  defaultValue?: T | undefined;
  equal?: ValueEqualityFn<T> | undefined;
  injector?: Injector | undefined;
}): ResourceRef<T | undefined>;
```

https://angular.dev/api/core/resource

---
transition: slide-up
level: 2
---

# ResourceRef

```ts
interface ResourceRef<T> {
  readonly value: Signal<T>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<unknown>;
  readonly isLoading: Signal<boolean>;
  hasValue(): boolean;
  reload(): boolean;
}

enum ResourceStatus {
  Idle,
  Error,
  Loading,
  Reloading,
  Resolved,
  Local,
}
```

https://angular.dev/api/core/ResourceRef

---
transition: fade
level: 2
---

# Example: resource

```ts
id = signal(1);
todo = resource({
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
```

---
transition: slide-up
level: 2
---

# Example: resource (rendering)

```html
@if (todo.isLoading()) {
  <p>Loading...</p>
} @else if (todo.error()) {
  <p>Error: {{ $any(todo.error())?.status }}</p>
} @else {
  <h1>{{ todo.value()?.title }}</h1>
}
```

---
transition: slide-up
level: 2
---

# Example: rxResource

```ts
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
```

https://angular.dev/api/core/rxjs-interop/rxResource

---
transition: slide-up
level: 2
---

# Example: httpResource

```ts
id = signal(1);
todo = httpResource<{
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}>(() => `https://jsonplaceholder.typicode.com/todos/${this.id()}`);
```

https://angular.dev/api/common/http/httpResource

---
transition: slide-up
level: 2
---

# Example: httpResource with Zod

```ts
const Todo = zod.object({
  id: zod.number(),
  title: zod.string(),
  completed: zod.boolean(),
  userId: zod.number(),
});
```

```ts
id = signal(1);
todo = httpResource(
  () => `https://jsonplaceholder.typicode.com/todos/${this.id()}`,
  {parse: Todo.parse}
);
```

---
transition: slide-up
level: 2
---

# But, resources are not lazy!

<style>
  div {
    max-height: 25vh;
  }
</style>

`lazyResource` POC that loads when `value` is first read:

<div class="font-size-1 overflow-y-auto">

```ts
/**
 * Creates a lazy `Resource`, that defers the loading of the data
 * until the Resource's value is read. Otherwise, it has the same API
 * and behavior as `resource` construction function.
 */
function lazyResource<T, R>(
  options: ResourceOptions<T, R>
): ResourceRef<T | undefined> {
  const { request, loader, equal, ...rest } = options;

  // Whether the resource's `value` signal has already been read
  const read = signal(false);

  // Wrap the request function to include the `read` value and cause a
  // loader call whenever it changes.
  const wrappedRequest = computed(() => ({
    read: read(),
    param: request && request(),
  })) as () => { read: boolean; param: R };

  // Wrap the loader function to only call it lazy, after the first
  // time the `value` signal has been read.
  const wrappedLoader: ResourceLoader<
    T | undefined,
    { read: boolean; param: R }
  > = async ({ request, ...rest }) => {
    const { read, param } = request;
    if (!read) return undefined;
    return await loader({
      request: param as Exclude<NoInfer<R>, undefined>,
      ...rest,
    });
  };

  const resourceRef = resource<T | undefined, { read: boolean; param: R }>({
    request: wrappedRequest,
    loader: wrappedLoader,
    ...rest,
  } as ResourceOptions<T | undefined, { read: boolean; param: R }>);

  const wrappedValue: WritableSignal<T | undefined> = Object.assign(() => {
    if (!read()) {
      // Trigger the (lazy-)loading of the data by marking the value
      // as "read". Since we're not allowed to update signals when the
      // value is read in a `computed` or `effect` execution context,
      // we write the signal in a new task as a workaround
      setTimeout(() => read.set(true));
    }
    return resourceRef.value();
  }, resourceRef.value);

  return {
    ...resourceRef,
    value: wrappedValue,
  };
}
```

</div>

https://stackblitz.com/edit/stackblitz-starters-enhbj8gu?file=src%2Fmain.ts \
https://gist.github.com/hupf/55451101dcc9451b39e60d43c724b258

---
transition: slide-up
level: 1
layout: section
---

# Impact on architecture

---
transition: slide-up
level: 2
---

# UI-driven data fetching

> (...) In particular, we want to discourage architectures that use rendering to drive data fetching (that is, wait until data is requested from the UI before fetching it). In our experience, such architectures offer poor UX behavior, such as empty content while loading and the potential for waterfalling loads.<br>Our intention is to encourage architectures which lift data fetching higher up in the application stack, ideally at the level of routes or route pages. \
> — Alex Rickabaugh (Angular Core Team Member)

<small>[Source](https://github.com/angular/angular/issues/58422#issuecomment-2452307269)</small>

---
transition: slide-up
level: 2
---

# Lift data fetching higher up

> Today, often Angular components are "in charge" of data fetching operations. Requests are frequently made as late as possible, only initiated when the UI (via the async pipe) requests data via a subscription to an Observable or other source. \
> (...) \
> With resources, we intend to explore architectural **solutions where data fetching can be lifted outside of components** and managed by the framework itself, whether at the level of routes or through some other mechanism. We see this as having some attractive benefits:
> - A higher-level mechanism can understand data needs from an entire component tree and fetch all the data at once / in parallel, avoiding waterfalls.
> - Reasoning about the state in an application becomes easier when UI components do not concern themselves with data fetching and focus on data derivation instead.
> - Testing gets easier as UI component tests can focus on the display logic.

<small>Source: [Angular Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120)</small>

---
transition: slide-left
level: 2
---

# 🤔 ...okay, what does that mean?

- Resources are a great signal-based bridge between the async & sync worlds
- Avoid "waterfalls", fetch data "higher up" \
  → Container vs. presentational components \
  → Pure core, imperative shell
- Not all data fetching should be moved outside of the component
- Resource-based data fetching is the future will probably be integrated in the router and `@defer` etc.

---
transition: slide-up
level: 1
---

# Thanks. Questions?

These slides are licensed under the terms of the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.

Slides: \
[hupf.github.io/techkafi-nonlazy-angular-signals](https://hupf.github.io/techkafi-nonlazy-angular-signals/) ([Source](https://github.com/hupf/techkafi-nonlazy-angular-signals))

[Examples](https://github.com/hupf/techkafi-nonlazy-angular-signals/tree/main/examples/data-fetching/src/components)

<PoweredBySlidev mt-10 />
