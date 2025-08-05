// components/PlayerInfo.js
const PlayerInfo = ({ player }) => (
  <div className="player-info">
    <h2>{player.firstname} {player.lastname}</h2>
    <p>Position: {player.leagues.standard.pos}</p>
    <p>Country: {player.birth.country}</p>
    <p>Draft Year: {player.nba.start}</p>
    <p>College: {player.college || 'N/A'}</p>
    <p>Height: {player.height.feets}'{player.height.inches}"</p>
    <p>Weight: {player.weight.pounds} lbs</p>
  </div>
);
export default PlayerInfo;
