import { generatePerlinNoise } from "perlin-noise";

const world = {
  width: 100,
  height: 100,
};

export function World() {
  return (
    <div
      className="relative blur-[3px] brightness-75 contrast-125 saturate-[65%]"
      style={{
        width: world.width * Terrain.Cell.size(),
        height: world.height * Terrain.Cell.size(),
      }}
    >
      <Terrain />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-blue-300 mix-blend-overlay" />
    </div>
  );
}

type Terrain = {
  [id: ID]: Terrain.Cell;
};

function Terrain() {
  const terrain = useMemo(
    () => Terrain.generate(world.width, world.height),
    []
  );

  return (
    <>
      {useMemo(
        () =>
          Object.values(terrain).map((cell) => (
            <Terrain.Cell key={cell.id} cell={cell} />
          )),
        [terrain]
      )}
    </>
  );
}

namespace Terrain {
  export const generate = (width: number, height: number): Terrain => {
    const terrain: Terrain = {};

    const noise = {
      biome: generatePerlinNoise(width, height, {
        octaveCount: 5,
        amplitude: 0.4,
        persistence: 0.9,
      }),

      z: generatePerlinNoise(width, height, {
        octaveCount: 5,
        amplitude: 0.5,
        persistence: 0.6,
      }),
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const id = `${x},${y}`;
        const z = noise.z[y * width + x] * 2 - 1;

        const kind = z > 0 ? "land" : "water";
        const biomeNoise = noise.biome[y * width + x];

        const cell: Cell = {
          id,
          x,
          y,
          z,
          kind,

          ...(kind === "land" && {
            biome:
              biomeNoise > 2 / 3
                ? "forest"
                : biomeNoise > 1 / 3
                ? "plains"
                : "desert",
          }),
        };

        terrain[id] = cell;
      }
    }

    return terrain;
  };

  export type Cell = {
    id: ID;
    x: number;
    y: number;
    z: number;
  } & Cell.Kind;

  export function Cell({ cell }: { cell: Cell }) {
    return (
      <div
        key={cell.id}
        className="absolute"
        style={{
          width: Terrain.Cell.size(),
          height: Terrain.Cell.size(),
          left: cell.x * Terrain.Cell.size(),
          top: cell.y * Terrain.Cell.size(),
          backgroundColor: Terrain.Cell.Kind.color(cell),
        }}
      />
    );
  }

  export namespace Cell {
    export const size = () => 8;

    export type Kind = Kind.Water | Kind.Land;
    export namespace Kind {
      export const color = (cell: Cell) => {
        switch (cell.kind) {
          case "water":
            return Water.color(cell);
          case "land":
            return Land.color(cell);
        }
      };

      export type Water = { kind: "water" };
      export namespace Water {
        export const color = (cell: Cell) => {
          const reversed = 1 - Math.abs(cell.z);

          const hue = -Math.pow(reversed, 4) * 25 + 215;
          const saturation = Math.pow(reversed, 25) * 30 + 60;
          const lightness = Math.pow(reversed, 25) * 15 + 22;

          return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        };
      }

      export type Land = { kind: "land" } & Land.Biome;
      export namespace Land {
        export const color = (cell: Cell & Land) => {
          const { hue, saturation, lightness } =
            cell.biome === "forest"
              ? {
                  hue: Math.pow(cell.z, 5) * 25 + 150,
                  saturation: 60 - Math.pow(cell.z, 2) * 20,
                  lightness: Math.pow(cell.z, 2) * 15 + 23,
                }
              : cell.biome === "plains"
              ? {
                  hue: Math.pow(cell.z, 5) * 25 + 100,
                  saturation: 40 - Math.pow(cell.z, 2) * 20,
                  lightness: Math.pow(cell.z, 2) * 15 + 30,
                }
              : {
                  hue: Math.pow(cell.z, 5) * 25 + 50,
                  saturation: 40 - Math.pow(cell.z, 2) * 20,
                  lightness: Math.pow(cell.z, 2) * 15 + 30,
                };

          return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        };

        export type Biome = Biome.Plains | Biome.Forest | Biome.Desert;
        export namespace Biome {
          export type Plains = { biome: "plains" };
          export type Forest = { biome: "forest" };
          export type Desert = { biome: "desert" };
        }
      }
    }
  }
}
