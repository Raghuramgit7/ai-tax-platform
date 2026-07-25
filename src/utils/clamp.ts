/**
 * Clamp a split panel ratio to the valid range [0.2, 0.8].
 */
export function clampSplitRatio(ratio: number): number {
  return Math.min(0.8, Math.max(0.2, ratio));
}

/**
 * Clamp a zoom level to the valid range [50, 200].
 */
export function clampZoom(zoom: number): number {
  return Math.min(200, Math.max(50, zoom));
}
