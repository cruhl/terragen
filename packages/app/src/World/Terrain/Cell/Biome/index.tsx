import { Geometry } from "~/Geometry";
import { World } from "~/World";

export type Biome = Biome.Plains | Biome.Forest | Biome.Desert;
export namespace Biome {
  export const noise = (size: Geometry.Size) => ({
    forest: Biome.Forest.noise(size),
    desert: Biome.Desert.noise(size),
  });

  export const styles = () => css`
    &.plains {
      ${Biome.Plains.gradient()}
    }

    &.forest {
      ${Biome.Forest.gradient()}
    }

    &.desert {
      ${Biome.Desert.gradient()}
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
