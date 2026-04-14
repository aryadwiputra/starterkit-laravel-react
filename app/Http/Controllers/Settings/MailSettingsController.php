<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SendTestEmailRequest;
use App\Http\Requests\Settings\UpdateMailSettingsRequest;
use App\Mail\SettingsTestMail;
use App\Services\SettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class MailSettingsController extends Controller
{
    /**
     * Show the mail settings page.
     */
    public function edit(Request $request): Response
    {
        abort_unless($request->user()?->can('settings.mail.manage'), 403);

        return Inertia::render('settings/mail', [
            'settings' => [
                'default' => settings('mail.default', config('mail.default')),
                'from_address' => settings('mail.from.address', config('mail.from.address')),
                'from_name' => settings('mail.from.name', config('mail.from.name')),

                // SMTP (non-secret)
                'smtp_scheme' => settings('mail.smtp.scheme', config('mail.mailers.smtp.scheme')),
                'smtp_host' => settings('mail.smtp.host', config('mail.mailers.smtp.host')),
                'smtp_port' => settings('mail.smtp.port', config('mail.mailers.smtp.port')),
                'smtp_username' => settings('mail.smtp.username', config('mail.mailers.smtp.username')),
                'has_smtp_password' => (bool) settings('mail.smtp.password'),

                // Mailgun (non-secret)
                'mailgun_domain' => settings('mail.mailgun.domain', config('services.mailgun.domain')),
                'mailgun_endpoint' => settings('mail.mailgun.endpoint', config('services.mailgun.endpoint')),
                'has_mailgun_secret' => (bool) settings('mail.mailgun.secret'),

                // SES (non-secret)
                'ses_region' => settings('mail.ses.region', config('services.ses.region')),
                'has_ses_key' => (bool) settings('mail.ses.key'),
                'has_ses_secret' => (bool) settings('mail.ses.secret'),

                // Resend/Postmark (secret only)
                'has_resend_key' => (bool) settings('mail.resend.key'),
                'has_postmark_key' => (bool) settings('mail.postmark.key'),
            ],
        ]);
    }

    /**
     * Update mail settings.
     */
    public function update(UpdateMailSettingsRequest $request, SettingsService $settings): RedirectResponse
    {
        $settings->set('mail.default', $request->validated('default'), 'string');
        $settings->set('mail.from.address', $request->validated('from_address'), 'string');
        $settings->set('mail.from.name', $request->validated('from_name'), 'string');

        // SMTP
        $settings->set('mail.smtp.scheme', $request->validated('smtp_scheme'), 'string');
        $settings->set('mail.smtp.host', $request->validated('smtp_host'), 'string');
        $settings->set('mail.smtp.port', $request->validated('smtp_port'), 'int');
        $settings->set('mail.smtp.username', $request->validated('smtp_username'), 'string');

        $smtpPassword = $request->validated('smtp_password');
        if (is_string($smtpPassword) && $smtpPassword !== '') {
            $settings->set('mail.smtp.password', $smtpPassword, 'string', encrypted: true);
        }

        // Mailgun
        $settings->set('mail.mailgun.domain', $request->validated('mailgun_domain'), 'string');
        $settings->set('mail.mailgun.endpoint', $request->validated('mailgun_endpoint'), 'string');

        $mailgunSecret = $request->validated('mailgun_secret');
        if (is_string($mailgunSecret) && $mailgunSecret !== '') {
            $settings->set('mail.mailgun.secret', $mailgunSecret, 'string', encrypted: true);
        }

        // SES
        $settings->set('mail.ses.region', $request->validated('ses_region'), 'string');

        $sesKey = $request->validated('ses_key');
        if (is_string($sesKey) && $sesKey !== '') {
            $settings->set('mail.ses.key', $sesKey, 'string', encrypted: true);
        }

        $sesSecret = $request->validated('ses_secret');
        if (is_string($sesSecret) && $sesSecret !== '') {
            $settings->set('mail.ses.secret', $sesSecret, 'string', encrypted: true);
        }

        // Resend/Postmark
        $resendKey = $request->validated('resend_key');
        if (is_string($resendKey) && $resendKey !== '') {
            $settings->set('mail.resend.key', $resendKey, 'string', encrypted: true);
        }

        $postmarkKey = $request->validated('postmark_key');
        if (is_string($postmarkKey) && $postmarkKey !== '') {
            $settings->set('mail.postmark.key', $postmarkKey, 'string', encrypted: true);
        }

        app('mail.manager')->forgetMailers();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.toast.mail_updated')]);

        return back();
    }

    /**
     * Send a test email.
     */
    public function test(SendTestEmailRequest $request): RedirectResponse
    {
        try {
            Mail::to($request->validated('to'))->send(new SettingsTestMail);
        } catch (\Throwable $e) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('settings.toast.mail_test_failed', ['message' => $e->getMessage()])]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.toast.mail_test_sent')]);

        return back();
    }
}
