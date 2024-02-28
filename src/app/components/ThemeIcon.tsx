const ThemeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={0}
    height={0}
    className="sun"
    style={{
      position: "fixed",
    }}
  >
    <defs>
      <clipPath id="sunmoon_clip" clipPathUnits="objectBoundingBox">
        <path d="M.29 0A.29.29 0 1 1 0 .29V1h1V0H.29z" />
      </clipPath>
    </defs>
    <defs>
      <filter id="blob">
        <feGaussianBlur in="SourceGraphic" stdDeviation={0.5} />
      </filter>
    </defs>
  </svg>
);
export default ThemeIcon;
