import { useState, useContext } from "react";
import { useDispatch } from "react-redux";

import { FocusContext } from '../../../src/context/FocusContext';
import { setTrackId } from '../../../src/actions/userActions';

import DurationTrack from '../durationTrack/durationTrack';

export default function CreateContent({ playlistData = [] }) {
    const dispatch = useDispatch();

    const { setFocus } = useContext(FocusContext);

    const [activeSong, setActiveSong] = useState(null);

    const playSong = (song_id) => {
        dispatch(setTrackId(song_id));
        setActiveSong(song_id);
    };

    return (
        <>
            {playlistData && playlistData.length !== 0 ?
                playlistData.map((song, index) => {
                    const isActive = song.itemID === activeSong;
                    const buttonClass = isActive ? 'active' : '';
                    //console.log("song-item", song.itemID);
                    return (
                        <button key={index} className={`user-playlist-button__container ${buttonClass}`} onClick={() => playSong(song.itemID)}>
                            <img className='user-playlist-button__song-icon' src={`http://172.24.80.146/images/${song.coverID}.webp`}></img>
                            <div className='user-playlist-button__incontainer'>
                                <h3 className='user-playlist-button alltext song-title_pl'>{song.title}</h3>
                            </div>
                            <div className='user-playlist-button__incontainer'>
                                <h3 className='user-playlist-button alltext song-author_pl'>{song.username}</h3>
                            </div>
                            <div className='user-playlist-button__incontainer'>
                                <DurationTrack id={song.itemID} className='user-playlist-button alltext song-time_pl' />
                                {/* <h3 className='user-playlist-button alltext song-time_pl'>{`00:00`}</h3> */}
                            </div>
                        </button>
                    );
                })
                :
                <div className='user-playlist-button__undefined__container'>
                    <div className="user-playlist-button__undefined__container-content">
                        <h3 className='user-playlist-button__undefined__text'>{`Плейлист пуст :(`}</h3>
                        <button className='user-playlist-button__undefined__button' onClick={setFocus}>Добавить трек</button>
                    </div>
                </div>
            }
        </>
    );
};