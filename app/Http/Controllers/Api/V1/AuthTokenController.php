<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreApiTokenRequest;
use App\Http\Resources\Api\V1\TokenResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthTokenController extends Controller
{
    public function store(StoreApiTokenRequest $request): JsonResponse
    {
        $validated = $request->validated();

        /** @var User|null $user */
        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }

        $token = $user->createToken($validated['device_name'] ?? 'api')->plainTextToken;

        return (new TokenResource([
            'token' => $token,
            'token_type' => 'Bearer',
        ]))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(Request $request): Response
    {
        if ($token = $request->bearerToken()) {
            PersonalAccessToken::findToken($token)?->delete();
        }

        return response()->noContent();
    }
}
