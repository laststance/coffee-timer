'use client'

import { memo, forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

/**
 * Glass Panel Variants
 * Based on Apple's Liquid Glass design system (WWDC 2025)
 *
 * - regular: Full adaptive behavior, versatile (default)
 * - clear: More transparent, for media-rich backgrounds (needs dimming)
 * - elevated: Deeper shadows for prominent elements
 * - tinted: With color tint for state indication
 */
type GlassVariant = 'regular' | 'clear' | 'elevated'
type GlassTint = 'green' | 'amber' | 'red' | 'blue' | 'none'
type GlassShape = 'rounded' | 'capsule' | 'circle'

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Glass variant style */
  variant?: GlassVariant
  /** Color tint for state indication */
  tint?: GlassTint
  /** Shape of the glass panel */
  shape?: GlassShape
  /** Enable specular highlight overlay */
  highlight?: boolean
  /** Enable hover/focus lift effect */
  interactive?: boolean
  /** Additional CSS classes */
  className?: string
  /** Child elements */
  children?: React.ReactNode
}

/**
 * GlassPanel - Liquid Glass container component
 *
 * Implements Apple's Liquid Glass design principles:
 * - Translucent backgrounds with backdrop blur
 * - Subtle borders and shadows for depth
 * - Specular highlights for light reflection
 * - Interactive states with lift effect
 *
 * @example
 * ```tsx
 * <GlassPanel variant="regular" shape="rounded" highlight>
 *   <TimerDisplay />
 * </GlassPanel>
 *
 * <GlassPanel variant="elevated" tint="green" shape="capsule" interactive>
 *   <Button>Start</Button>
 * </GlassPanel>
 * ```
 */
export const GlassPanel = memo(
  forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
    {
      variant = 'regular',
      tint = 'none',
      shape = 'rounded',
      highlight = false,
      interactive = false,
      className = '',
      children,
      ...motionProps
    },
    ref,
  ) {
    // Build class list
    const classes = [
      // Base glass effect
      'glass',
      // Variant
      variant === 'elevated' && 'glass-elevated',
      variant === 'clear' && 'glass-clear',
      // Tint
      tint !== 'none' && `glass-tint-${tint}`,
      // Shape
      shape === 'capsule' && 'glass-capsule',
      shape === 'circle' && 'rounded-full',
      shape === 'rounded' && 'rounded-2xl',
      // Highlight overlay
      highlight && 'glass-highlight',
      // Interactive lift effect
      interactive && 'glass-interactive',
      // User classes
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <motion.div ref={ref} className={classes} {...motionProps}>
        {children}
      </motion.div>
    )
  }),
)

/**
 * GlassButton - Liquid Glass button component
 *
 * A specialized glass panel for buttons with capsule shape
 * and interactive lift effect by default.
 */
interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  /** Color tint for state indication */
  tint?: GlassTint
  /** Glass variant */
  variant?: GlassVariant
  /** Additional CSS classes */
  className?: string
  /** Child elements */
  children?: React.ReactNode
}

export const GlassButton = memo(
  forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
    {
      tint = 'none',
      variant = 'regular',
      className = '',
      children,
      ...motionProps
    },
    ref,
  ) {
    const classes = [
      'glass',
      'glass-capsule',
      'glass-highlight',
      'cursor-pointer',
      'select-none',
      variant === 'elevated' && 'glass-elevated',
      tint !== 'none' && `glass-tint-${tint}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...motionProps}
      >
        {children}
      </motion.button>
    )
  }),
)

/**
 * GlassContainer - Full-width glass container for sections
 *
 * Use for containing groups of related content with
 * consistent glass styling.
 */
interface GlassContainerProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Glass variant */
  variant?: GlassVariant
  /** Additional CSS classes */
  className?: string
  /** Child elements */
  children?: React.ReactNode
}

export const GlassContainer = memo(
  forwardRef<HTMLDivElement, GlassContainerProps>(function GlassContainer(
    { variant = 'regular', className = '', children, ...motionProps },
    ref,
  ) {
    const classes = [
      'glass',
      'glass-highlight',
      'rounded-3xl',
      'p-6',
      variant === 'elevated' && 'glass-elevated',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <motion.div ref={ref} className={classes} {...motionProps}>
        {children}
      </motion.div>
    )
  }),
)

/**
 * GlassOverlay - Glass overlay for modals and dialogs
 *
 * Provides a glass background with dimming layer
 * for modal contexts.
 */
interface GlassOverlayProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Show dimming layer behind glass */
  dimming?: boolean
  /** Additional CSS classes */
  className?: string
  /** Child elements */
  children?: React.ReactNode
}

export const GlassOverlay = memo(
  forwardRef<HTMLDivElement, GlassOverlayProps>(function GlassOverlay(
    { dimming = true, className = '', children, ...motionProps },
    ref,
  ) {
    return (
      <>
        {dimming && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />
        )}
        <motion.div
          ref={ref}
          className={`glass glass-elevated glass-highlight rounded-3xl ${className}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          {...motionProps}
        >
          {children}
        </motion.div>
      </>
    )
  }),
)
