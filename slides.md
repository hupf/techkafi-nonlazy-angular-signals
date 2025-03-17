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

# What are signals?

- Reactive primitive that represents a value
- Always has a value
- Read current value (anytime, synchronously)
- Write/update value
- No visible subscriptions → implicitly managed

---
transition: slide-up
level: 2
---

# Signal primitives

Signal constructor:

```ts
const name = signal("Jane");
console.log(`Hi ${name()}!`); // Read
name.set("John"); // Write
```

Computed (derived signal):

```ts
const firstName = signal("Jane");
const lastName = signal("Doe");
const fullName = computed(() => `${firstName() lastName()});
```

Effect:

```ts
const lang = signal(localStorage.setItem("lang") ?? "de");
effect(() => {
  localStorage.setItem("lang", lang());
});
```

---
transition: slide-up
level: 2
---

# What are observables?

- Reactive primitive that represents events or values over time
- Can have no value emitted yet, can emit multiple values, can cache values, can emit a single value & terminate etc.
- Subscribe to observables (asynchronously get values)
- Emit value (on subjects)
- Subscribe/unsubscribe explicitly:
```ts
const unsubscribe = name$.subscribe(...);
unsubscribe()
```
- Subscribe/unsubscribe implicitly in template:

```
name | async
``` 

---
transition: slide-up
level: 2
---

# Observable

The closest thing to a signal:
```ts
const name$ = new BehaviorSubject("Jane");
name$.getValue(); // Get value sync (BehaviorSubject-only)
name$.pipe(take(1)).subscribe((name) => console.log(name)); // Get value async
name$.next("John"); // Emit value
```

Derived observable:
```ts
const firstName$ = new BehaviorSubject("Jane");
const lastName$ = new BehaviorSubject("Doe");
const fullName$ = combineLatest([firstName$, lastName$]).pipe(
  map(([firstName, lastName]) => `${firstName} ${lastName}`)
);
fullName$.getValue(); // Does not work on derived observables!
fullName$.pipe(take(1)).subscribe((fullName) => console.log(fullName)); // Get value async
```

---
transition: slide-up
level: 2
layout: quote
---

# Signals are way simpler and have nicer ergonomics.

---
transition: slide-left
level: 2
---

# Pull vs. push semantics

- Function = pull-based
- Promises = push-based
- Observables = push-based
- Signals = pull/push-based → although the "push" happens outside of the signal

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
