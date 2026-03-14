export const PLACEHOLDER_IMAGE = '/unique-gem.png'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop&q=80'

export default function ChocolateImage({ src, alt, className = '' }) {
  return (
    <img
      src={src || PLACEHOLDER_IMAGE}
      alt={alt || 'Chocolate product'}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        e.target.onerror = null
        e.target.src = e.target.src === PLACEHOLDER_IMAGE ? FALLBACK_IMAGE : PLACEHOLDER_IMAGE
      }}
    />
  )
}
