// src/components/PlayerInfo.js
import countryCodeMap from './countryCodeMap';

const PlayerInfo = ({ player, team }) => {
  const country = player.birth.country;
  const countryCode = countryCodeMap[country];

  return (
    <div className="player-info">
      <h2 className="player-name">
        {player.firstname} {player.lastname}
      </h2>

      <p className="player-subheader">
        Position: {player.leagues.standard.pos} &nbsp;|&nbsp;
        Height: {player.height.feets}'{player.height.inches}" &nbsp;|&nbsp;
        Weight: {player.weight.pounds} lbs
      </p>

      <div className="meta-grid">
        {countryCode && (
          <div className="meta-item">
            <img
              src={`https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`}
              alt={`${country} flag`}
              className="country-flag"
            />
            <p className="stat-label">{country}</p>
          </div>
        )}

        {team?.logo && (
          <div className="meta-item">
            <img
              src={team.logo}
              alt="Team Logo"
              className="team-logo"
            />
            <p className="stat-label">{team.nickname}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
