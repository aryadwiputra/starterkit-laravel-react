import { usePage } from '@inertiajs/react';

interface TranslationNode {
    [key: string]: string | TranslationNode;
}

type Translations = TranslationNode;

type ReplaceMap = Record<string, string | number>;

function resolveKey(translations: Translations, key: string): string | null {
    const segments = key.split('.');
    let current: string | TranslationNode | undefined = translations;

    for (const segment of segments) {
        if (
            typeof current !== 'object' ||
            current === null ||
            !(segment in current)
        ) {
            return null;
        }

        current = (current as TranslationNode)[segment];
    }

    return typeof current === 'string' ? current : null;
}

function applyReplacements(value: string, replacements?: ReplaceMap): string {
    if (!replacements) {
        return value;
    }

    return Object.entries(replacements).reduce(
        (result, [key, replacement]) =>
            result.replaceAll(`:${key}`, String(replacement)),
        value,
    );
}

export function useTranslation() {
    const { translations } = usePage().props as { translations?: Translations };

    const t = (key: string, replacements?: ReplaceMap): string => {
        const resolved = translations ? resolveKey(translations, key) : null;

        if (!resolved) {
            return key;
        }

        return applyReplacements(resolved, replacements);
    };

    return { t };
}
