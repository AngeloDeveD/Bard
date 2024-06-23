import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { FocusContext } from '../../../src/context/FocusContext';

import { setTrackId } from '../../../src/actions/userActions';

import PlayerIcons from '../player_icons/player_icons';

import './playlistContent.scss';

const Content = ({ playlistData = [] }) => {
    const dispatch = useDispatch();

    const { setFocus } = useContext(FocusContext);

    const [activeSong, setActiveSong] = useState(null);

    const playSong = (song_id) => {
        dispatch(setTrackId(song_id));
        setActiveSong(song_id);
    };

    return (
        <>
            <div className='user-playlist__songs-container' style={playlistData.length !== 0 ? { marginLeft: "50px" } : {}}>
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
        </>
    );
};

export default function PlaylistContent({ isAlb = false }) {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [playlsitId, setPlaylistId] = useState('');

    //const {userId, userData} = useSelector((state) => state.user.userId, state.user.userData);

    const userid = useSelector((state) => state.user.userId);
    const userData = useSelector((state) => state.user.userData);

    const [playlistContent, setPlaylistContent] = useState([]);
    const [playlistData, setPlaylistData] = useState([]);

    const [playlistInfo, setPlaylistInfo] = useState({
        title: '',
        description: '',
    });

    const [playlistParams, setPlaylistParams] = useState({
        img_url: '',
        isUsers: false,
        isAutoCreated: false,
    });

    const [isLocked, setIsLocked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const [editPlaylist, setEditPlaylist] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState("");

    const [imageError, setImageError] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

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

    const toggleLike = () => {
        setIsLiked(prevParams => !prevParams);
    }

    const toggleLockPlaylist = () => {
        setIsLocked(prevParams => !prevParams);
    }

    const toggleEditPlaylist = () => {
        setEditPlaylist(true);
    }

    const handleNewPlaylistTitle = (e) => {
        setNewPlaylistTitle(e.target.value);
    }

    const toggleSaveTitle = async () => {

        // try {
        //     const response = await fetch(`http://172.24.80.146:8080/playlists/${playlistParametrs.playlistId}/change-name?newName=${encodeURIComponent(newPlaylistTitle)}`);
        //     if (!response.ok) {
        //         throw new Error("Ошибка смены имени!!");
        //     }

        //     setPlaylistParametrs({
        //         ...playlistParametrs,
        //         playlistTitle: newPlaylistTitle
        //     });
        // } catch (e) {

        // }

        setEditPlaylist(false);
    }

    const fetchDataHistory = async (url) => {
        setIsLoading(true);
        try {
            const response = await fetch(url);

            if (!response.ok) {
                setPlaylistData([]);
                throw new Error("Запрос не отправлен!");
            }

            const data = await response.json();
            setPlaylistData(data);

        } catch (error) {
            setPlaylistData([]);
            console.error('Ошибка связи с сервером');
        }
        setIsLoading(false);
    };

    const fetchDataGenre = async (url) => {
        setIsLoading(true);
        try {
            const response = await fetch(url);

            if (!response.ok) {
                setPlaylistData([]);
                throw new Error("Запрос не отправлен!");
            }

            const data = await response.json();
            setPlaylistData(data);

        } catch (error) {
            setPlaylistData([]);
            console.error('Ошибка связи с сервером');
        }
        setIsLoading(false);
    };

    const fecthDataUsers = async (url) => {
        setIsLoading(true);
        try {
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Плейлист не найден!");
                }
                throw new Error("Запрос не отправлен!");
            }

            const data = await response.json();
            setPlaylistInfo({ title: data.face.title, description: data.face.username });
            setPlaylistParams({ img_url: `http://172.24.80.146/images/${data.face.coverID}.webp`, isUsers: data.face.authorID === userData.face.authorID, isAutoCreated: false});
            setPlaylistData(data);

        } catch (error) {
            setPlaylistData([]);
            console.error('Ошибка связи с сервером');
            navigate('/404');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const playlistId = searchParams.get('pl');
        switch (playlistId) {
            case "hyst":
                setPlaylistInfo({ title: "История прослушивания", description: "Создано автоматически" });
                setPlaylistParams({ img_url: "playlist-history-icon", isUsers: true, isAutoCreated: true });
                fetchDataHistory(`http://172.24.80.146:8080/users/${userid}/listened`);
                break;

            case "lK":
                setPlaylistInfo({ title: "Понравившаяся музыка", description: "Создано автоматически" });
                setPlaylistParams({ img_url: "playlist-liked-icon", isUsers: true, isAutoCreated: true });
                setPlaylistData(userData.userActionsModel.likedMusic);
                break;

            default:
                {
                    const findGenre = genres.find(genreObj => genreObj.genre === playlistId);
                    if (findGenre !== undefined) {
                        setPlaylistInfo({ title: findGenre.title, description: "Список треков по жанру" });
                        setPlaylistParams({ img_url: `playlist-${findGenre.genre}-icon`, isUsers: false, isAutoCreated: true });
                        fetchDataGenre(`http://172.24.80.146:8080/music/recent?page=0&?genre=${findGenre.genre}`);
                    }
                    else {
                        fecthDataUsers(`http://172.24.80.146:8080/${isAlb ? "albums" : "playlists"}/${playlistId}/profile`);
                    }
                    break;
                }
        }
    }, [searchParams]);


    if (isLoading) {
        return (
            <>
            </>
        );
    }

    return (
        <>
            {userData && userData.userActionsModel ?
                <>
                    <div className="user-playlist__all-containers">
                        <div className='user-playlist__info-container'>
                            <div className='user-playlist__image'>
                                {imageError ?
                                    <>
                                        <img src={playlistParams.img_url} onError={() => setImageError(true)} classname={'playlist-image'}></img>
                                    </>
                                    :
                                    <>
                                        <PlayerIcons icon_name={playlistParams.img_url} classname={'playlist-image'} />
                                    </>
                                }
                            </div>
                            <div className='user-playlist__info__container'>
                                <div className='user-playlist__param'>
                                    {!editPlaylist ?
                                        <h1 className='user-playlist__info'>{playlistInfo.title}</h1>
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
                                    {playlistParams.isUsers && !playlistParams.isAutoCreated ?
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
                                                    {isLocked ? <PlayerIcons icon_name={"lock_playlist"} /> : <PlayerIcons icon_name={"unlock_playlist"} />}
                                                </button>
                                            </div>
                                        </>
                                        :
                                        <></>
                                    }
                                </div>
                                <h3 className='user-playlist__info'>{playlistInfo.description}</h3>
                                <h3 className='user-playlist__info'>{`Длительность: --:--`}</h3>
                                {!playlistParams.isUsers && !playlistParams.isAutoCreated ?
                                    <>
                                        <div className='user-playlist__info__add-to-favorite__container'>
                                            <button onClick={toggleLike} className='user-playlist__info__add-to-favorite__button'>
                                                {isLiked ? <PlayerIcons icon_name={"like_pressed"} /> : <PlayerIcons icon_name={"like_unpressed"} />}
                                            </button>
                                            <h3 className='user-playlist__info__add-to-favorite__text'>Добавить в понравившееся</h3>
                                        </div>
                                    </>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                        <div className='user-playlist__songs-container' style={playlistData.length !== 0 ? { marginLeft: "50px" } : {}}>
                            <Content playlistData={playlistData} />
                        </div>
                    </div>
                </>
                : <Navigate to={"/404"} replace={true} />
            }
        </>
    );
};