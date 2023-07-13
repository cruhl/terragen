import Konva from "konva";
import * as KonvaReact from "react-konva";

import { GlobalState } from "~/GlobalState";
import { World } from "~/World";

export function Map({ world }: World.Props) {
  const setCanvasElement = State.use(
    ({ setCanvasElement }) => setCanvasElement,
    GlobalState.shallow
  );

  const ref = useRef<Konva.Group>(null);
  const cells = useMemo(
    () =>
      Object.values(world.terrain).map((cell) => {
        const fill = `hsla(0, 0%, ${((cell.elevation + 1) / 2) * 100}%)`;
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
      }),
    [world]
  );

  useEffect(() => {
    const canvasElement = ref.current?.toCanvas();
    canvasElement && setCanvasElement(canvasElement);
  }, [setCanvasElement]);

  return <KonvaReact.Group ref={ref}>{cells}</KonvaReact.Group>;
}

export namespace Map {
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
