const JerseyDisplay = ({ svgFile, numberColor, jerseyNumber }) => (
  <div className="jersey-container">
    <img
      src={`${process.env.PUBLIC_URL}/images/${svgFile}`}
      alt="jersey"
      className="jersey-img"
    />

    <div className="jersey-number" style={{ color: numberColor }}>
      {jerseyNumber}
    </div>
  </div>
);
export default JerseyDisplay;
