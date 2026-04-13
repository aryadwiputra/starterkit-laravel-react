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

        return [
            'default' => ['required', 'string', Rule::in(['smtp', 'mailgun', 'ses', 'resend', 'postmark', 'log'])],
            'from_address' => ['nullable', 'string', 'email', 'max:255'],
            'from_name' => ['nullable', 'string', 'max:255'],

            // SMTP
            'smtp_scheme' => ['nullable', 'string', Rule::in(['smtp', 'smtps'])],
            'smtp_host' => [$default === 'smtp' ? 'required' : 'nullable', 'string', 'max:255'],
            'smtp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string', 'max:255'],

            // Mailgun
            'mailgun_domain' => [$default === 'mailgun' ? 'required' : 'nullable', 'string', 'max:255'],
            'mailgun_secret' => [
                $default === 'mailgun' && ! settings('mail.mailgun.secret') ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'mailgun_endpoint' => ['nullable', 'string', 'max:255'],

            // SES
            'ses_key' => [
                $default === 'ses' && ! settings('mail.ses.key') ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'ses_secret' => [
                $default === 'ses' && ! settings('mail.ses.secret') ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'ses_region' => [$default === 'ses' ? 'required' : 'nullable', 'string', 'max:255'],

            // Resend
            'resend_key' => [
                $default === 'resend' && ! settings('mail.resend.key') ? 'required' : 'nullable',
                'string',
                'max:255',
            ],

            // Postmark
            'postmark_key' => [
                $default === 'postmark' && ! settings('mail.postmark.key') ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}
