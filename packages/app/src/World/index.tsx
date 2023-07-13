import * as KonvaReact from "react-konva";

import { Geometry } from "~/Geometry";
import { GlobalState } from "~/GlobalState";

import { Noise } from "./Noise";
import { Ocean } from "./Ocean";
import { PostProcessing } from "./PostProcessing";
import { Terrain } from "./Terrain";
import { Weather } from "./Weather";

export type World = Geometry.Size & {
  terrain: Terrain;
};

export function World() {
  const world = World.use();
  return (
    <>
      <div className="flex h-full max-h-[100cqw] w-full max-w-[100cqh]">
        <KonvaReact.Stage
          className="absolute left-0 top-0"
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Ocean world={world} />
          <Terrain world={world} />
        </KonvaReact.Stage>
      </div>
    </>
  );
}

export declare namespace World {
  export { Noise, PostProcessing, Terrain, Weather };
}

export namespace World {
  World.Noise = Noise;
  World.PostProcessing = PostProcessing;
  World.Terrain = Terrain;
  World.Weather = Weather;

  export type Props = { world: World };

  const useState = GlobalState.create(() => {
    const size = { width: 100, height: 100 };
    const world = { ...size, terrain: Terrain.Generation.execute(size) };
    return {
      world,
    };
  });

  export const use = () => useState(({ world }) => world, GlobalState.shallow);
}
