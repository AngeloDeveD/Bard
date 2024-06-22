import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FocusContext } from '../../../src/context/FocusContext';

import PlayerIcons from '../player_icons/player_icons';

import './playlistContent.scss';

export default function PlaylistContent({ isAlb = false }) {
    let [searchParams, setSearchParams] = useSearchParams();

    const userid = useSelector((state) => state.user.userId);
    //const [userData, setUserData] = useState(null);
    const userData = useSelector((state) => state.user.userData);

    const playlistId = searchParams.get('pl');
    const [urlData, setUrlData] = useState([]);

    const [activeSong, setActiveSong] = useState(null);

    //const [dataLoaded, setDataLoaded] = useState(false);

    const [editPlaylist, setEditPlaylist] = useState(false);

    const [playlistParametrs, setPlaylistParametrs] = useState({
        playlistId: 0,
        playlistTitle: "Понравившаяся музыка",
        playlistAuthor: "Создано автоматически",
        duration: "--:--",
        authorsPlaylist: false,
        autoCreated: false,
        playlistLock: false,
        playlistLiked: false,
        isAlbum: isAlb,
        playlistContent: []
    });

    const [newPlaylistTitle, setNewPlaylistTitle] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const { setFocus } = useContext(FocusContext);

    const fetchDataPlaylist = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://172.24.80.146:8080/${isAlb ? "albums" : "playlists"}/${playlistId}/profile`);

            if (!response.ok) {
                setUrlData(null);
                throw new Error('Что то пошло не так....');
            }
            const result = await response.json();
            setUrlData(result);
        } catch (error) {
            setUrlData(null);
            console.error('Ошибка при получении данных:', error);
        }
        setIsLoading(false);
    }

    const fetchDataHyst = async () => {
        setIsLoading(true);
        try {
            const userFace = userData.face;

            const response = await fetch(`http://172.24.80.146:8080/users/${userFace.itemID}/listened`);

            if (!response.ok) {
                setPlaylistParametrs(prevParams => ({
                    ...prevParams,
                    playlistContent: []
                }));

                throw new Error("Ошибка получения истории");
            }

            const dataHyst = await response.json();

            setPlaylistParametrs(prevParams => ({
                ...prevParams,
                playlistContent: dataHyst
            }));
        } catch (error) {
            console.error("Ошибка отправки запроса!", error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (playlistId !== "hyst" && playlistId !== "lK") {
            fetchDataPlaylist();
        }

        switch (playlistId) {
            case "lK":
                if (userData && userData.userActionsModel) {
                    setIsLoading(true);
                    console.log("hyst: ", userData && userData.userActionsModel);
                    setPlaylistParametrs(prevParams => ({
                        ...prevParams,
                        playlistTitle: "Понравившаяся музыка",
                        playlistAuthor: "Создано автоматически",
                        authorsPlaylist: false,
                        autoCreated: true,
                        playlistContent: userData.userActionsModel.likedMusic
                    }));
                }
                setIsLoading(false);
                break;

            case "hyst":
                if (userData && userData.userActionsModel) {
                    setIsLoading(true);
                    console.log("hyst: ", userData && userData.userActionsModel)
                    setPlaylistParametrs(prevParams => ({
                        ...prevParams,
                        playlistTitle: "История прослушивания",
                        playlistAuthor: "Создано автоматически",
                        authorsPlaylist: false,
                        autoCreated: true
                    }));
                    fetchDataHyst();
                }
                setIsLoading(false);
                break;

            default:
                if (userData && userData.userActionsModel) {
                    setIsLoading(true);
                    fetchDataPlaylist();
                }
                setIsLoading(false);
                break;
        }

    }, [playlistId, userData]);

    if (isLoading) {
        return (
            <></>
        );
    }

    const playSong = (song_id) => {
        setActiveSong(song_id);
    }

    const toggleLike = () => {
        setPlaylistParametrs({
            ...playlistParametrs,
            playlistLiked: !playlistParametrs.playlistLiked
        });
    }

    const toggleLockPlaylist = () => {
        setPlaylistParametrs({
            ...playlistParametrs,
            playlistLock: !playlistParametrs.playlistLock
        });
    }

    const toggleEditPlaylist = () => {
        setEditPlaylist(true);
    }

    const handleNewPlaylistTitle = (e) => {
        setNewPlaylistTitle(e.target.value);
    }

    const toggleSaveTitle = async () => {

        try {
            const response = await fetch(`http://172.24.80.146:8080/playlists/${playlistParametrs.playlistId}/change-name?newName=${encodeURIComponent(newPlaylistTitle)}`);
            if (!response.ok) {
                throw new Error("Ошибка смены имени!!");
            }

            setPlaylistParametrs({
                ...playlistParametrs,
                playlistTitle: newPlaylistTitle
            });
        } catch (e) {

        }
    }

    return (
        <>
            {urlData !== null && userData && userData.userActionsModel ?
                <>
                    <div className="user-playlist__all-containers">
                        <div className='user-playlist__info-container'>
                            <div className='user-playlist__image'>
                                {playlistId === "lK" ?
                                    <PlayerIcons icon_name={"playlist-liked-icon"} classname={'playlist-image'} />
                                    :
                                    playlistId === "hyst" ?
                                        <PlayerIcons icon_name={"playlist-history-icon"} classname={'playlist-image'} />
                                        :
                                        <img className='playlist-image' src="https://cdni.iconscout.com/illustration/premium/thumb/404-7304110-5974976.png?f=webp" style={{ backgroundColor: "#6CE0AF" }} />
                                }
                            </div>
                            <div className='user-playlist__info__container'>
                                <div className='user-playlist__param'>
                                    {!editPlaylist ?
                                        <h1 className='user-playlist__info'>{playlistParametrs.playlistTitle}</h1>
                                        :
                                        <>
                                            <form onSubmit={toggleSaveTitle}>
                                                <input
                                                    type='text'
                                                    name='playlistTitle'
                                                    placeholder='Название пейлиста...'
                                                    value={newPlaylistTitle}
                                                    onChange={handleNewPlaylistTitle}
                                                    className=''
                                                />
                                                <input type="submit" value="" className="" />
                                            </form>
                                        </>
                                    }
                                    {playlistParametrs.authorsPlaylist && !playlistParametrs.autoCreated ?
                                        <>
                                            <div className='user-playlist__lock-pl'>
                                                {!editPlaylist ?
                                                    <>
                                                        <button className='' onClick={toggleEditPlaylist}>
                                                            <PlayerIcons icon_name={"edit_playlist"} />
                                                        </button>
                                                    </>
                                                    :
                                                    <></>
                                                }
                                                <button className='' onClick={toggleLockPlaylist}>
                                                    {playlistParametrs.playlistLock ? <PlayerIcons icon_name={"lock_playlist"} /> : <PlayerIcons icon_name={"unlock_playlist"} />}
                                                </button>
                                            </div>
                                        </>
                                        :
                                        <></>
                                    }
                                </div>
                                <h3 className='user-playlist__info'>{playlistParametrs.playlistAuthor}</h3>
                                <h3 className='user-playlist__info'>{`Длительность: ${playlistParametrs.duration}`}</h3>
                                {!playlistParametrs.authorsPlaylist && !playlistParametrs.autoCreated ?
                                    <>
                                        <div className='user-playlist__info__add-to-favorite__container'>
                                            <button onClick={toggleLike} className='user-playlist__info__add-to-favorite__button'>
                                                {playlistParametrs.playlistLiked ? <PlayerIcons icon_name={"like_pressed"} /> : <PlayerIcons icon_name={"like_unpressed"} />}
                                            </button>
                                            <h3 className='user-playlist__info__add-to-favorite__text'>Добавить в понравившееся</h3>
                                        </div>
                                    </>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                        <div className='user-playlist__songs-container' style={urlData.length !== 0 ? { marginLeft: "50px" } : {}}>
                            {urlData.length !== 0 ?
                                urlData.map((song, index) => {
                                    const isActive = song.id === activeSong;
                                    const buttonClass = isActive ? 'active' : '';
                                    return (
                                        <button key={index} className={`user-playlist-button__container ${buttonClass}`} onClick={() => playSong(song.id)}>
                                            <img className='user-playlist-button__song-icon' src={song.img}></img>
                                            <div className='user-playlist-button__incontainer'>
                                                <h3 className='user-playlist-button alltext song-title_pl'>{song.song_name}</h3>
                                            </div>
                                            <div className='user-playlist-button__incontainer'>
                                                <h3 className='user-playlist-button alltext song-author_pl'>{song.Author}</h3>
                                            </div>
                                            <div className='user-playlist-button__incontainer'>
                                                <h3 className='user-playlist-button alltext song-time_pl'>{`00:00`}</h3>
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
                        </div>
                    </div>
                </> :
                <Navigate to={"/404"} replace={true} />
            }
        </>
    );
}
