import type { ImageMetadata } from 'astro';

// Put your photo at src/assets/portrait.jpg (or .png / .webp). If there isn't one, no photo is shown.
const found = import.meta.glob<{ default: ImageMetadata }>('../assets/portrait.{jpg,jpeg,png,webp}', { eager: true });

export const portrait: ImageMetadata | undefined = Object.values(found)[0]?.default;
