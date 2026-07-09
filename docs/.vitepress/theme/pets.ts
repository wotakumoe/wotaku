import {
  PetCharacterStorageKey,
  PetStorageKey,
  TakodachiStorageKey
} from './constants'

export interface PetIconImage {
  type: 'image'
  src: string
}

export interface PetIconSprite {
  type: 'sprite'
  src: string
  /** Grid cell to show, in [-col, -row] units matching oneko's sprite map. */
  cell: [number, number]
  sheet: [number, number]
  cellSize: number
  /** Cells to cycle through for an animated preview. */
  frames?: [number, number][]
}

export type PetIcon = PetIconImage | PetIconSprite

export interface PetCharacter {
  key: string
  label: string
  behavior: 'chaser' | 'oneko'
  icon: PetIcon
  /** For `chaser` behavior: image that follows the cursor. */
  src?: string
}

export const petCharacters: PetCharacter[] = [
  {
    key: 'tako',
    label: 'Takodachi',
    behavior: 'chaser',
    icon: { type: 'image', src: '/takodachi.webp' },
    src: '/takodachi.webp'
  },
  {
    key: 'oneko',
    label: 'Oneko',
    behavior: 'oneko',
    icon: {
      type: 'sprite',
      src: '/oneko.gif',
      cell: [-2, 0],
      sheet: [256, 128],
      cellSize: 32,
      frames: [
        [-2, 0],
        [-2, -1]
      ]
    }
  }
]

export const defaultPetKey = petCharacters[0].key

/** Style for a sprite frame scaled to a `size` px box; pass an incrementing
 * `frameIndex` to cycle an icon's `frames`. */
export function spriteIconStyle(
  icon: PetIconSprite,
  size: number,
  frameIndex = 0
) {
  const scale = size / icon.cellSize
  const frames = icon.frames?.length ? icon.frames : [icon.cell]
  const cell = frames[frameIndex % frames.length]
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: `url(${icon.src})`,
    backgroundPosition: `${cell[0] * icon.cellSize * scale}px ${cell[1] * icon.cellSize * scale}px`,
    backgroundSize: `${icon.sheet[0] * scale}px ${icon.sheet[1] * scale}px`,
    imageRendering: 'pixelated' as const
  }
}

// Migrate the old single "Takodachi" toggle to the enabled + character pair.
if (typeof window !== 'undefined') {
  try {
    const legacy = window.localStorage.getItem(TakodachiStorageKey)
    if (legacy !== null && window.localStorage.getItem(PetStorageKey) === null) {
      window.localStorage.setItem(PetStorageKey, legacy)
      window.localStorage.setItem(PetCharacterStorageKey, defaultPetKey)
      window.localStorage.removeItem(TakodachiStorageKey)
    }
  } catch {}
}
