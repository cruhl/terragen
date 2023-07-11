import { keyframes } from "@emotion/react";

export function Weather() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 top-0 mix-blend-screen blur-sm brightness-[70%] contrast-[600%] saturate-0"
      css={css`
        background-image: url("/Clouds.jpeg");
        background-repeat: repeat;
        background-size: 50% 50%;

        /* animation: ${animation} 10s linear infinite; */
      `}
    />
  );
}

const animation = keyframes`
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: 100% 0%;
  }
`;
