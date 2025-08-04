import React, { Component } from 'react';
import axios from "axios";
const apiKey = process.env.REACT_APP_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      playerStats: {},
      gamesPlayed: 0,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.playerName.trim()) {
      alert("Please enter a player name");
      return;
    }
    this.getPlayerId();
    console.log(this.state.playerName);
  };

  handleChange = (event) => {
    this.setState({ playerName: event.target.value });
  };

  getPlayerId = () => {
    const fullName = this.state.playerName.trim();
    const [firstNameInput, lastNameInput] = fullName.split(" ");

    axios.get(`https://api.balldontlie.io/v1/players?search=${lastNameInput || firstNameInput}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
      .then(async res => {
        const players = res.data.data;

        const matchedPlayer = players.find(player =>
          player.first_name.toLowerCase() === (firstNameInput || "").toLowerCase() &&
          player.last_name.toLowerCase() === (lastNameInput || "").toLowerCase()
        );

        if (!matchedPlayer) {
          alert("Player not found. Please try again or enter a more specific name.");
          return;
        }

        await this.getPlayerStats(matchedPlayer.id);
      })
      .catch(err => {
        console.log(err);
        alert("Error fetching player data");
      });
  };

  getPlayerStats = (playerId) => {
    axios.get(`https://api.balldontlie.io/v1/stats?player_ids[]=${playerId}&seasons[]=2023&per_page=100`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
      .then(res => {
        console.log(res.data.data);
        this.setState({
          playerStats: res.data.data[0],
          gamesPlayed: res.data.data.length
        });
      })
      .catch(err => {
        console.log(err);
        alert("Error fetching stats");
      });
  };

  componentDidMount() {
    this.getPlayerId();
  }

  render() {
    const { playerName, playerStats, gamesPlayed } = this.state;

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={playerName}
              onChange={this.handleChange}
              placeholder="e.g. Stephen Curry"
            />
          </label>
          <input type="submit" value="Submit" />
        </form>

        {gamesPlayed > 0 && (
          <div>
            <h2>Stats for {playerStats.player?.first_name} {playerStats.player?.last_name}</h2>
            <p>Games Played: {gamesPlayed}</p>
            <p>Points: {playerStats.pts}</p>
            <p>Rebounds: {playerStats.reb}</p>
            <p>Assists: {playerStats.ast}</p>
            <p>Steals: {playerStats.stl}</p>
            <p>Blocks: {playerStats.blk}</p>
            <p>FG%: {playerStats.fg_pct}</p>
            <p>FT%: {playerStats.ft_pct}</p>
            <p>Minutes: {playerStats.min}</p>
            <p>Position: {playerStats.player?.position}</p>
            <p>Jersey: {playerStats.player?.jersey_number || "N/A"}</p>
            <p>Country: {playerStats.player?.country}</p>
            <p>Draft Year: {playerStats.player?.draft_year}</p>
            <p>Draft Round: {playerStats.player?.draft_round}</p>
            <p>Draft Number: {playerStats.player?.draft_number}</p>
            <p>Team: {playerStats.team?.full_name}</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
