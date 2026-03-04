import type { Face, FaceColor } from '../cube/cubeLogic';
import { COLORS } from '../cube/cubeLogic';

interface CubeFaceProps {
  face: Face;
  label: string;
}

export default function CubeFace({ face, label }: CubeFaceProps) {
  return (
    <div className="cube-face">
      <div className="face-label">{label}</div>
      <div className="face-grid">
        {face.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="face-cell"
              style={{ backgroundColor: COLORS[cell as FaceColor] }}
            />
          ))
        )}
      </div>
    </div>
  );
}
