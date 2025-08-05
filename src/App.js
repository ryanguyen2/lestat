// src/App.js
import React, { Component } from 'react';
import './App.css';
import teamJerseyMap from './teamJerseyMap';

import SearchBar from './components/SearchBar';
import PlayerInfo from './components/PlayerInfo';
import StatsCard from './components/StatsCard';
import TeamDisplay from './components/TeamDisplay';
import JerseyDisplay from './components/JerseyDisplay';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;

const backgroundStyle = {
  minHeight: '100vh',
  backgroundImage: `linear-gradient(rgba(12,12,12,0.8), rgba(12,12,12,0.8)), url("/images/miami.jpg")`,
  backgroundPosition: 'center 80%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

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
    const [first, last] = name.split(' ');
    if (!last) return alert('Enter full name (e.g., LeBron James)');
    this.getPlayerId(first, last);
  };

  getPlayerId = (first, last) => {
    fetch(`https://api-nba-v1.p.rapidapi.com/players?search=${last}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    })
      .then(res => res.json())
      .then(data => {
        const match = data.response.find(
          p => p.firstname.toLowerCase() === first.toLowerCase() &&
            p.lastname.toLowerCase() === last.toLowerCase()
        );
        if (!match) return alert('Player not found.');
        this.setState({ playerInfo: match });
        this.getPlayerStats(match.id);
      })
      .catch(err => console.error(err));
  };

  getPlayerStats = (id) => {
    fetch(`https://api-nba-v1.p.rapidapi.com/players/statistics?id=${id}&season=2023`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    })
      .then(res => res.json())
      .then(data => {
        const games = data.response.filter(g => g.min && g.min !== '0');
        if (!games.length) return alert('No games played this season.');
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
          points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
          fgm: 0, fga: 0, ftm: 0, fta: 0, minutes: 0, games: 0
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
      .catch(err => console.error(err));
  };


  render() {
    const { playerInfo, playerStats, gamesPlayed, currentTeam } = this.state;
    const jerseyData = currentTeam && teamJerseyMap[currentTeam.nickname];

    return (
      <div className="App">
        <div className="App" style={backgroundStyle}>
          <Navbar />
          <h1>nba stats. one search.</h1>
          <SearchBar
            value={this.state.playerName}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
          {playerInfo && playerStats && (
            <div className="card">
              <PlayerInfo player={playerInfo} />
              <StatsCard stats={playerStats} gamesPlayed={gamesPlayed} />
              <TeamDisplay team={currentTeam} />
              {jerseyData && (
                <JerseyDisplay
                  svgFile={jerseyData.svg}
                  numberColor={jerseyData.numberColor}
                  jerseyNumber={playerInfo.leagues.standard.jersey || '??'}
                />
              )}
            </div>
          )}
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;
