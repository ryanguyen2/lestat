const TeamDisplay = ({ team }) => (
  <div className="team-display">
    <img src={team.logo} alt={`${team.nickname} logo`} className="team-logo" />
  </div>
);
export default TeamDisplay;
