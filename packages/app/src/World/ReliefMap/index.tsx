import { World } from "~/World";

export function ReliefMap({ world }: World.Props) {
  const cells = useMemo(() => {
    const theta = Math.PI / 4;
    const phi = Math.PI / 4;
    const lightDirection = {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
    };

    return Object.values(world.terrain).map((cell) => {
      if (cell.elevation < 0) return null;

      const dzdx = Math.sin(cell.slope) * Math.cos(cell.aspect);
      const dzdy = Math.sin(cell.slope) * Math.sin(cell.aspect);
      const dzdz = Math.cos(cell.slope);

      const dotProduct =
        dzdx * lightDirection.x +
        dzdy * lightDirection.y +
        dzdz * lightDirection.z;

      const shade = Math.max(0, dotProduct);

      return (
        <div
          key={cell.id}
          css={css`
            position: absolute;
            width: ${100 / world.width}%;
            height: ${100 / world.height}%;
          `}
          style={{
            left: `${(cell.x / world.width) * 100}%`,
            top: `${(cell.y / world.height) * 100}%`,
            backgroundColor: `hsl(0, 0%, ${shade * 100}%)`,
          }}
        />
      );
    });
  }, [world]);

  return (
    <div className="opacity-70 mix-blend-overlay brightness-[75%] contrast-[800%]">
      {cells}
    </div>
  );
}
