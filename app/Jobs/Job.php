<?php

namespace App\Jobs;

use App\Jobs\Concerns\ExponentialBackoff;

abstract class Job
{
    use ExponentialBackoff;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 5;
}
