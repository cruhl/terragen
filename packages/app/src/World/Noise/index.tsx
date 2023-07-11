import { generatePerlinNoise } from "perlin-noise";

import { Geometry } from "~/Geometry";
import { World } from "~/World";

export type Noise = number[];

export function Noise({ width, height, noise }: Noise.Props) {
  return (
    <div className="opacity-100 hover:opacity-0">
      {Object.values(noise).map((value, index) => (
        <div
          key={index}
          css={css`
            position: absolute;
            width: ${World.Terrain.Cell.sizePixels()}px;
            height: ${World.Terrain.Cell.sizePixels()}px;
          `}
          style={{
            left: (index % width) * World.Terrain.Cell.sizePixels(),
            top: Math.floor(index / height) * World.Terrain.Cell.sizePixels(),
            background: `hsl(0, 0%, ${value * 100}%)`,
          }}
        />
      ))}
    </div>
  );
}

export namespace Noise {
  export type Props = Geometry.Size & { noise: Noise };
  export type Settings = {
    width: number;
    height: number;
    octaveCount: number;
    amplitude: number;
    persistence: number;
  };

  export const generate = (settings: Settings): Noise =>
    generatePerlinNoise(settings.width, settings.height, settings);
}
