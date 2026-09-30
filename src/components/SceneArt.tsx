import type { ButtonHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react'
import './scene-art.css'

type SceneBackdropProps = HTMLAttributes<HTMLDivElement>

/** Shared picture-book meadow with a road under the interactive sprites. */
export function SceneBackdrop({ children, className, ...props }: SceneBackdropProps) {
  return (
    <div {...props} className={joinClassNames('scene-backdrop', className)}>
      <div className="scene-backdrop__road" aria-hidden="true">
        <span className="scene-backdrop__road-marks" />
      </div>
      <div className="scene-backdrop__content">{children}</div>
    </div>
  )
}

type CarIllustrationProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Provide a short description when the car conveys information. */
  label?: string
}

/** The same generated car sprite throughout the journey. */
export function CarIllustration({ className, label, ...props }: CarIllustrationProps) {
  return (
    <img
      {...props}
      src="/images/car.webp"
      className={joinClassNames('scene-car', className)}
      alt={label ?? ''}
      draggable={false}
    />
  )
}

type SceneButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'warm'
}

/** A large, rounded button with the shared scene art styling. */
export function SceneButton({ children, className, type = 'button', variant = 'primary', ...props }: SceneButtonProps) {
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
