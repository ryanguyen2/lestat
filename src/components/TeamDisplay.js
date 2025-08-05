// components/TeamDisplay.js
const TeamDisplay = ({ team }) => (
  <div className="team-display">
    <h3>{team.name}</h3>
    <img src={team.logo} alt={`${team.nickname} logo`} className="team-logo" />
  </div>
);
export default TeamDisplay;
