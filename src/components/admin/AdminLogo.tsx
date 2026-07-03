import React from 'react'

import { siteConfig } from '@/config/site'

export default function AdminLogo() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: 12,
      }}
    >
      <svg
        aria-hidden
        fill="none"
        height="32"
        viewBox="0 0 180 180"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M90 0L180 90L90 180L0 90L90 0Z" fill="#b45309" />
      </svg>
      <span
        style={{
          color: 'var(--theme-elevation-1000)',
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {siteConfig.name}
      </span>
    </div>
  )
}
