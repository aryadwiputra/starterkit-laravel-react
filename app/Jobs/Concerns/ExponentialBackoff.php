<?php

namespace App\Jobs\Concerns;

trait ExponentialBackoff
{
    /**
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [10, 30, 60, 120];
    }
}
