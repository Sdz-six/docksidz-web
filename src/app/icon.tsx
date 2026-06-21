import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#4B5694',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px',
          border: '3px solid #111844',
          fontWeight: '900',
          fontFamily: 'sans-serif',
          boxShadow: '2px 2px 0px #111844',
        }}
      >
        D
      </div>
    ),
    { ...size }
  )
}
