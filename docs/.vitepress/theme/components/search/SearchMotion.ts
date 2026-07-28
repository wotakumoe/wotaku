import { computed, type ComputedRef } from 'vue'
import { motion } from 'motion-v'

export const SearchMotionDiv = motion.div
export const SearchMotionForm = motion.form
export const SearchMotionLi = motion.li
export const searchMotionEase = [0.16, 1, 0.3, 1]

export function useSearchMotion(animationsEnabled: ComputedRef<boolean>) {
  const searchMotionDiv = computed(() =>
    animationsEnabled.value ? SearchMotionDiv : 'div'
  )
  const searchMotionForm = computed(() =>
    animationsEnabled.value ? SearchMotionForm : 'form'
  )
  const searchMotionLi = computed(() =>
    animationsEnabled.value ? SearchMotionLi : 'li'
  )

  const backdropMotion = computed(() =>
    animationsEnabled.value
      ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.55, ease: searchMotionEase }
      }
      : {}
  )

  const shellMotion = computed(() =>
    animationsEnabled.value
      ? {
        layout: 'size',
        initial: { opacity: 0, scale: 0.9375 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9375 },
        transition: { duration: 0.55, ease: searchMotionEase }
      }
      : {}
  )

  const formMotion = computed(() =>
    animationsEnabled.value ? { layout: 'position' } : {}
  )

  const ribbonMotion = computed(() =>
    animationsEnabled.value
      ? {
        layout: 'position',
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.4, ease: searchMotionEase }
      }
      : {}
  )

  const emptyStateMotion = computed(() =>
    animationsEnabled.value
      ? {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { delay: 0.1 }
        },
        exit: {
          opacity: 0,
          height: 0,
          transition: { duration: 0.2 }
        },
        transition: { duration: 0.7, ease: searchMotionEase }
      }
      : {}
  )

  function resultMotion(index: number) {
    if (!animationsEnabled.value) return {}
    return {
      layout: true,
      initial: { opacity: 0, scale: 0.9375 },
      animate: { opacity: 1, scale: 1 },
      exit: {
        opacity: 0,
        scale: 0.9375,
        height: 0,
        transition: { duration: 0.25 }
      },
      transition: {
        duration: 0.55,
        ease: searchMotionEase,
        delay: index * 0.02
      }
    }
  }

  const excerptMotion = computed(() =>
    animationsEnabled.value
      ? {
        layout: true,
        initial: { height: 0 },
        animate: { height: '84px' },
        exit: { height: 0 },
        transition: { duration: 0.4, ease: searchMotionEase }
      }
      : {}
  )

  const footerMotion = computed(() =>
    animationsEnabled.value ? { layout: true } : {}
  )

  return {
    searchMotionDiv,
    searchMotionForm,
    searchMotionLi,
    backdropMotion,
    shellMotion,
    formMotion,
    ribbonMotion,
    emptyStateMotion,
    resultMotion,
    excerptMotion,
    footerMotion
  }
}
