'use client'

// src/components/modules/VideoPlayer.jsx
// Embeds video content from YouTube or a direct video URL.

function getYouTubeEmbedUrl(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`

      const parts = parsed.pathname.split('/').filter(Boolean)
      const embedIndex = parts.indexOf('embed')
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`
      }

      const shortsIndex = parts.indexOf('shorts')
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[shortsIndex + 1]}`
      }
    }
  } catch {
    return null
  }

  return null
}

function isDirectVideoUrl(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '')
}

export default function VideoPlayer({ url, title }) {
  const embedUrl = getYouTubeEmbedUrl(url)

  if (!url) {
    return (
      <div className="aspect-video bg-th-hov rounded-xl flex items-center justify-center text-th-muted text-sm">
        No video URL provided.
      </div>
    )
  }

  if (embedUrl) {
    return (
      <div className="aspect-video bg-th-hov rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          title={title || 'Module video'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  if (isDirectVideoUrl(url)) {
    return (
      <div className="aspect-video bg-th-hov rounded-xl overflow-hidden">
        <video
          src={url}
          controls
          className="w-full h-full"
          title={title || 'Module video'}
        />
      </div>
    )
  }

  return (
    <div className="aspect-video bg-th-hov rounded-xl flex flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-th-muted text-sm">This video link cannot be embedded.</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-all duration-150"
      >
        Open video in new tab
      </a>
    </div>
  )
}
