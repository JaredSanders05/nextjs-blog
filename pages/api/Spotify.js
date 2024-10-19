import { useEffect, useState, useRef } from "react";
import axios from 'axios';

const CLIENT_ID = "7d795eebfbe44d3db59d5691006cd34d";
const YOUR_CLIENT_SECRET = "c1811e7d4cee4efbbe598a9d1140d0d2";
const REDIRECT_URI = "jaredsanders.vercel.app";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPE = 'user-read-currently-playing user-top-read';


const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const generateCodeChallenge = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    window.localStorage.setItem('code_verifier', codeVerifier);
    const params = {
        response_type: RESPONSE_TYPE,
        client_id: CLIENT_ID,
        scope: SCOPE,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: REDIRECT_URI,
    };
    const authUrl = new URL(AUTH_ENDPOINT);
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

const App = () => {
    const [token, setToken] = useState("");
    const [currentTrack, setCurrentTrack] = useState(null);
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [view, setView] = useState('artists'); // State to manage the current view
    const scrollRef = useRef(null); // Reference for the scroll container

    const refreshToken = async () => {
        const refreshToken = window.localStorage.getItem('refresh_token');
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: CLIENT_ID,
                    client_secret: YOUR_CLIENT_SECRET,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const newAccessToken = response.data.access_token;
            window.localStorage.setItem('token', newAccessToken);
            setToken(newAccessToken);
            return newAccessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
        }
    };

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refresh_token");
    };

    axios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const newAccessToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            const codeVerifier = window.localStorage.getItem('code_verifier');
            axios.post('https://accounts.spotify.com/api/token', null, {
                params: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    code_verifier: codeVerifier,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${CLIENT_ID}:${YOUR_CLIENT_SECRET}`)}`,
                },
            }).then(response => {
                setToken(response.data.access_token);
                window.localStorage.setItem('token', response.data.access_token);
                window.localStorage.setItem('refresh_token', response.data.refresh_token);
                window.history.replaceState({}, document.title, "/");
            }).catch(error => {
                console.error('Error exchanging code for token:', error);
            });
        } else {
            const storedToken = window.localStorage.getItem("token");
            if (!storedToken) {
                generateCodeChallenge();
            } else {
                setToken(storedToken);
            }
        }
    }, []);

    useEffect(() => {
        const fetchCurrentlyPlaying = async () => {
            if (token) {
                try {
                    const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
                        headers: {Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.data && response.data.item) {
                        setCurrentTrack(response.data);
                        const remainingTime = response.data.item.duration_ms - response.data.progress_ms;
                        setTimeout(fetchCurrentlyPlaying, remainingTime);
                    } else {
                        setCurrentTrack(null);
                        setTimeout(fetchCurrentlyPlaying, 60);
                    }
                } catch (error) {
                    console.error('Error fetching currently playing track:', error);
                }
            }
        };

        const fetchTopArtists = async () => {
            if (token) {
                try {
                    const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
                        headers: {Authorization: `Bearer ${token}`
                        }
                    });
                    setTopArtists(response.data.items.slice(0, 3)); // Limit to top 5 artists
                } catch (error) {
                    console.error('Error fetching top artists:', error);
                }
            }
        };

        const fetchTopTracks = async () => {
            if (token) {
                try {
                    const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setTopTracks(response.data.items.slice(0, 3));
                } catch (error) {
                    console.error('Error fetching top tracks:', error);
                }
            }
        };

        fetchCurrentlyPlaying();
        fetchTopArtists();
        fetchTopTracks();
    }, [token]);

    const scrollRight = () => {
        if (view === 'current') {
            setView('artists');
        } else if (view === 'artists') {
            setView('tracks');
        } else if (view === 'tracks') {
            setView('current');
        }
    };
    
    const scrollLeft = () => {
        if (view === 'current') {
            setView('tracks');
        } else if (view === 'tracks') {
            setView('artists');
        } else if (view === 'artists') {
            setView('current');
        }
    };
    
    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify Data Analysis</h1>
                <h2>
                    As an avid music enthusiast, I leverage Spotify’s data to analyze my listening habits and trends.
                    Below is a detailed breakdown of my current and all-time favorite tracks, artists, and genres, showcasing my data analysis skills.
                </h2>

                {!token ? (
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
                        Login to Spotify
                    </a>
                ) : (
                    <p></p>
                )}

                {token && (
                    <div className="scroll-container" ref={scrollRef}>
                        <div className="scroll-content">
                            <button onClick={scrollLeft} className="scroll-arrow left">{"<"}</button>
                            {view === 'current' && (
                                <div className="currently-playing">
                                    <h2>Currently Playing</h2>
                                    {currentTrack ? (
                                        <div className="track-info">
                                            <img src={currentTrack.item.album.images[0].url} alt="Album cover" className="album-cover" />
                                            <p>{currentTrack.item.name} by {currentTrack.item.artists.map(artist => artist.name).join(", ")}</p>
                                        </div>
                                    ) : (
                                        <div className="track-info">
                                            <p>Currently not listening to music</p>
                                        </div>
                                    )}
                                </div>
                            )}


                            {view === 'artists' && (
                                <div className="top-artists">
                                    <h2>Top Artists</h2>
                                    <ul>
                                        {topArtists.map(artist => (
                                            <li key={artist.id}>
                                                <img src={artist.images[0].url} alt={artist.name} className="artist-profile" />
                                                <p>{artist.name}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {view === 'tracks' && (
                                <div className="top-tracks">
                                    <h2>Top Songs</h2>
                                    <ul>
                                        {topTracks.map(track => (
                                            <li key={track.id}>
                                                <img src={track.album.images[0].url} alt={track.name} className="track-cover" />
                                                <p>{track.name} by {track.artists.map(artist => artist.name).join(", ")}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button onClick={scrollRight} className="scroll-arrow right">{">"}</button>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );

};

export default App;
