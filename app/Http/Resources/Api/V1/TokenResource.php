<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TokenResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array{token: string, token_type: string} $resource */
        $resource = $this->resource;

        return [
            'token' => $resource['token'],
            'token_type' => $resource['token_type'],
        ];
    }
}
