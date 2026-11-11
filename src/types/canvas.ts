export type Camera = {
  x: number;
  y: number;
  scale: number;
};

export type Action =
  | {
      mode: 'pan';
      startX: number;
      startY: number;
      origin: Camera;
      moved: boolean;
    }
  | {
      mode: 'item';
      id: string;
      startX: number;
      startY: number;
      x: number;
      y: number;
      scale: number;
      moved: boolean;
    };
