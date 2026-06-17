<?php

namespace Alter\GuestPosting;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;

class ForumAttributes
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(): array
    {
        return [
            Schema\Integer::make('guestPostCount')
                ->get(fn () => GuestManager::postCount())
                ->visible(fn ($model, Context $context) => $context->getActor()->isGuest()
                    && $this->settings->get('guest-posting.enableImport')),
        ];
    }
}
