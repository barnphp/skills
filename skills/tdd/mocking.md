# Mocking in Pest / Laravel

## Default: Don't Mock

Prefer real implementations over mocks. Laravel's in-memory SQLite, `Queue::fake()`, `Mail::fake()`, `Event::fake()`, and `Storage::fake()` give you isolation without fake objects that drift from real behavior.

**Mock only when:**
- The dependency is an external HTTP API (use `Http::fake()`)
- The dependency is expensive or non-deterministic (time, randomness)
- The real implementation has side effects you genuinely cannot run in tests (sending real SMS, charging real cards)

## Laravel Fakes (preferred)

Always prefer Laravel's built-in fakes over writing manual mocks.

```php
// Queue
Queue::fake();
Queue::assertPushed(SendWelcomeEmail::class);
Queue::assertNotPushed(AnotherJob::class);

// Mail
Mail::fake();
Mail::assertSent(WelcomeMail::class, fn ($mail) => $mail->hasTo('john@example.com'));

// Notifications
Notification::fake();
Notification::assertSentTo($user, VerifyEmailNotification::class);

// Storage
Storage::fake('public');
Storage::disk('public')->assertExists('avatars/1.jpg');

// HTTP client
Http::fake([
    'api.stripe.com/*' => Http::response(['id' => 'ch_123'], 200),
]);
```

## Mockery (for class dependencies)

When you genuinely need to mock a class dependency (e.g. a third-party SDK injected via the service container), use Mockery:

```php
use Mockery;
use App\Services\StripeClient;

it('handles a failed payment gracefully', function () {
    $stripe = Mockery::mock(StripeClient::class);
    $stripe->shouldReceive('charge')
        ->once()
        ->andThrow(new \Exception('Card declined'));

    $this->app->instance(StripeClient::class, $stripe);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/checkout', ['amount' => 1000])
        ->assertUnprocessable();
});
```

## Time

Use Laravel's `travelTo()` for time-sensitive tests:

```php
it('marks a subscription as expired after 30 days', function () {
    $subscription = Subscription::factory()->create([
        'expires_at' => now()->addDays(30),
    ]);

    $this->travelTo(now()->addDays(31));

    expect($subscription->fresh()->isExpired())->toBeTrue();
});
```

## Warning Signs

- You're mocking an Eloquent model — this is almost always wrong. Use a factory instead.
- You're mocking a class you own — consider whether the design is wrong, not the test.
- Your mock setup is longer than your assertion — the test is probably testing the wrong thing.
