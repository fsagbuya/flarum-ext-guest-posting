<?php

namespace Alter\GuestPosting;

use Flarum\Api\Endpoint\Create;
use Flarum\Api\Resource\DiscussionResource;
use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Resource\PostResource;
use Flarum\Api\Schema;
use Flarum\Extend;
use Flarum\Post\Post;
use Flarum\User\Event\Saving;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Middleware('forum'))
        ->add(GuestSessionMiddleware::class),

    (new Extend\Middleware('api'))
        ->add(GuestSessionMiddleware::class),

    (new Extend\Formatter)
        ->configure(Formatter\ConfigureMentions::class)
        ->render(Formatter\FormatPostMentions::class),

    (new Extend\ApiResource(ForumResource::class))
        ->fields(ForumAttributes::class),

    (new Extend\ApiResource(DiscussionResource::class))
        ->fields(fn () => [
            Schema\Str::make('guest_username')
                ->nullable(),
        ])
        ->endpoint(Create::class, fn (Create $endpoint) => $endpoint->authenticated(false)),

    (new Extend\ApiResource(PostResource::class))
        ->fields(fn () => [
            Schema\Str::make('guest_username')
                ->nullable(),
        ])
        ->endpoint(Create::class, fn (Create $endpoint) => $endpoint->authenticated(false)),

    (new Extend\ServiceProvider())
        ->register(Providers\SaveDiscussionPost::class),

    (new Extend\Event())
        ->listen(Saving::class, Listeners\SaveUser::class),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\PostPolicy::class),
];
