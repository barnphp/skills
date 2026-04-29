# Browser Testing (Pest v4)

Pest v4 includes first-class browser testing support. Use browser tests for:

- Livewire component interactions
- Multi-step wizard flows
- JavaScript-driven UI behavior
- File uploads through the UI
- Flows that cannot be replicated through the HTTP layer

**Do not use browser tests for things that can be tested with feature tests.** Browser tests are slower and harder to debug.

## Setup

Browser testing requires Laravel Dusk configured in the project:

```bash
composer require --dev laravel/dusk
php artisan dusk:install
```

## Basic Browser Test

```php
// tests/Browser/ContactFormTest.php

use Laravel\Dusk\Browser;

it('allows a user to submit the contact form', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/contact')
            ->type('name', 'John Doe')
            ->type('email', 'john@example.com')
            ->type('message', 'Hello!')
            ->press('Send Message')
            ->waitForText('Thank you for your message')
            ->assertSee('Thank you for your message');
    });
});
```

## Livewire Component Testing

For Livewire components, prefer Livewire's own testing helpers over browser tests when the component behavior doesn't require a real browser:

```php
use Livewire\Livewire;
use App\Livewire\CreatePost;

it('creates a post via the Livewire form', function () {
    $user = User::factory()->create();

    Livewire::actingAs($user)
        ->test(CreatePost::class)
        ->set('title', 'Hello World')
        ->set('body', 'My first post.')
        ->call('save')
        ->assertRedirect('/posts');

    $this->assertDatabaseHas('posts', ['title' => 'Hello World']);
});
```

Use a browser test for the same component only when you need to verify real-time validation, Alpine.js transitions, or browser-native behavior (drag-and-drop, file pickers, etc.).

## Authentication in Browser Tests

```php
it('shows the dashboard to authenticated users', function () {
    $user = User::factory()->create();

    $this->browse(function (Browser $browser) use ($user) {
        $browser->loginAs($user)
            ->visit('/dashboard')
            ->assertSee('Welcome back');
    });
});
```

## Waiting for Async Operations

```php
$browser->press('Submit')
    ->waitForText('Saved successfully', 5) // wait up to 5 seconds
    ->assertSee('Saved successfully');

// Wait for an element to appear
$browser->waitFor('.success-banner')
    ->assertVisible('.success-banner');

// Wait for a Livewire update
$browser->waitForLivewire()
    ->assertSee('Updated');
```

## When to Escalate from Feature Test to Browser Test

| Scenario | Feature test | Browser test |
|---|---|---|
| JSON API endpoint | Yes | No |
| Form submission (no JS) | Yes | No |
| Livewire component logic | Yes (Livewire helper) | No |
| Livewire Alpine.js interaction | No | Yes |
| Multi-step wizard with state | Depends | Yes |
| File upload via UI | No | Yes |
| Real-time validation feedback | No | Yes |
