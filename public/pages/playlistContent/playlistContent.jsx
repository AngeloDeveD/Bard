import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import CreateContent from './createContent';
import PlayerIcons from '../player_icons/player_icons';

import './playlistContent.scss';

export default function PlaylistContent({ isAlb = false }) {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [playlsitId, setPlaylistId] = useState('');

    //const {userId, userData} = useSelector((state) => state.user.userId, state.user.userData);

    const userid = useSelector((state) => state.user.userId);
    const userData = useSelector((state) => state.user.userData);

    const [playlistData, setPlaylistData] = useState([]);

    const [playlistInfo, setPlaylistInfo] = useState({
        title: '',
        description: '',
        duration: '--:--',
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
        try {
            const response = await fetch(`http://172.24.80.146:8080/playlists/${playlsitId}/change-name?newName=${encodeURIComponent(newPlaylistTitle)}`);
            if (!response.ok) {
                throw new Error("Ошибка смены имени!!");
            }

            setPlaylistInfo(prevParams => ({
                ...prevParams,
                title: newPlaylistTitle
            }))

        } catch (error) {

        }

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
            setPlaylistParams({ img_url: `http://172.24.80.146/images/${data.face.coverID}.webp`, isUsers: data.face.authorID === userData.face.authorID, isAutoCreated: false });
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
                setPlaylistInfo({ title: "История прослушивания", description: "Создано автоматически", duration: ""  });
                setPlaylistParams({ img_url: "playlist-history-icon", isUsers: true, isAutoCreated: true });
                fetchDataHistory(`http://172.24.80.146:8080/users/${userid}/listened`);
                break;

            case "lK":
                setPlaylistInfo({ title: "Понравившаяся музыка", description: "Создано автоматически", duration: ""  });
                setPlaylistParams({ img_url: "playlist-liked-icon", isUsers: true, isAutoCreated: true });
                setPlaylistData(userData.userActionsModel.likedMusic);
                break;

            default:
                {
                    const findGenre = genres.find(genreObj => genreObj.genre === playlistId);
                    if (findGenre !== undefined) {
                        setPlaylistInfo({ title: findGenre.title, description: "Список треков по жанру", duration: "" });
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
                                <h3 className='user-playlist__info'>{playlistInfo.duration !== "" && `Длительность: ${playlistInfo.duration}`}</h3>
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
                            <CreateContent playlistData={playlistData} />
                        </div>
                    </div>
                </>
                : <Navigate to={"/404"} replace={true} />
            }
        </>
    );
};