import React, { Component } from 'react';
import axios from "axios";
const apiKey = process.env.REACT_APP_API_KEY;


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerName: null,
    }
  }

  getPlayerId = () => {
    axios.get("https://api.balldontlie.io/v1/players?search=lebron", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
      .then(res => {
        console.log(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getPlayerStats = () => {
    axios.get("https://api.balldontlie.io/v1/stats?player_ids[]=237&seasons[]=2023&per_page=100", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
      .then(async res => {
        console.log(res.data.data)
      }).catch(err => {
        console.log(err)
      })
  }

  componentDidMount() {
    this.getPlayerId()
    this.getPlayerStats()
  }


  render() {
    return (
      <div className="App" >

      </div>
    );
  }
}

export default App;










