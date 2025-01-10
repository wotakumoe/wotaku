/**
 *  Copyright (c) 2024 taskylizard
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
// Thanks to @yellowsink for the original code!! <3
// https://github.com/uwu/uwu.network/blob/master/src/components/sink/Takodachi.astro

export type Vec2D = [number, number]

// Mathmaticians hate him!!!
/** Lenient square root */
export const lSqrt = (n: number) => Math.sqrt(Math.abs(n))

export const v2mag = (vec: Vec2D) =>
  Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1])

export const v2add = (v1: Vec2D, v2: Vec2D): Vec2D => [
  v1[0] + v2[0],
  v1[1] + v2[1]
]

export const v2sub = (v1: Vec2D, v2: Vec2D): Vec2D => [
  v1[0] - v2[0],
  v1[1] - v2[1]
]

/** Multiplies a 2D vector by a scalar */
export const v2smul = (vec: Vec2D, scalar: number): Vec2D => [
  vec[0] * scalar,
  vec[1] * scalar
]

export function v2norm(vec: Vec2D): Vec2D {
  const l = v2mag(vec)
  if (l === 0) return [Math.sqrt(2), Math.sqrt(2)]

  return [vec[0] / l, vec[1] / l]
}

export const rad2deg = (n: number) => (n * 180) / Math.PI

/** Calculates the gradient of a vector */
export const v2grad = (vec: Vec2D) => vec[1] / vec[0]

/** Calculates the angle of the vector against [1, 0] in radians */
export const v2rad = (vec: Vec2D) => Math.atan(v2grad(vec))

/** Calculates the angle of the vector against [1, 0] in degrees */
export const v2deg = (vec: Vec2D) => rad2deg(v2rad(vec))

/** Angle in degrees between two vec2ds in radians */
export const v2radBtw = (v1: Vec2D, v2: Vec2D) => v2rad(v1) - v2rad(v2)

/** Angle in degrees between two vec2ds in degrees */
export const v2degBtw = (v1: Vec2D, v2: Vec2D) => rad2deg(v2radBtw(v1, v2))
