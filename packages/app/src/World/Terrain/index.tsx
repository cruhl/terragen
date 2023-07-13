import * as KonvaReact from "react-konva";

import { Geometry } from "~/Geometry";
import { World } from "~/World";

import { Cell } from "./Cell";
import { Generation } from "./Generation";

export type Terrain = {
  [id: ID]: Terrain.Cell;
};

export function Terrain({ world }: World.Props) {
  return (
    <>
      <KonvaReact.Layer>
        <Cell.Elevation world={world} />
        <KonvaReact.Image image={Cell.Elevation.Map.CanvasElement.use()} />
        {false && (
          <KonvaReact.Image image={Cell.Elevation.Relief.CanvasElement.use()} />
        )}
      </KonvaReact.Layer>
    </>
  );
}

export declare namespace Terrain {
  export { Cell, Generation };
}

export namespace Terrain {
  Terrain.Cell = Cell;
  Terrain.Generation = Generation;

  export const noise = (size: Geometry.Size) => ({
    elevation: Cell.Elevation.noise(size),
    biome: Cell.Biome.noise(size),
    features: Cell.Features.noise(size),
  });
}
