export const ALLOWED_SETTINGS = ['screen', 'ebook', 'printer', 'prepress'] as const;
export type CompressionProfile = typeof ALLOWED_SETTINGS[number];

export function isCompressionProfile(value: string): value is CompressionProfile {
    return (ALLOWED_SETTINGS as readonly string[]).includes(value);
}
