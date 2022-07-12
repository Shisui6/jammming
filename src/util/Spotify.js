let accessToken;
const client_id = 'cb786b778d104ef38bae3cb91e031a06';
const redirect_uri = 'http://playlist-creator.surge.sh';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } else {
            let act = window.location.href.match('access_token');
            let exp = window.location.href.match('expires_in');
            if (act && exp) {
                let params = {};
                let e, r = /([^&;=]+)=?([^&;]*)/g,
                q = window.location.hash.substring(1);
                // eslint-disable-next-line no-cond-assign
                while ( e = r.exec(q)) {
                    params[e[1]] = decodeURIComponent(e[2]);
                }
                accessToken = params.access_token;
                let expiresIn = params.expires_in;
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
            } else {
                let url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
                window.location = url;
            }
        }
    },

    async search(term) {
        this.getAccessToken();
        
        try {
            let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}});
            if (response.ok) {
                let jsonResponse = await response.json();
                let trackArray = [];
                trackArray = jsonResponse.tracks.items
                return trackArray;
            }
            throw new Error('Request failed!');
        } catch (error) {
            console.log(error)
        }
    },

    async savePlaylist(playlistName, trackURIs) {
        if (!(playlistName && trackURIs)) {
            return;
        }

        this.getAccessToken();
        let headers = {Authorization: `Bearer ${accessToken}`};
        let user_id = '';
        let playlist_id = ''
        let data = JSON.stringify({
            name: playlistName,
        })
        let data1 = JSON.stringify({
            uris: trackURIs
        })

        try {
            let response = await fetch('https://api.spotify.com/v1/me', {headers: headers});
            if (response.ok) {
                let jsonResponse = await response.json();
                user_id = jsonResponse.id;
            }

            throw new Error('Request Failed!')
        } catch (error) {
            console.log(error);
        }

        try {
            let response = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                method: 'POST',
                body: data,
                headers: headers
            })
            if (response.ok) {
                let jsonResponse = await response.json();
                playlist_id = jsonResponse.id;
            }

            throw new Error('Post Request Failed!')
        } catch (error) {
            console.log(error);
        }

        try {
            let response = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, {
                method: 'POST',
                body: data1,
                headers: headers
            })
            if (response.ok) {
                let jsonResponse = await response.json();
                playlist_id = jsonResponse.id;
            }

            throw new Error('Post Request Failed!')
        } catch (error) {
            console.log(error)
        }

    }

};

export {Spotify}