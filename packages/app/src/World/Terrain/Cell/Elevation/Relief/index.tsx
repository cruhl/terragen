import Konva from "konva";
import * as KonvaReact from "react-konva";

import { GlobalState } from "~/GlobalState";
import { World } from "~/World";

export function Relief({ world }: World.Props) {
  const setCanvasElement = State.use(
    ({ setCanvasElement }) => setCanvasElement,
    GlobalState.shallow
  );

  const ref = useRef<Konva.Group>(null);
  const cells = useMemo(() => {
    const theta = Math.PI / 4;
    const phi = Math.PI / 4;
    const lightDirection = {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
    };

    return Object.values(world.terrain).map((cell) => {
      const north =
        world.terrain[`${cell.x},${cell.y - 1}`]?.elevation ?? cell.elevation;

      const south =
        world.terrain[`${cell.x},${cell.y + 1}`]?.elevation ?? cell.elevation;

      const east =
        world.terrain[`${cell.x + 1},${cell.y}`]?.elevation ?? cell.elevation;

      const west =
        world.terrain[`${cell.x - 1},${cell.y}`]?.elevation ?? cell.elevation;

      const dx = west - east;
      const dy = north - south;
      const dz = 1;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const nx = dx / len;
      const ny = dy / len;
      const nz = dz / len;

      const dot =
        nx * lightDirection.x + ny * lightDirection.y + nz * lightDirection.z;

      const shade = Math.max(dot, 0);
      const fill = `hsla(0, 0%, ${shade * 100}%)`;

      return (
        <KonvaReact.Rect
          key={cell.id}
          fill={fill}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
        />
      );
    });
  }, [world]);

  useEffect(() => {
    const canvasElement = ref.current?.toCanvas();
    canvasElement && setCanvasElement(canvasElement);
  }, [setCanvasElement]);

  return <KonvaReact.Group ref={ref}>{cells}</KonvaReact.Group>;
}

export namespace Relief {
  export namespace CanvasElement {
    export const use = () =>
      State.use(({ canvasElement }) => canvasElement, GlobalState.shallow);
  }
}

type State = {
  canvasElement?: HTMLCanvasElement;
  setCanvasElement: (canvasElement: HTMLCanvasElement) => void;
};

namespace State {
  export const use = GlobalState.create<State>((set) => ({
    setCanvasElement: (canvasElement) => set({ canvasElement }),
  }));
}
