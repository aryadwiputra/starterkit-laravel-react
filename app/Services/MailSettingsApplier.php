<?php

namespace App\Services;

class MailSettingsApplier
{
    public function __construct(
        private readonly SettingsService $settings,
    ) {}

    public function apply(): void
    {
        $defaultMailer = $this->settings->get('mail.default');
        $fromAddress = $this->settings->get('mail.from.address');
        $fromName = $this->settings->get('mail.from.name');

        $config = [];

        if (is_string($defaultMailer) && $defaultMailer !== '') {
            $config['mail.default'] = $defaultMailer;
        }

        if (is_string($fromAddress) && $fromAddress !== '') {
            $config['mail.from.address'] = $fromAddress;
        }

        if (is_string($fromName) && $fromName !== '') {
            $config['mail.from.name'] = $fromName;
        }

        $this->applySmtp($config);
        $this->applyMailgun($config);
        $this->applySes($config);
        $this->applyPostmark($config);
        $this->applyResend($config);

        if (! empty($config)) {
            config($config);
        }
    }

    /**
     * @param  array<string, mixed>  $config
     */
    private function applySmtp(array &$config): void
    {
        $host = $this->settings->get('mail.smtp.host');
        $hostEnv = config('mail.mailers.smtp.host');

        if (! is_string($host) || $host === '') {
            $host = $hostEnv;
        }

        if (! is_string($host) || $host === '') {
            return;
        }

        $config['mail.mailers.smtp.transport'] = 'smtp';
        $config['mail.mailers.smtp.host'] = $host;

        $port = $this->settings->get('mail.smtp.port');
        if ($port !== null) {
            $config['mail.mailers.smtp.port'] = (int) $port;
        }

        $scheme = $this->settings->get('mail.smtp.scheme');
        if (is_string($scheme) && $scheme !== '') {
            $config['mail.mailers.smtp.scheme'] = $scheme;
        }

        $username = $this->settings->get('mail.smtp.username');
        if (is_string($username) && $username !== '') {
            $config['mail.mailers.smtp.username'] = $username;
        }

        $password = $this->settings->get('mail.smtp.password');
        if (is_string($password) && $password !== '') {
            $config['mail.mailers.smtp.password'] = $password;
        }
    }

    /**
     * @param  array<string, mixed>  $config
     */
    private function applyMailgun(array &$config): void
    {
        $domain = $this->settings->get('mail.mailgun.domain');
        $secret = $this->settings->get('mail.mailgun.secret');

        $domainEnv = config('services.mailgun.domain');
        $secretEnv = config('services.mailgun.secret');

        if (! is_string($domain) || $domain === '') {
            $domain = $domainEnv;
        }

        if (! is_string($secret) || $secret === '') {
            $secret = $secretEnv;
        }

        if (! is_string($domain) || $domain === '' || ! is_string($secret) || $secret === '') {
            return;
        }

        $config['mail.mailers.mailgun.transport'] = 'mailgun';
        $config['services.mailgun.domain'] = $domain;
        $config['services.mailgun.secret'] = $secret;

        $endpoint = $this->settings->get('mail.mailgun.endpoint');
        if (is_string($endpoint) && $endpoint !== '') {
            $config['services.mailgun.endpoint'] = $endpoint;
        }
    }

    /**
     * @param  array<string, mixed>  $config
     */
    private function applySes(array &$config): void
    {
        $key = $this->settings->get('mail.ses.key');
        $secret = $this->settings->get('mail.ses.secret');
        $region = $this->settings->get('mail.ses.region');

        $keyEnv = config('services.ses.key');
        $secretEnv = config('services.ses.secret');
        $regionEnv = config('services.ses.region');

        if (! is_string($key) || $key === '') {
            $key = $keyEnv;
        }

        if (! is_string($secret) || $secret === '') {
            $secret = $secretEnv;
        }

        if (! is_string($region) || $region === '') {
            $region = $regionEnv;
        }

        if (! is_string($key) || $key === '' || ! is_string($secret) || $secret === '') {
            return;
        }

        $config['mail.mailers.ses.transport'] = 'ses';
        $config['services.ses.key'] = $key;
        $config['services.ses.secret'] = $secret;

        if (is_string($region) && $region !== '') {
            $config['services.ses.region'] = $region;
        }
    }

    /**
     * @param  array<string, mixed>  $config
     */
    private function applyPostmark(array &$config): void
    {
        $key = $this->settings->get('mail.postmark.key');

        if (! is_string($key) || $key === '') {
            $key = config('services.postmark.key');
        }

        if (! is_string($key) || $key === '') {
            return;
        }

        $config['mail.mailers.postmark.transport'] = 'postmark';
        $config['services.postmark.key'] = $key;
    }

    /**
     * @param  array<string, mixed>  $config
     */
    private function applyResend(array &$config): void
    {
        $key = $this->settings->get('mail.resend.key');

        if (! is_string($key) || $key === '') {
            $key = config('services.resend.key');
        }

        if (! is_string($key) || $key === '') {
            return;
        }

        $config['mail.mailers.resend.transport'] = 'resend';
        $config['services.resend.key'] = $key;
    }
}
