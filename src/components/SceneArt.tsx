import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  SVGProps,
} from 'react'
import './scene-art.css'

type SceneBackdropProps = HTMLAttributes<HTMLDivElement>

/** A decorative sky, rolling grass, and road base for a scene. */
export function SceneBackdrop({
  children,
  className,
  ...props
}: SceneBackdropProps) {
  return (
    <div
      {...props}
      className={joinClassNames('scene-backdrop', className)}
    >
      <div className="scene-backdrop__sky" aria-hidden="true" />
      <span className="scene-backdrop__sun" aria-hidden="true" />
      <span
        className="scene-backdrop__cloud scene-backdrop__cloud--one"
        aria-hidden="true"
      />
      <span
        className="scene-backdrop__cloud scene-backdrop__cloud--two"
        aria-hidden="true"
      />
      <div className="scene-backdrop__grass" aria-hidden="true" />
      <span
        className="scene-backdrop__hill scene-backdrop__hill--back"
        aria-hidden="true"
      />
      <span
        className="scene-backdrop__hill scene-backdrop__hill--front"
        aria-hidden="true"
      />
      <div className="scene-backdrop__road" aria-hidden="true">
        <span className="scene-backdrop__road-marks" />
      </div>
      <div className="scene-backdrop__content">{children}</div>
    </div>
  )
}

type CarIllustrationProps = SVGProps<SVGSVGElement> & {
  /** Provide a short description when the car conveys information. */
  label?: string
}

/** The shared friendly car illustration, drawn locally as inline SVG. */
export function CarIllustration({
  className,
  label,
  ...props
}: CarIllustrationProps) {
  return (
    <svg
      {...props}
      className={joinClassNames('scene-car', className)}
      viewBox="0 0 320 170"
      focusable="false"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {label && <title>{label}</title>}
      <ellipse cx="160" cy="151" rx="126" ry="12" fill="#487c64" opacity=".14" />
      <path
        d="M45 105 62 76c7-12 17-18 33-20l35-4 24-29c6-7 13-10 23-10h30c13 0 24 7 31 18l24 39 25 9c10 4 17 12 17 23v26c0 8-6 14-14 14h-17a34 34 0 0 0-67 0h-57a34 34 0 0 0-67 0H62c-12 0-19-8-19-19v-8c0-5 0-8 2-10Z"
        fill="var(--scene-color-car, #ffbd59)"
        stroke="var(--scene-color-outline, #8c633d)"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="m145 55 22-27c4-5 8-7 15-7h25c9 0 16 5 21 12l18 29-101-7Z"
        fill="var(--scene-color-window, #bce9e9)"
        stroke="var(--scene-color-outline, #8c633d)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="m185 27-22 28 49 3V27h-27Z" fill="#ddf4ed" />
      <path d="M224 29v30l25 2-16-26c-2-3-5-5-9-6Z" fill="#ddf4ed" />
      <path
        d="M280 99h19c6 0 10 5 10 11v14h-21"
        fill="#ffe28b"
        stroke="var(--scene-color-outline, #8c633d)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <circle cx="107" cy="130" r="25" fill="#52616b" stroke="#3e4b52" strokeWidth="6" />
      <circle cx="107" cy="130" r="10" fill="#f7f0d8" />
      <circle cx="244" cy="130" r="25" fill="#52616b" stroke="#3e4b52" strokeWidth="6" />
      <circle cx="244" cy="130" r="10" fill="#f7f0d8" />
      <circle cx="275" cy="91" r="5" fill="#fff6d9" />
      <path d="M57 94h35" stroke="#fff0c4" strokeWidth="7" strokeLinecap="round" />
      <path d="M173 79c7 7 18 7 25 0" fill="none" stroke="#79553a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="179" cy="70" r="3.5" fill="#493f36" />
      <circle cx="194" cy="70" r="3.5" fill="#493f36" />
    </svg>
  )
}

type SceneButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'warm'
}

/** A large, rounded button with the shared scene art styling. */
export function SceneButton({
  children,
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: SceneButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={joinClassNames(`scene-button scene-button--${variant}`, className)}
    >
      {children}
    </button>
  )
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ')
}
