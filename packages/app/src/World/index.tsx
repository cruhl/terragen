import * as ReactKonva from "react-konva";

import { Geometry } from "~/Geometry";
import { GlobalState } from "~/GlobalState";

import { Noise } from "./Noise";
import { PostProcessing } from "./PostProcessing";
import { ReliefMap } from "./ReliefMap";
import { Terrain } from "./Terrain";
import { Weather } from "./Weather";

export type World = Geometry.Size & {
  terrain: Terrain;
};

export function World() {
  const world = World.use();
  return (
    <>
      <ReactKonva.Stage width={window.innerWidth} height={window.innerHeight}>
        <ReactKonva.Layer>
          <ReactKonva.Text text="Try click on rect" />
        </ReactKonva.Layer>
      </ReactKonva.Stage>
      <div className="flex h-full max-h-[100cqw] w-full max-w-[100cqh]">
        <ReactKonva.Stage
          className="absolute left-0 top-0"
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <ReactKonva.Layer>
            <ReactKonva.Rect
              fill="red"
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          </ReactKonva.Layer>
        </ReactKonva.Stage>
        {false && (
          <div className="relative m-24 grow">
            <Terrain world={world} />
            <ReliefMap world={world} />
            <World.PostProcessing />
            <World.Weather />
          </div>
        )}
      </div>
    </>
  );
}

export declare namespace World {
  export { Noise, PostProcessing, ReliefMap, Terrain, Weather };
}

export namespace World {
  World.Noise = Noise;
  World.PostProcessing = PostProcessing;
  World.ReliefMap = ReliefMap;
  World.Terrain = Terrain;
  World.Weather = Weather;

  export type Props = { world: World };

  const useState = GlobalState.create(() => {
    const size = { width: 100, height: 100 };
    const world = { ...size, terrain: Terrain.generate(size) };
    return {
      world,
    };
  });

  export const use = () => useState(({ world }) => world, GlobalState.shallow);
}
