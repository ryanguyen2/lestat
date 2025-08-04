import React, { Component } from 'react';
import axios from 'axios';
const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      playerInfo: null,
      playerStats: null,
      gamesPlayed: 0,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.playerName.trim()) {
      alert('Please enter a player name');
      return;
    }
    this.getPlayerId();
  };

  handleChange = (event) => {
    this.setState({ playerName: event.target.value });
  };

  getPlayerId = () => {
    const fullName = this.state.playerName.trim();
    const [firstNameInput, lastNameInput] = fullName.split(' ');

    if (!lastNameInput) {
      alert('Please enter full name (e.g., Stephen Curry)');
      return;
    }

    axios
      .get(`https://api-nba-v1.p.rapidapi.com/players?search=${lastNameInput}`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
        },
      })
      .then(async (res) => {
        const players = res.data.response;

        const matchedPlayer = players.find(
          (p) =>
            p.firstname.toLowerCase() === firstNameInput.toLowerCase() &&
            p.lastname.toLowerCase() === lastNameInput.toLowerCase()
        );

        if (!matchedPlayer) {
          alert('Player not found. Try again.');
          return;
        }

        this.setState({ playerInfo: matchedPlayer });
        await this.getPlayerStats(matchedPlayer.id);
      })
      .catch((err) => {
        console.error(err);
        alert('Error fetching player info');
      });
  };

  getPlayerStats = (playerId) => {
    axios
      .get(`https://api-nba-v1.p.rapidapi.com/players/statistics?id=${playerId}&season=2023`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
        },
      })
      .then((res) => {
        const allGames = res.data.response;
        const playedGames = allGames.filter((game) => game.min && game.min !== '0');

        if (playedGames.length === 0) {
          alert('No games found for this player in 2023–2024.');
          return;
        }

        const totals = playedGames.reduce(
          (acc, game) => {
            acc.points += game.points || 0;
            acc.rebounds += game.totReb || 0;
            acc.assists += game.assists || 0;
            acc.steals += game.steals || 0;
            acc.blocks += game.blocks || 0;
            acc.fgm += game.fgm || 0;
            acc.fga += game.fga || 0;
            acc.ftm += game.ftm || 0;
            acc.fta += game.fta || 0;
            acc.minutes += parseInt(game.min) || 0;
            acc.games += 1;
            return acc;
          },
          {
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            fgm: 0,
            fga: 0,
            ftm: 0,
            fta: 0,
            minutes: 0,
            games: 0,
          }
        );

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

        this.setState({ playerStats: averages, gamesPlayed: totals.games });
      })
      .catch((err) => {
        console.error(err);
        alert('Error fetching stats');
      });
  };

  render() {
    const { playerName, playerStats, gamesPlayed, playerInfo } = this.state;

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            Player Name:&nbsp;
            <input
              type="text"
              value={playerName}
              onChange={this.handleChange}
              placeholder="e.g. LeBron James"
            />
          </label>
          <input type="submit" value="Search" />
        </form>

        {playerStats && playerInfo && (
          <div>
            <h2>
              Stats for {playerInfo.firstname} {playerInfo.lastname} (2023–2024)
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
            <p>Position: {playerInfo.leagues?.standard?.pos || 'N/A'}</p>
            <p>Jersey: {playerInfo.leagues?.standard?.jersey || 'N/A'}</p>
            <p>Country: {playerInfo.birth?.country || 'N/A'}</p>
            <p>Draft Year: {playerInfo.nba?.start || 'N/A'}</p>
            <p>College: {playerInfo.college || 'N/A'}</p>
            <p>Height: {playerInfo.height.feets}'{playerInfo.height.inches || ''}</p>
            <p>Weight: {playerInfo.weight.pounds} lbs</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
