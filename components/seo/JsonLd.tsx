import type { Thing, WithContext } from 'schema-dts';

interface JsonLdProps<T extends Thing> {
    schema: T | WithContext<T>;
}

export function JsonLd<T extends Thing>({ schema }: JsonLdProps<T>) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
