# Laravel Architecture Conventions

Detailed refactor patterns for common anti-patterns.

## Fat Controller → Action

A controller's only job is to receive an HTTP request, delegate to an Action, and return a response. If a controller method has business logic, queries, or model saves, extract them.

```php
// Before: fat controller
class PostController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $post = new Post();
        $post->title = $validated['title'];
        $post->body = $validated['body'];
        $post->user_id = auth()->id();
        $post->slug = Str::slug($validated['title']);
        $post->save();

        auth()->user()->increment('post_count');
        event(new PostCreated($post));

        return response()->json(new PostResource($post), 201);
    }
}

// After: thin controller + Form Request + Action
class StorePostController extends Controller
{
    public function __invoke(StorePostRequest $request, CreatePostAction $action): JsonResponse
    {
        $post = $action->handle(auth()->user(), $request->validated());
        return response()->json(new PostResource($post), 201);
    }
}

// app/Http/Requests/StorePostRequest.php
class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ];
    }
}

// app/Actions/CreatePostAction.php
class CreatePostAction
{
    public function handle(User $user, array $data): Post
    {
        $post = $user->posts()->create([
            'title' => $data['title'],
            'body'  => $data['body'],
            'slug'  => Str::slug($data['title']),
        ]);

        $user->increment('post_count');
        event(new PostCreated($post));

        return $post;
    }
}
```

## Logic in Model → Action

Models own relationships, scopes, casts, and accessors. Business logic (dispatching events, sending notifications, making decisions, calling other services) belongs in Actions.

```php
// Before: logic in Model
class Post extends Model
{
    public function publish(User $approver): void
    {
        $this->update(['status' => 'published', 'published_at' => now()]);
        Notification::send($this->author, new PostPublishedNotification($this));
        event(new PostPublished($this));
    }
}

// After: Model stays clean
class Post extends Model
{
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }
}

// app/Actions/PublishPostAction.php
class PublishPostAction
{
    public function handle(Post $post, User $approver): Post
    {
        $post->update(['status' => 'published', 'published_at' => now()]);
        Notification::send($post->author, new PostPublishedNotification($post));
        event(new PostPublished($post));
        return $post;
    }
}
```

## Missing Form Request → Form Request

Any `$request->validate([...])` inside a controller should become a Form Request.

```bash
php artisan make:request StorePostRequest
```

Also move authorization here when relevant:

```php
public function authorize(): bool
{
    return $this->user()->can('create', Post::class);
}
```

## Missing Policy → Policy

Authorization logic scattered across controllers (or missing entirely) should live in Policies.

```bash
php artisan make:policy PostPolicy --model=Post
```

Register in `AppServiceProvider` or use `Gate::policy()`. Controllers then just call `$this->authorize('update', $post)`.

## N+1 Query → Eager Loading

If a loop accesses a relationship without eager loading, every iteration fires a query.

```php
// Before: N+1
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // fires a query per post
}

// After: eager load
$posts = Post::with('author')->get();
```

For API endpoints, use `whenLoaded()` in Resources to avoid forcing eager loading in unexpected contexts.

## God Job → Focused Jobs + Actions

A Job that does multiple unrelated things should be split. Each Job should have a single clear name that describes what it does.

```php
// Before: god job
class ProcessOrderJob implements ShouldQueue
{
    public function handle(): void
    {
        $this->sendConfirmationEmail();
        $this->updateInventory();
        $this->notifyWarehouse();
        $this->generateInvoice();
    }
}

// After: focused Jobs dispatched from an Action
class FulfillOrderAction
{
    public function handle(Order $order): void
    {
        SendOrderConfirmationJob::dispatch($order);
        UpdateInventoryJob::dispatch($order);
        NotifyWarehouseJob::dispatch($order);
        GenerateInvoiceJob::dispatch($order);
    }
}
```
