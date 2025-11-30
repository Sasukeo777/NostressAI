export interface ParsedArticle {
    title?: string;
    slug?: string;
    date?: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    pillars?: string[];
    interactive?: string;
    body?: string;
}

export function parseArticleContent(text: string): ParsedArticle {
    const result: ParsedArticle = {};

    // 1. Separate Metadata from Body
    // We assume metadata starts with ## and ends with a double newline or just before the first content.
    // However, the user's example shows metadata on lines starting with ## or just one big block.
    // Let's try to extract the metadata block first.

    // Strategy: Look for the first block of text. If it contains "title:", "date:", etc., treat it as metadata.
    // The body is everything after that block.

    const lines = text.split('\n');
    let metadataEndIndex = 0;
    let metadataText = '';

    // Heuristic: Metadata block usually ends when we hit a blank line after some content, 
    // or if we see a line that doesn't look like metadata (doesn't contain key: value).
    // But the user's example has a long wrapped line.

    // Let's try to match specific keys in the whole text first, but restrict to the beginning.
    // Actually, let's just regex match the keys from the start of the string.

    // We'll look for the end of the metadata block by finding the first double newline after the "##" start.
    const firstDoubleNewline = text.indexOf('\n\n');
    if (firstDoubleNewline !== -1) {
        metadataText = text.substring(0, firstDoubleNewline);
        result.body = text.substring(firstDoubleNewline).trim();
    } else {
        // If no double newline, maybe it's all metadata? Or all body?
        // If it starts with ## title:, it's metadata.
        if (text.trim().startsWith('## title:')) {
            metadataText = text;
            result.body = '';
        } else {
            result.body = text;
        }
    }

    // If the body starts with "-----", remove that separator line.
    if (result.body && result.body.startsWith('-----')) {
        result.body = result.body.substring(5).trim();
    }
    // Also handle if it starts with a newline then -----
    result.body = result.body?.replace(/^\n*-----\n*/, '').trim();


    // 2. Parse Metadata Fields
    // Helper to extract value by key
    const extractValue = (key: string, type: 'string' | 'array' = 'string') => {
        // Regex explanation:
        // key:\s* -> match key and spaces
        // (?:'([^']*)'|"([^"]*)"|\[(.*?)\]|([^ \n]+)) -> match single quoted, double quoted, bracketed array, or simple word
        // We need to be careful about greedy matching.

        // Let's try a more specific regex for each type.

        if (type === 'array') {
            const regex = new RegExp(`${key}:\\s*\\[(.*?)\\]`, 'i');
            const match = metadataText.match(regex);
            if (match && match[1]) {
                return match[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')); // Remove quotes from items
            }
            return undefined;
        } else {
            // For strings, it could be quoted or not.
            // If quoted, match content inside quotes.
            // If not quoted, match until next key or end of line? 
            // The user's example has keys on the same line: "title: '...' date: ..."
            // So we must respect quotes.

            // We can use a regex that matches `key:` then captures either a quoted string OR a sequence of non-key characters.
            // But "non-key characters" is hard to define.
            // Best bet: match `key: '...'` or `key: "..."` or `key: value` (until space or end).

            // Try quoted first
            let regex = new RegExp(`${key}:\\s*'([^']*)'`, 'i');
            let match = metadataText.match(regex);
            if (match) return match[1];

            regex = new RegExp(`${key}:\\s*"([^"]*)"`, 'i');
            match = metadataText.match(regex);
            if (match) return match[1];

            // Unquoted: match until the next known key or end of string.
            // Known keys: title, date, excerpt, category, tags, pillars, interactive
            // This is tricky if we don't know the order.
            // But usually unquoted values are simple (dates, slugs).

            regex = new RegExp(`${key}:\\s*([^\\s]+)`, 'i');
            match = metadataText.match(regex);
            if (match) return match[1];
        }
        return undefined;
    };

    result.title = extractValue('title');
    result.date = extractValue('date');
    result.excerpt = extractValue('excerpt');
    result.category = extractValue('category');
    result.interactive = extractValue('interactive');

    result.tags = extractValue('tags', 'array') as string[] | undefined;
    result.pillars = extractValue('pillars', 'array') as string[] | undefined;

    // Slug generation from title if not present (though usually we let the form handle it or the user provides it)
    // The user didn't provide a slug key in the example, so we'll leave it undefined.

    return result;
}
