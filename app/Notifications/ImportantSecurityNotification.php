<?php

namespace App\Notifications;

use App\Notifications\Channels\SlackWebhookChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ImportantSecurityNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly string $title,
        public readonly string $body,
        public readonly ?string $url = null,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail', SlackWebhookChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->title)
            ->line($this->body)
            ->action($this->title, $this->url ?? url('/'));
    }

    /**
     * @return array<string, mixed>
     */
    public function toSlackWebhook(object $notifiable): array
    {
        return [
            'text' => $this->title."\n".$this->body.($this->url ? "\n".$this->url : ''),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'body' => $this->body,
            'url' => $this->url,
        ];
    }
}
