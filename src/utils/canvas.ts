export const MIN_ZOOM = 0.38;
export const MAX_ZOOM = 2.3;

export const clamp = (v: number, a: number, b: number) =>
  Math.min(Math.max(v, a), b);
