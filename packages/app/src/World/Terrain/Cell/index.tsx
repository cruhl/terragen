import * as KonvaReact from "react-konva";

import { Geometry } from "~/Geometry";
import { World } from "~/World";

import { Biome } from "./Biome";
import { Elevation } from "./Elevation";
import { Features } from "./Feature";

export type Cell = {
  id: ID;

  elevation: Elevation;
  features: Features;

  slope: number;
  aspect: number;
} & Geometry.Point2D &
  Biome;

export function Cell({ world, cell }: World.Props & { cell: Cell }) {
  return (
    <KonvaReact.Rect
      key={cell.id}
      x={cell.x}
      y={cell.y}
      width={1}
      height={1}
      fill={`hsla(0, 0%, ${((cell.elevation + 1) / 2) * 100}%)`}
    />
  );
}

export declare namespace Cell {
  export { Biome, Elevation, Features };
}

export namespace Cell {
  Cell.Biome = Biome;
  Cell.Elevation = Elevation;
  Cell.Features = Features;
}
