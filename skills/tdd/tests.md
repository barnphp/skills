# Tests Reference

## Feature Tests (most common)

Feature tests exercise the full Laravel stack through HTTP. They are the default for any behavior that has a route.

```php
// tests/Feature/Posts/CreatePostTest.php

use App\Models\User;

it('allows authenticated users to create a post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/posts', [
            'title' => 'Hello World',
            'body'  => 'My first post.',
        ]);

    $response->assertCreated()
        ->assertJsonPath('data.title', 'Hello World');

    $this->assertDatabaseHas('posts', [
        'title'   => 'Hello World',
        'user_id' => $user->id,
    ]);
});

it('rejects unauthenticated requests', function () {
    $response = $this->postJson('/api/posts', [
        'title' => 'Hello World',
        'body'  => 'Content.',
    ]);

    $response->assertUnauthorized();
});

it('validates required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/posts', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'body']);
});
```

## Unit Tests

Unit tests exercise a single class in isolation without booting Laravel. Use for Actions with complex logic, value objects, or pure functions.

```php
// tests/Unit/Actions/CreatePostActionTest.php

use App\Actions\CreatePostAction;
use App\Models\Post;
use App\Models\User;

it('creates a post and returns it', function () {
    $user  = User::factory()->create();
    $action = new CreatePostAction();

    $post = $action->handle($user, 'Hello World', 'My first post.');

    expect($post)
        ->toBeInstanceOf(Post::class)
        ->title->toBe('Hello World')
        ->user_id->toBe($user->id);
});
```

## Pest Datasets

Use datasets to test the same behavior across multiple inputs without duplicating tests.

```php
it('rejects invalid titles', function (string $title) {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/posts', ['title' => $title, 'body' => 'Content.'])
        ->assertUnprocessable();
})->with([
    'empty string'     => [''],
    'too long'         => [str_repeat('a', 256)],
    'only whitespace'  => ['   '],
]);
```

## Asserting Jobs Were Dispatched

```php
use App\Jobs\SendWelcomeEmail;
use Illuminate\Support\Facades\Queue;

it('dispatches a welcome email on registration', function () {
    Queue::fake();

    $this->postJson('/api/register', [
        'name'     => 'John',
        'email'    => 'john@example.com',
        'password' => 'password',
    ])->assertCreated();

    Queue::assertPushed(SendWelcomeEmail::class);
});
```

## Asserting Events Were Dispatched

```php
use App\Events\PostPublished;
use Illuminate\Support\Facades\Event;

it('fires a PostPublished event', function () {
    Event::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/posts', ['title' => 'Hello', 'body' => 'World.'])
        ->assertCreated();

    Event::assertDispatched(PostPublished::class);
});
```

## Test Naming Convention

Test names should read as plain-English specifications:

```php
// Good — describes behavior
it('prevents guests from viewing private posts');
it('returns 404 for posts that do not exist');
it('dispatches a notification job when a comment is posted');

// Bad — describes implementation
it('calls the PostRepository find method');
it('sets the post status to published');
```
