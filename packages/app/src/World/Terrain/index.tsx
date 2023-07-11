import { Geometry } from "~/Geometry";
import { World } from "~/World";

export type Terrain = {
  [id: ID]: Terrain.Cell;
};

export function Terrain({ world }: World.Props) {
  return (
    <div css={Terrain.Cell.styles(world)}>
      {useMemo(
        () =>
          Object.values(world.terrain).map((cell) => (
            <Terrain.Cell key={cell.id} world={world} cell={cell} />
          )),
        [world]
      )}
    </div>
  );
}

export namespace Terrain {
  export const generate = ({ width, height }: Geometry.Size): Terrain => {
    const terrain: Terrain = {};
    const noise = Terrain.noise({ width, height });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const id = `${x},${y}`;

        const elevationAbsolute = noise.elevation[y * width + x] ?? 0;
        const elevationAboveSeaLevel = elevationAbsolute * 2 - 1;

        const north =
          y === 0
            ? elevationAbsolute
            : noise.elevation[(y - 1) * width + x] ?? 0;

        const south =
          y === height - 1
            ? elevationAbsolute
            : noise.elevation[(y + 1) * width + x] ?? 0;

        const west =
          x === 0
            ? elevationAbsolute
            : noise.elevation[y * width + (x - 1)] ?? 0;

        const east =
          x === width - 1
            ? elevationAbsolute
            : noise.elevation[y * width + (x + 1)] ?? 0;

        const dzdx = (east - west) / 2;
        const dzdy = (south - north) / 2;

        const slope = Math.sqrt(dzdx * dzdx + dzdy * dzdy);
        const aspect = Math.atan2(dzdy, dzdx);

        const kind = elevationAboveSeaLevel > 0 ? "land" : "water";

        const biome = () => {
          if ((noise.biome.desert[y * width + x] ?? 0) > 0.7) return "desert";
          if ((noise.biome.forest[y * width + x] ?? 0) > 0.6) return "forest";
          return "plains";
        };

        const features =
          kind === "land" && (noise.features.city[y * width + x] ?? 0) > 0.7
            ? [{ feature: "city", population: 1000000 }]
            : [];

        const cell = {
          id,
          x,
          y,

          elevation: elevationAboveSeaLevel,

          slope,
          aspect,
          kind,
          features,

          ...(kind === "land" && { biome: biome() }),
        } as Cell;

        terrain[id] = cell;
      }
    }

    return terrain;
  };

  export const noise = (size: Geometry.Size) => ({
    elevation: Terrain.Cell.Elevation.noise(size),
    biome: Terrain.Cell.Biome.noise(size),
    features: Terrain.Cell.Features.noise(size),
  });

  export type Cell = {
    id: ID;

    x: number;
    y: number;

    elevation: Cell.Elevation;
    features: Cell.Features;

    slope: number;
    aspect: number;
  } & Cell.Kind &
    Cell.Biome;

  export function Cell({ world, cell }: World.Props & { cell: Cell }) {
    return (
      <div
        key={cell.id}
        className={classes(
          "cell absolute",
          cell.kind,
          cell.biome,
          cell.elevation >= Cell.Elevation.Mountain.threshold() && "mountain",
          cell.features.map(({ feature }) => feature)
        )}
        style={{
          left: `${(cell.x / world.width) * 100}%`,
          top: `${(cell.y / world.height) * 100}%`,
          backgroundPositionX:
            Cell.gradientSizePixels() * (1 - Math.abs(cell.elevation)),

          "--background-offset-x": `${(cell.x / world.width) * 100}%`,
          "--background-offset-y": `${(cell.y / world.height) * 100}%`,
        }}
      />
    );
  }

  export namespace Cell {
    export const gradientSizePixels = () => 2000 as const;
    export const areaInKilometers = () => 1 as const;
    export const sizePixels = () => 8 as const;

    export const styles = ({ width, height }: World) => css`
      & .cell {
        width: ${100 / width}%;
        height: ${100 / height}%;

        background-size: ${gradientSizePixels()}px;

        ${Terrain.Cell.Kind.styles()}
        ${Terrain.Cell.Features.styles()}
        ${Terrain.Cell.Biome.styles()}
        ${Terrain.Cell.Elevation.Mountain.gradient()}
      }
    `;

    export type Elevation = number;
    export namespace Elevation {
      export const noise = (size: Geometry.Size) =>
        World.Noise.generate({
          ...size,
          octaveCount: 5,
          amplitude: 0.5,
          persistence: 0.6,
        });

      export namespace Mountain {
        export const threshold = () => 0.5 as const;
        export const gradient = () => css`
          &.mountain {
            background-image: linear-gradient(
              90deg,
              #353535 ${threshold() * 100}%,
              #ffffff 100%
            );
          }
        `;
      }
    }

    export type Kind = Kind.Water | Kind.Land;
    export namespace Kind {
      export const styles = () => css`
        &.water {
          ${Terrain.Cell.Kind.Water.gradient()}/* &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background-image: url("./Waves.png");
            background-position: var(--background-offset-x)
              var(--background-offset-y);

            opacity: 0.5;
            filter: saturate(0) brightness(1.5);
            mix-blend-mode: overlay;
          } */
        }
      `;

      export type Water = { kind: "water" };
      export namespace Water {
        export const gradient = () => css`
          background-image: linear-gradient(
            90deg,
            #00fff2 0%,
            #0064bc 7%,
            #213e92 15%,
            #293d78 100%
          );
        `;
      }

      export type Land = { kind: "land" };
    }

    export type Features = Feature[];
    export namespace Features {
      export const noise = (size: Geometry.Size) => ({
        city: Terrain.Cell.Feature.City.noise(size),
      });

      export const styles = () => css`
        &.city {
          & {
            ${Terrain.Cell.Feature.City.styles()}
          }
        }
      `;
    }

    export type Feature = Feature.City;
    export namespace Feature {
      export type City = {
        feature: "city";
        population: number;
      };

      export namespace City {
        export const noise = (size: Geometry.Size) =>
          World.Noise.generate({
            ...size,
            octaveCount: 5,
            amplitude: 0.5,
            persistence: 0.6,
          });

        export const styles = () => css`
          /* background-image: url("./CityMediumDensity.png") !important;
          background-size: 100% !important; */

          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background-image: url("./CityMediumDensity.png");
            background-position: var(--background-offset-x)
              var(--background-offset-y);

            /* opacity: 0.5; */
            /* filter: saturate(0) brightness(1.5); */
            /* mix-blend-mode: overlay; */
          }
        `;
      }
    }

    export type Biome = Biome.Plains | Biome.Forest | Biome.Desert;
    export namespace Biome {
      export const noise = (size: Geometry.Size) => ({
        forest: Terrain.Cell.Biome.Forest.noise(size),
        desert: Terrain.Cell.Biome.Desert.noise(size),
      });

      export const styles = () => css`
        &.plains {
          ${Terrain.Cell.Biome.Plains.gradient()}
        }

        &.forest {
          ${Terrain.Cell.Biome.Forest.gradient()}
        }

        &.desert {
          ${Terrain.Cell.Biome.Desert.gradient()}
        }
      `;

      export type Plains = { biome: "plains" };
      export namespace Plains {
        export const gradient = () => css`
          background-image: linear-gradient(90deg, #4a9b31 0%, #87a57a 100%);
        `;
      }

      export type Forest = { biome: "forest" };
      export namespace Forest {
        export const noise = (size: Geometry.Size) =>
          World.Noise.generate({
            ...size,
            octaveCount: 3,
            amplitude: 1,
            persistence: 0.3,
          });

        export const gradient = () => css`
          background-image: linear-gradient(90deg, #2f7e46 0%, #50725a 100%);
        `;
      }

      export type Desert = { biome: "desert" };
      export namespace Desert {
        export const noise = (size: Geometry.Size) =>
          World.Noise.generate({
            ...size,
            octaveCount: 5,
            amplitude: 0.5,
            persistence: 0,
          });

        export const gradient = () => css`
          background-image: linear-gradient(90deg, #ecdc88 0%, #d5af6e 100%);
        `;
      }
    }
  }
}
