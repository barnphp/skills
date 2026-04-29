# Refactoring After Green

Refactor only when all tests are passing. Never refactor while RED.

## Laravel-Specific Refactor Candidates

### Fat Controller → Action

If a controller method is longer than ~20 lines or contains business logic, extract it:

```php
// Before: logic in controller
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([...]);
    $user = auth()->user();
    $post = new Post();
    $post->title = $validated['title'];
    $post->body = $validated['body'];
    $post->user_id = $user->id;
    $post->slug = Str::slug($validated['title']);
    $post->save();
    $user->incrementPostCount();
    event(new PostCreated($post));
    return response()->json(new PostResource($post), 201);
}

// After: controller delegates to Action
public function __invoke(StorePostRequest $request, CreatePostAction $action): JsonResponse
{
    $post = $action->handle(auth()->user(), $request->validated());
    return response()->json(new PostResource($post), 201);
}
```

The feature test passes before and after this refactor — that's the signal the refactor is safe.

### Logic in Model → Action or Scope

Models should own relationships, scopes, casts, and accessors. Business logic belongs in Actions.

```php
// Before: logic in Model method
public function publish(User $approver): void
{
    $this->status = 'published';
    $this->published_at = now();
    $this->approved_by = $approver->id;
    $this->save();
    Notification::send($this->author, new PostPublishedNotification($this));
    event(new PostPublished($this));
}

// After: logic in Action, Model stays clean
// App\Actions\PublishPostAction
public function handle(Post $post, User $approver): Post
{
    $post->update([
        'status'       => 'published',
        'published_at' => now(),
        'approved_by'  => $approver->id,
    ]);
    Notification::send($post->author, new PostPublishedNotification($post));
    event(new PostPublished($post));
    return $post;
}
```

### Inline Validation → Form Request

If `$request->validate([...])` appears in a controller, move it to a Form Request:

```bash
php artisan make:request StorePostRequest
```

### Repeated Query Logic → Scope

```php
// Before: repeated in multiple places
Post::where('status', 'published')->where('published_at', '<=', now())->get();

// After: Eloquent scope
// Model
public function scopePublished(Builder $query): void
{
    $query->where('status', 'published')->where('published_at', '<=', now());
}

// Usage
Post::published()->get();
```

## Checklist Before Calling Done

- [ ] `composer check` passes (Pest + Pint + PHPStan + Rector)
- [ ] No business logic left in controllers
- [ ] No business logic left in Models
- [ ] Form Requests handle all validation
- [ ] Jobs are used for anything that should be queued
- [ ] Test names still read as plain-English specifications
