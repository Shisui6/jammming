import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchResults: [],
                  playlistName: 'New Playlist',
                  playlistTracks: []}

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let newPlaylist = this.state.playlistTracks;
    let x = 0
    this.state.playlistTracks.forEach(song => {
      if (song.id === track.id) {
        x++;
      }
    })
    if (x === 0) {
      newPlaylist.push(track)
      this.setState({playlistTracks: newPlaylist})
    }
  }

  removeTrack(track) {
    let index = this.state.playlistTracks.findIndex(song => song.id === track.id);
    let newPlaylist = this.state.playlistTracks;
    newPlaylist.splice(index, 1);
    this.setState({playlistTracks: newPlaylist});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.forEach(song => {
      trackURIs.push(song.uri);
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist', 
                   playlistTracks: []})
  }

  search(term) {
    Spotify.search(term).then(value => {
      this.setState({searchResults: value})
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
      
    );
  }
}

export default App;
