<?php

namespace App\Services;

class ModuleScaffoldResult
{
    /**
     * @param  list<string>  $createdFiles
     * @param  list<string>  $updatedFiles
     * @param  list<string>  $skippedFiles
     */
    public function __construct(
        public array $createdFiles,
        public array $updatedFiles,
        public array $skippedFiles,
    ) {
        //
    }
}
