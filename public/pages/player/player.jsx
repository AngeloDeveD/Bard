import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import PlayerIcons from "../player_icons/player_icons";
import { useSelector } from 'react-redux';

import AddToPlaylist from "../addToPlaylist/addToPlaylist";

import './player.scss';

const loopStates = {
    NO_LOOP: 'No Loop',
    PLAYLIST_LOOP: 'Playlist Loop',
    TRACK_LOOP: 'Track Loop'
};

export default function Player() {

    const userId = useSelector(state => state.user.userId);

    const trackId = useSelector(state => state.user.trackId);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [played, setPlayed] = useState(0.0);
    const [volume, setVolume] = useState(1.0); //Означает, что начальный уровень громкости будет равен 100%
    const [loopState, setLoopState] = useState(loopStates.NO_LOOP);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [volumeDis, setVolumeDis] = useState(true);
    const [showedText, setShowedText] = useState(false);
    const [isMixed, setIsMixed] = useState(false);
    const [pressedEqualizer, setPressedEqualizer] = useState(false);
    const [hasSeeked, setHasSeeked] = useState(false);
    const [disablePlayer, setDisablePlayer] = useState(false);
    const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

    const [trackUrl, setTrackUrl] = useState('');

    const [currentSong, setCurrentSong] = useState(trackId);
    const [previousSongs, setPreviousSong] = useState([]);
    const [nextSongs, setNextSongs] = useState([]);

    const playerRef = useRef(null);

    const wrapperRef = useRef(null);

    const onSeek = () => {
        setHasSeeked(true);
    };

    const toggleShowText = () => {
        setShowedText(!showedText);
    }

    const toggleEqualizer = () => {
        setPressedEqualizer(!pressedEqualizer);
    }

    const toggleMix = () => {
        setIsMixed(!isMixed);
    }

    const togglePlayPause = () => {
        if (trackId !== undefined) {
            setIsPlaying(!isPlaying);
        }
    }

    const onProgress = (progress) => {
        if (!seeking) {
            console.log(`play: ${progress.played * duration}`);
            setPlayed(progress.played * duration);
            setHasSeeked(false); // Сбросить состояние после обновления
        }
    }

    const seekTo = (value) => {
        playerRef.current.seekTo(value);
    };

    const onVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    const toggleLoop = () => {
        switch (loopState) {
            case loopStates.NO_LOOP:
                setLoopState(loopStates.PLAYLIST_LOOP);
                break;
            case loopStates.PLAYLIST_LOOP:
                setLoopState(loopStates.TRACK_LOOP);
                break;
            case loopStates.TRACK_LOOP:
                setLoopState(loopStates.NO_LOOP);
                break;
            default:
                setLoopState(loopStates.NO_LOOP);
                break;
        }
    };

    const onDuration = (duration) => {
        setDuration(duration);
    };

    const onSeekMouseDown = () => {
        setSeeking(true); // Пользователь начал перемотку
    };

    const onSeekChange = (e) => {
        console.log(`Changed: ${parseFloat(e.target.value)}`)
        setPlayed(parseFloat(e.target.value));
    };

    const onSeekMouseUp = (e) => {
        setSeeking(false);
        const newPlayedFraction = parseFloat(e.target.value) / duration;
        seekTo(newPlayedFraction); // Передаем долю от длительности
        setPlayed(newPlayedFraction * duration); // Обновляем played до нового времени в секундах
        console.log(`onSeekMouseUp: ${e.target.value}\n${parseFloat(e.target.value) / duration}`);
    };

    const formatTime = (seconds) => {
        const rounded = Math.round(seconds);
        const minutes = Math.floor(rounded / 60);
        const remainingSeconds = rounded % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
    }

    const togglePrevTrack = () => {
        if (previousSongs.length !== 0) {
            setCurrentSong(previousSongs[previousSongs.length - 1]);
            setPreviousSong(previousSongs.splice(previousSongs.length - 1, 1));
        }
    }

    const toggleNextTrack = () => {
        if (nextSongs.length !== 0) {
            setPreviousSong({ ...previousSongs, currentSong });
            setCurrentSong(nextSongs[0]);
            setNextSongs(nextSongs.slice(0));
        }
    }

    const toggleAddToPlaylist = (event) => {
        //event.preventDefault();
        setShowAddToPlaylist(prevState => !prevState);
    }

    const toggleShowVolume = () => {
        setVolumeDis(!volumeDis);
    }

    const handleClickOutside = (event) => {
        //event.preventDefault();
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowAddToPlaylist(false);
        }
    };

    // const fetchDataListened = () => {
    //     try{
    //         const response = await fetch(`http://172.24.80.146:8080/music/${trackId}/listen`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(userId)
    //         });

    //         if(!response.ok){
    //             throw new Error('Ошибка отправки запроса!');
    //         }


    //     } catch(error) {

    //     }
    // }

    useEffect(() => {
        setTrackUrl(`http://172.24.80.146/music/${trackId}/${trackId}.m3u8`);
        //url !== "" ? setIsPlaying(true) : setIsPlaying(false);
        trackId !== undefined ? () => {
            setDisablePlayer(false);
            //fetchDataListened();
        } : setDisablePlayer(true);
        //setDisablePlayer(trackId === undefined ? true : false);
        console.log(`track_id: ${trackId}`);

        document.addEventListener('mousedown', handleClickOutside);
        console.log(`Music status: ${isPlaying ? "Playing" : "Pause"}.\nLoop button status: ${loopState}.`);

        console.log(`AddToPlaylist: ${showAddToPlaylist}`);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPlaying, loopState, trackId])

    return (
        <>
            <AddToPlaylist showAdd={showAddToPlaylist} wref={wrapperRef}/>
            <div className="playerContainer" onMouseLeave={() => setVolumeDis(true)}>
                <div className="playerPillar">
                    <div className="componentPosition left">
                    </div>
                    <div className='componentPosition middle'>
                        <ReactPlayer
                            url={trackId !== '' ? trackUrl : ''}
                            playing={isPlaying}
                            controls={true}
                            width='0'
                            height='0'
                            onProgress={onProgress}
                            volume={volume}
                            onDuration={onDuration}
                            ref={playerRef}
                            onSeek={onSeek}
                            loop={loopState === loopStates.TRACK_LOOP}

                        />
                        <div className="playerTime info">
                            <button onClick={toggleAddToPlaylist} className={'playerButton add-to-playlist'} disabled={disablePlayer}>
                                <PlayerIcons icon_name={"add-to-playlist"} />
                            </button>
                            <button onClick={togglePrevTrack} className={'playerButton play-pause'} style={{ marginLeft: '5px' }} disabled={disablePlayer}>
                                <PlayerIcons icon_name={"prev"} />
                            </button>
                            <button onClick={togglePlayPause} className={'playerButton play-pause'} style={{ marginInline: '5px' }} disabled={disablePlayer}>
                                {isPlaying ? <PlayerIcons icon_name={"pause"} /> : <PlayerIcons icon_name={"play"} />}
                            </button>
                            <button onClick={toggleNextTrack} className={'playerButton play-pause'} style={{ marginRight: '5px' }} disabled={disablePlayer}>
                                <PlayerIcons icon_name={"next"} />
                            </button>
                            <button onClick={toggleLike} className={'playerButton like'} disabled={disablePlayer}>
                                {isLiked ? <PlayerIcons icon_name={"like_pressed"} /> : <PlayerIcons icon_name={"like_unpressed"} />}
                            </button>
                            <a className="time left">{formatTime(played)}</a>
                            <a className="time right">{formatTime(duration)}</a>
                        </div>
                        <div className="playerTime line">
                            <input
                                type="range"
                                min={0}
                                max={duration}
                                step='any'
                                value={played}
                                onChange={onSeekChange}
                                onMouseDown={onSeekMouseDown}
                                onMouseUp={onSeekMouseUp}
                                className="playerRange"
                                disabled={disablePlayer}
                            />
                        </div>
                    </div>
                    <div className="componentPosition right">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step='any'
                            value={volume}
                            onChange={onVolumeChange}
                            className={`volumeRange ${volumeDis ? 'disable' : 'enable'}`}
                            disabled={volumeDis}
                        />
                        <button onClick={toggleShowVolume} className={"playerButton volume"} onMouseEnter={() => toggleShowVolume()}>
                            <PlayerIcons icon_name={"volume"} />
                        </button>
                        <button onClick={toggleShowText} className={"playerButton text"} disabled={disablePlayer}>
                            {showedText ? <PlayerIcons icon_name={"text_pressed"} /> : <PlayerIcons icon_name={"text_unpressed"} />}
                        </button>
                        <button onClick={toggleMix} className={"playerButton volume"} disabled={disablePlayer}>
                            <PlayerIcons icon_name={"mix"} />
                        </button>
                        <button onClick={toggleLoop} className={"playerButton loop"}>
                            {loopState === loopStates.NO_LOOP ? <PlayerIcons icon_name={"reply_unpressed"} /> : loopState === loopStates.PLAYLIST_LOOP ? <PlayerIcons icon_name={"reply_pressed"} /> : <PlayerIcons icon_name={"reply_pressed_loop"} />}
                        </button>
                        <button onClick={toggleEqualizer} className={"playerButton text"} disabled={disablePlayer}>
                            <PlayerIcons icon_name={"equalizer"} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}