import { Geometry } from "~/Geometry";
import { World } from "~/World";

export namespace Generation {
  export const execute = ({ width, height }: Geometry.Size): World.Terrain => {
    const terrain: World.Terrain = {};
    const noise = World.Terrain.noise({ width, height });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const id = `${x},${y}`;

        const elevation = (noise.elevation[y * width + x] ?? 0) * 2 - 1;

        const biome = () => {
          if (elevation <= 0) return;

          if ((noise.biome.desert[y * width + x] ?? 0) > 0.7) return "desert";
          if ((noise.biome.forest[y * width + x] ?? 0) > 0.6) return "forest";
          return "plains";
        };

        const features =
          elevation > 0 && (noise.features.city[y * width + x] ?? 0) > 0.7
            ? [{ feature: "city", population: 1000000 }]
            : [];

        const cell = {
          id,
          x,
          y,

          elevation,
          features,

          biome: biome(),
        };

        terrain[id] = cell;
      }
    }

    return terrain;
  };
}
