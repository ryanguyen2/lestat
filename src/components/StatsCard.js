// src/components/StatsCard.js
const StatsCard = ({ stats, gamesPlayed }) => {
  return (
    <div className="stats-card">

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{stats.ppg}</div>
          <div className="stat-label">PPG</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.rpg}</div>
          <div className="stat-label">RPG</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.apg}</div>
          <div className="stat-label">APG</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.spg}</div>
          <div className="stat-label">SPG</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.bpg}</div>
          <div className="stat-label">BPG</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.fg_pct}%</div>
          <div className="stat-label">FG%</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.ft_pct}%</div>
          <div className="stat-label">FT%</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.mpg}</div>
          <div className="stat-label">MPG</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.plusMinus}</div>
          <div className="stat-label">+/−pg</div>
        </div>
      </div>

    </div>
  );
};

export default StatsCard;
