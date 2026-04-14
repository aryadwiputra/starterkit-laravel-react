<?php

namespace App\Services;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

class PhpSourceEditor
{
    public function __construct(
        private readonly Filesystem $files,
    ) {
        //
    }

    public function addUseStatementIfMissing(string $filePath, string $fqcn): bool
    {
        $contents = $this->files->get($filePath);

        if (str_contains($contents, "use {$fqcn};")) {
            return false;
        }

        $namespacePos = strpos($contents, 'namespace ');
        if ($namespacePos === false) {
            return false;
        }

        $afterNamespacePos = strpos($contents, ';', $namespacePos);
        if ($afterNamespacePos === false) {
            return false;
        }

        $insertionPos = $afterNamespacePos + 1;
        $existingUsePos = strpos($contents, "\nuse ", $insertionPos);

        if ($existingUsePos === false) {
            $contents = substr_replace($contents, "\n\nuse {$fqcn};\n", $insertionPos, 0);
        } else {
            $contents = substr_replace($contents, "\nuse {$fqcn};", $existingUsePos, 0);
        }

        $this->files->put($filePath, $contents);

        return true;
    }

    public function addGatePolicyIfMissing(string $filePath, string $modelFqcn, string $policyFqcn): bool
    {
        $contents = $this->files->get($filePath);

        $policyLine = "Gate::policy({$this->shortClass($modelFqcn)}::class, {$this->shortClass($policyFqcn)}::class);";
        if (str_contains($contents, $policyLine)) {
            return false;
        }

        $methodPos = strpos($contents, 'protected function configureAuthorization(): void');
        if ($methodPos === false) {
            return false;
        }

        $blockStart = strpos($contents, '{', $methodPos);
        if ($blockStart === false) {
            return false;
        }

        $firstStatementPos = $blockStart + 1;

        $gatePolicyPos = strpos($contents, 'Gate::policy(', $firstStatementPos);
        if ($gatePolicyPos === false) {
            $insertPos = $firstStatementPos;
        } else {
            $insertPos = $gatePolicyPos;
        }

        $indent = "\n        ";
        $contents = substr_replace($contents, "{$indent}{$policyLine}{$indent}", $insertPos, 0);

        $this->files->put($filePath, $contents);

        return true;
    }

    /**
     * @return non-empty-string
     */
    private function shortClass(string $fqcn): string
    {
        $class = Str::afterLast($fqcn, '\\');

        return $class === '' ? $fqcn : $class;
    }
}
