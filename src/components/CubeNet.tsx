import type { CubeState } from '../cube/cubeLogic';
import CubeFace from './CubeFace';

interface CubeNetProps {
  cube: CubeState;
}

export default function CubeNet({ cube }: CubeNetProps) {
  return (
    <div className="cube-net">
      {/* Row 1: U face centered */}
      <div className="net-row net-row-top">
        <div className="net-spacer" />
        <CubeFace face={cube.U} label="U" />
        <div className="net-spacer" />
        <div className="net-spacer" />
      </div>
      {/* Row 2: L F R B */}
      <div className="net-row net-row-middle">
        <CubeFace face={cube.L} label="L" />
        <CubeFace face={cube.F} label="F" />
        <CubeFace face={cube.R} label="R" />
        <CubeFace face={cube.B} label="B" />
      </div>
      {/* Row 3: D face centered */}
      <div className="net-row net-row-bottom">
        <div className="net-spacer" />
        <CubeFace face={cube.D} label="D" />
        <div className="net-spacer" />
        <div className="net-spacer" />
      </div>
    </div>
  );
}
