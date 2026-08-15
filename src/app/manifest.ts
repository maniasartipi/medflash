import type { MetadataRoute } from 'next'
 
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MedFlash',
    short_name: 'MedFlash',
    description: 'Medical flashcards application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/medflash/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/medflash/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
