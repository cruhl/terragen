import * as KonvaReact from "react-konva";

import { World } from "~/World";

import { Map } from "./Map";

export function Ocean({ world }: World.Props) {
  return (
    <>
      <KonvaReact.Layer>
        <Map world={world} />
      </KonvaReact.Layer>
    </>
  );
}

export declare namespace Ocean {
  export { Map };
}

export namespace Ocean {
  Ocean.Map = Map;
}
