// App.js
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import teamJerseyMap from './teamJerseyMap';

const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;

class App extends Component {
  state = {
    playerName: '',
    playerInfo: null,
    playerStats: null,
    gamesPlayed: 0,
    currentTeam: null,
  };

  handleChange = (e) => {
    this.setState({ playerName: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const name = this.state.playerName.trim();
    if (!name) {
      alert('Please enter a player name');
      return;
    }
    const [first, last] = name.split(' ');
    if (!last) {
      alert('Please enter full name (e.g. LeBron James)');
      return;
    }
    this.getPlayerId(first, last);
  };

  getPlayerId = (first, last) => {
    axios
      .get(`https://api-nba-v1.p.rapidapi.com/players?search=${last}`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
        },
      })
      .then(res => {
        const match = res.data.response.find(
          p =>
            p.firstname.toLowerCase() === first.toLowerCase() &&
            p.lastname.toLowerCase() === last.toLowerCase()
        );
        if (!match) {
          alert('Player not found. Try again.');
          return;
        }
        this.setState({ playerInfo: match });
        this.getPlayerStats(match.id);
      })
      .catch(err => {
        console.error(err);
        alert('Error fetching player info');
      });
  };

  getPlayerStats = (playerId) => {
    axios
      .get(
        `https://api-nba-v1.p.rapidapi.com/players/statistics?id=${playerId}&season=2023`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
          },
        }
      )
      .then(res => {
        const games = res.data.response.filter(g => g.min && g.min !== '0');
        if (!games.length) {
          alert('No games found for this player in 2023–2024.');
          return;
        }


        const { team } = games[0];

        const totals = games.reduce((acc, g) => {
          acc.points += g.points || 0;
          acc.rebounds += g.totReb || 0;
          acc.assists += g.assists || 0;
          acc.steals += g.steals || 0;
          acc.blocks += g.blocks || 0;
          acc.fgm += g.fgm || 0;
          acc.fga += g.fga || 0;
          acc.ftm += g.ftm || 0;
          acc.fta += g.fta || 0;
          acc.minutes += parseInt(g.min) || 0;
          acc.games += 1;
          return acc;
        }, {
          points: 0, rebounds: 0, assists: 0, steals: 0,
          blocks: 0, fgm: 0, fga: 0, ftm: 0, fta: 0,
          minutes: 0, games: 0
        });


        const averages = {
          ppg: (totals.points / totals.games).toFixed(1),
          rpg: (totals.rebounds / totals.games).toFixed(1),
          apg: (totals.assists / totals.games).toFixed(1),
          spg: (totals.steals / totals.games).toFixed(1),
          bpg: (totals.blocks / totals.games).toFixed(1),
          fg_pct: totals.fga ? ((totals.fgm / totals.fga) * 100).toFixed(1) : 'N/A',
          ft_pct: totals.fta ? ((totals.ftm / totals.fta) * 100).toFixed(1) : 'N/A',
          mpg: (totals.minutes / totals.games).toFixed(1),
        };


        this.setState({
          playerStats: averages,
          gamesPlayed: totals.games,
          currentTeam: {
            id: team.id,
            name: team.name,
            nickname: team.nickname,
            code: team.code,
            logo: team.logo,
          },
        });
      })
      .catch(err => {
        console.error(err);
        alert('Error fetching stats');
      });
  };

  render() {
    const { playerInfo, playerStats, gamesPlayed, currentTeam } = this.state;
    const jerseyData = currentTeam && teamJerseyMap[currentTeam.nickname];
    const jerseyNum = playerInfo?.leagues?.standard?.jersey || '??';

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            Player Name:&nbsp;
            <input
              type="text"
              value={this.state.playerName}
              onChange={this.handleChange}
              placeholder="e.g. LeBron James"
            />
          </label>
          <input type="submit" value="Search" />
        </form>

        {playerStats && playerInfo && (
          <div className="player-container">
            <h2>
              {playerInfo.firstname} {playerInfo.lastname} — 2023–2024
            </h2>
            <p>Games Played: {gamesPlayed}</p>
            <p>PPG: {playerStats.ppg}</p>
            <p>RPG: {playerStats.rpg}</p>
            <p>APG: {playerStats.apg}</p>
            <p>SPG: {playerStats.spg}</p>
            <p>BPG: {playerStats.bpg}</p>
            <p>FG%: {playerStats.fg_pct}</p>
            <p>FT%: {playerStats.ft_pct}</p>
            <p>MPG: {playerStats.mpg}</p>

            <hr />

            <p>Position: {playerInfo.leagues.standard.pos}</p>
            <p>Country: {playerInfo.birth.country}</p>
            <p>Draft Year: {playerInfo.nba.start}</p>
            <p>College: {playerInfo.college}</p>
            <p>
              Height: {playerInfo.height.feets}'{playerInfo.height.inches}"
            </p>
            <p>Weight: {playerInfo.weight.pounds} lbs</p>

            {currentTeam && (
              <>
                <h3>{currentTeam.name}</h3>
                <img
                  src={currentTeam.logo}
                  alt={`${currentTeam.nickname} logo`}
                  className="team-logo"
                />
              </>
            )}

            {jerseyData && (
              <div className="jersey-container">
                <img
                  src={`/images/${jerseyData.svg}`}
                  alt={`${currentTeam.nickname} jersey`}
                  className="jersey-img"
                />
                <div
                  className="jersey-number"
                  style={{ color: jerseyData.numberColor }}
                >
                  {jerseyNum}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
