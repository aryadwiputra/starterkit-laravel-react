<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMailSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('settings.mail.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $default = (string) $this->input('default', '');

        $hasMailgunSecret = (bool) (settings('mail.mailgun.secret') ?: config('services.mailgun.secret'));
        $hasSesKey = (bool) (settings('mail.ses.key') ?: config('services.ses.key'));
        $hasSesSecret = (bool) (settings('mail.ses.secret') ?: config('services.ses.secret'));
        $hasResendKey = (bool) (settings('mail.resend.key') ?: config('services.resend.key'));
        $hasPostmarkKey = (bool) (settings('mail.postmark.key') ?: config('services.postmark.key'));

        return [
            'default' => ['required', 'string', Rule::in(['smtp', 'mailgun', 'ses', 'resend', 'postmark', 'log'])],
            'from_address' => ['nullable', 'string', 'email', 'max:255'],
            'from_name' => ['nullable', 'string', 'max:255'],

            // SMTP
            'smtp_scheme' => ['nullable', 'string', Rule::in(['smtp', 'smtps'])],
            'smtp_host' => [$default === 'smtp' && ! config('mail.mailers.smtp.host') ? 'required' : 'nullable', 'string', 'max:255'],
            'smtp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string', 'max:255'],

            // Mailgun
            'mailgun_domain' => [$default === 'mailgun' && ! config('services.mailgun.domain') ? 'required' : 'nullable', 'string', 'max:255'],
            'mailgun_secret' => [
                $default === 'mailgun' && ! $hasMailgunSecret ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'mailgun_endpoint' => ['nullable', 'string', 'max:255'],

            // SES
            'ses_key' => [
                $default === 'ses' && ! $hasSesKey ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'ses_secret' => [
                $default === 'ses' && ! $hasSesSecret ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'ses_region' => [$default === 'ses' && ! config('services.ses.region') ? 'required' : 'nullable', 'string', 'max:255'],

            // Resend
            'resend_key' => [
                $default === 'resend' && ! $hasResendKey ? 'required' : 'nullable',
                'string',
                'max:255',
            ],

            // Postmark
            'postmark_key' => [
                $default === 'postmark' && ! $hasPostmarkKey ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}
