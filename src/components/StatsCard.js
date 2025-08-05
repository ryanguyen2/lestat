// components/StatsCard.js
const StatsCard = ({ stats, gamesPlayed }) => (
  <div className="stats-card">
    <h3>2023–2024 Stats</h3>
    <p>Games: {gamesPlayed}</p>
    <p>PPG: {stats.ppg}</p>
    <p>RPG: {stats.rpg}</p>
    <p>APG: {stats.apg}</p>
    <p>SPG: {stats.spg}</p>
    <p>BPG: {stats.bpg}</p>
    <p>FG%: {stats.fg_pct}</p>
    <p>FT%: {stats.ft_pct}</p>
    <p>MPG: {stats.mpg}</p>
  </div>
);
export default StatsCard;
