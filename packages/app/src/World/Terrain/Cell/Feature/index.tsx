import { Geometry } from "~/Geometry";
import { World } from "~/World";

export type Features = Feature[];
export namespace Features {
  export const noise = (size: Geometry.Size) => ({
    city: Feature.City.noise(size),
  });
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
  }
}
