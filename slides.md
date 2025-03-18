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

- Signals & observables recap
- On data fetching and lazyness
- Impact on architecture
- Angular v19 resource API

---
transition: slide-up
level: 1
layout: section
---

# Signals & observables recap

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

# Fetching data with observables

```ts
const http = inject(HttpClient);
function getArticles(): Observable<ReadonlyArray<Article>> {
  return http.get("/articles");
}

const articles$ = getArticles();
// No request is sent yet...

articles$.subscribe((articles) => console.log(articles)); // Triggers the request lazily
```

Or in template:
 
```html
@if (show()) {
  @for (article of articles$ | async; track article.id) {
    {{ article.title }}
  }
} else {
  <button (click)="show.set(true)">Show articles</button>
}
```

---
transition: slide-up
level: 2
---

# Fetching data with signals?

```ts
function getArticles(): Signal<ReadonlyArray<Article> | undefined> {
  const result = signal(undefined);

  fetch("/articles")
    .then((res) => result.set(res.json()))

  return result;
}

const articles = getArticles();
// Request is already sent

console.log(articles()); // First `undefined`, later the articles from the response
```

---
transition: slide-up
level: 2
---

# Interop

https://angular.dev/ecosystem/rxjs-interop


---
transition: slide-up
level: 2
---

...

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

...

---
transition: slide-up
level: 1
layout: section
---

# Angular v19 resource API

---
transition: slide-up
level: 2
---

...
