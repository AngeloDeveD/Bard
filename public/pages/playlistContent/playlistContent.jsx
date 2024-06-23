import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FocusContext } from '../../../src/context/FocusContext';

import PlayerIcons from '../player_icons/player_icons';

import './playlistContent.scss';

export default function PlaylistContent({ isAlb = false }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [playlistId, setPlaylistId] = useState(null);

    const userid = useSelector((state) => state.user.userId);
    //const [userData, setUserData] = useState(null);
    const userData = useSelector((state) => state.user.userData);

    const [urlData, setUrlData] = useState([]);

    const [activeSong, setActiveSong] = useState(null);

    //const [dataLoaded, setDataLoaded] = useState(false);

    const [editPlaylist, setEditPlaylist] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);
    const [oldUrl, setOldUrl] = useState("");

    const [playlistParametrs, setPlaylistParametrs] = useState({
        playlistId: 0,
        playlistTitle: "",
        playlistAuthor: "",
        icon_img: "",
        duration: "--:--",
        authorsPlaylist: false,
        autoCreated: false,
        playlistLock: false,
        playlistLiked: false,
        //isAlbum: isAlb,
        playlistContent: Array()
    });

    const [genres, setGenres] = useState([
        {
            genre: "jpop",
            title: "J-pop"
        },
        {
            genre: "metal",
            title: "Метал"
        },
        {
            genre: "rock",
            title: "Рок"
        },
        {
            genre: "phonk",
            title: "Фонк"
        },
        {
            genre: "memphis",
            title: "Мемфис"
        },
        {
            genre: "hip-hop",
            title: "Хип-хоп"
        },
        {
            genre: "classical",
            title: "Классическая"
        },
        {
            genre: "hyperpop",
            title: "Hyperpop"
        },
        {
            genre: "electronic",
            title: "Electronic"
        }
    ]);

    const [newPlaylistTitle, setNewPlaylistTitle] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const { setFocus } = useContext(FocusContext);

    const fetchDataPlaylist = async () => {
        setIsLoading(true);
        let plId = playlistId;
        try {
            if (plId) {
                const response = await fetch(`http://172.24.80.146:8080/playlists/${plId}/profile`);

                if (!response.ok) {
                    setPlaylistParametrs(prevParams => ({
                        ...prevParams,
                        playlistContent: []
                    }));
                    //setUrlData(null);
                    throw new Error('Что то пошло не так.');
                }
                const result = await response.json();
                //setUrlData(result);
            }
            else {
                throw new Error("id плейлиста равен null");
            }
        } catch (error) {
            //setUrlData(null);
            console.error('Ошибка при получении данных:', error);
        }
        setIsLoading(false);
    }

    const fetchDataHyst = async () => {
        let result = [];

        setIsLoading(true);
        try {
            const userFace = userData.face;

            const response = await fetch(`http://172.24.80.146:8080/users/${userFace.itemID}/listened`);

            if (!response.ok) {
                throw new Error("Ошибка получения истории");
            }

            const dataHyst = await response.json();

            result = [...dataHyst];

        } catch (error) {
            console.error("Ошибка отправки запроса!", error);
        }
        setIsLoading(false);
        return result;
    }

    const fetchDataGenre = async () => {
        let result = [];

        setIsLoading(true);
        try {
            const response = await fetch(`http://172.24.80.146:8080/music/recent?page=0&?genre=${playlistId}`);

            if (!response.ok) {
                throw new Error("Ошибка отправки данных на сервер!");
            }

            const data = await response.json();

            result = [...data];

        } catch (error) {
            console.error("Ошибка запроса!!");
        }

        setIsLoading(false);

        return result;
    }

    const fetchDataLiked = async () => {
        let result = [];
        setIsLoading(true);
        try {
            const response = await fetch(`http://172.24.80.146:8080/users/${userid}/profile`);

            if (!response.ok) {
                throw new Error("Ошибка отправки данных на сервер!");
            }

            const data = await response.json();

            result = [...data.userActionsModel.likedMusic];

        } catch (error) {
            console.error("Ошибка запроса!!");
        }

        setIsLoading(false);

        return result;
    }

    const checkGenreExists = (genreToCheck) => {
        const exists = genres.some(genreObj => genreObj.genre === genreToCheck);
        return !!exists;
    };

    useEffect(() => {
        setPlaylistParametrs(prevParams => ({
            ...prevParams,
            playlistContent: []
        }));
        setPlaylistId(searchParams.get('pl'));
        let isPlaylistGenre = checkGenreExists(playlistId);

        if (!!playlistId) {
            //console.log(checkGenreExists(playlistId));
            if (playlistId !== "hyst" && playlistId !== "lK" && !isPlaylistGenre) {
                fetchDataPlaylist();
            }
            else {
                switch (playlistId) {
                    case "lK":
                        {
                            setPlaylistParametrs(prevParams => ({
                                ...prevParams,
                                playlistTitle: "Понравившаяся музыка",
                                playlistAuthor: "Создано автоматически",
                                icon_img: "playlist-liked-icon",
                                authorsPlaylist: false,
                                autoCreated: true,
                                playlistContent: fetchDataLiked()
                            }));
                            break;
                        }
                    case "hyst":
                        {
                            setPlaylistParametrs(prevParams => ({
                                ...prevParams,
                                playlistTitle: "История прослушивания",
                                playlistAuthor: "Создано автоматически",
                                icon_img: "playlist-history-icon",
                                authorsPlaylist: false,
                                autoCreated: true,
                                playlistContent: fetchDataHyst()
                            }));
                            break;
                        }
                    default:
                        {
                            if (isPlaylistGenre) {
                                setPlaylistParametrs(prevParams => ({
                                    ...prevParams,
                                    playlistTitle: genres.map((genre, index) => {
                                        if (genre.genre === playlistId) {
                                            setPlaylistParametrs(prevParams => ({
                                                ...prevParams,
                                                playlistTitle: genre.title,
                                                playlistAuthor: "Создано автоматически",
                                                icon_img: `playlist-${playlistId}-icon`,
                                                authorsPlaylist: false,
                                                autoCreated: true,
                                                playlistContent: fetchDataGenre()
                                            }));
                                            setIsLoading(false);
                                        }
                                    })
                                }));
                            }
                            else {
                                fetchDataPlaylist();
                            }
                            break;
                        }

                }
                setUrlData(playlistParametrs.playlistContent);
            }
        }

    }, [playlistId, searchParams]);

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
            {!isLoading && userData && userData.userActionsModel ?
                <>
                    <div className="user-playlist__all-containers">
                        <div className='user-playlist__info-container'>
                            <div className='user-playlist__image'>
                                <PlayerIcons icon_name={playlistParametrs.icon_img} classname={'playlist-image'} />
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
                        <div className='user-playlist__songs-container' style={playlistParametrs.playlistContent.length !== 0 ? { marginLeft: "50px" } : {}}>
                            {urlData && urlData.length !== 0 ?
                                urlData?.map((song, index) => {
                                    const isActive = song.itemID === activeSong;
                                    const buttonClass = isActive ? 'active' : '';
                                    //console.log("song-item", song.itemID);
                                    return (
                                        <button key={song.itemID} className={`user-playlist-button__container ${buttonClass}`} onClick={() => playSong(song.itemID)}>
                                            <img className='user-playlist-button__song-icon' src={`http://172.24.80.146/images/${song.coverID}.webp`}></img>
                                            <div className='user-playlist-button__incontainer'>
                                                <h3 className='user-playlist-button alltext song-title_pl'>{song.title}</h3>
                                            </div>
                                            <div className='user-playlist-button__incontainer'>
                                                <h3 className='user-playlist-button alltext song-author_pl'>{song.username}</h3>
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
