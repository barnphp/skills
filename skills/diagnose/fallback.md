# Diagnose — Manual Instrumentation Fallback

Use this when `laravel/boost` is not available or its MCP server is not running.

## Install Boost

The preferred path is always to install Boost first:

```bash
composer require laravel/boost --dev
php artisan boost:install --mcp
```

## If Boost Is Unavailable

Use these Laravel-native tools as a fallback in the same order as the main skill's Phase 1.

### Get the last error

Check `storage/logs/laravel.log` for the most recent exception:

```bash
tail -n 100 storage/logs/laravel.log
```

Or use Laravel Telescope if installed: visit `/telescope/exceptions`.

### Inspect the database schema

```bash
php artisan schema:dump
php artisan db:show --table=posts
```

### Inspect live data via Tinker

```bash
php artisan tinker
```

```php
// Check model state
$post = Post::find(1);
$post->toArray();

// Run an Action manually
(new App\Actions\CreatePostAction())->handle(User::first(), 'Test', 'Body');

// Check query output
DB::listen(fn ($q) => dump($q->sql, $q->bindings));
Post::where('status', 'published')->get();
```

### Add targeted log calls

Tag every debug log with a unique prefix so they're easy to remove:

```php
Log::debug('[DEBUG-a4f2] Post status before action', [
    'post_id' => $post->id,
    'status'  => $post->status,
]);
```

Cleanup when done:

```bash
grep -r 'DEBUG-a4f2' app/ resources/
```

### Performance regressions

For slow requests, use Laravel Telescope's query panel or add query logging:

```php
DB::enableQueryLog();
// ... trigger the slow path
dd(DB::getQueryLog());
```

Look for N+1 queries — the same query repeated many times with different IDs is the most common Laravel performance bug.
