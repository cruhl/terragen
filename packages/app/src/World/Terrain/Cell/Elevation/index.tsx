import { Geometry } from "~/Geometry";
import { World } from "~/World";

import { Map } from "./Map";
import { Relief } from "./Relief";

export type Elevation = number;

export function Elevation({ world }: World.Props) {
  return (
    <>
      <Map world={world} />
      <Relief world={world} />
    </>
  );
}

export declare namespace Elevation {
  export { Map, Relief };
}

export namespace Elevation {
  Elevation.Map = Map;
  Elevation.Relief = Relief;

  export const noise = (size: Geometry.Size) =>
    World.Noise.generate({
      ...size,
      octaveCount: 5,
      amplitude: 0.5,
      persistence: 0.6,
    });

  export namespace Mountain {
    export const threshold = () => 0.5 as const;
  }
}
