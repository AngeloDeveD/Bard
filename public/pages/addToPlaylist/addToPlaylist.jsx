import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../src/actions/userActions";

import './addToPlaylist.scss';

export default function AddToPlaylist({ showAdd = false, wref }) {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.user.userId);
    const userData = useSelector((state) => state.user.userData);
    const trackId = useSelector(state => state.user.trackId);

    const [playlist, setPLaylist] = useState(userData.userActionsModel.createdPlaylists);

    const [playerHeight, setPlayerHeight] = useState('');

    const [mainEditPlaylist, setMainEditPlaylist] = useState(false);
    const [createPlaylist, setCreatePlaylist] = useState(false);
    const [editPlaylist, setEditPlaylist] = useState(false);

    const [playlistTitle, setPlaylistTitle] = useState('');

    const closeEditor = () => {
        setMainEditPlaylist(false);
        setCreatePlaylist(false);
        setEditPlaylist(false);
    };

    const addPlaylist = () => {
        setMainEditPlaylist(true);
        setCreatePlaylist(true);
    };

    const startEditPlaylist = () => {
        setMainEditPlaylist(true);
        setEditPlaylist(true);
    };

    const encodeQueryParameters = (params) => {
        return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    }

    const fetchCreatePlaylist = async () => {
        const playlistInfo = { creatorID: userId, title: playlistTitle, tale: userData.face.username, access: true };

        const urlWithParams = new URL(`http://172.24.80.146:8080/playlists/upload`);
        urlWithParams.search = encodeQueryParameters(playlistInfo);
        try {
            const response = await fetch(urlWithParams, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка связи с сервером');
            }

            fecthUpdateData();

        } catch (error) {
            console.error('Ошибка при создании плейлиста!', error);
        }
    };

    const fecthUpdateData = async () => {
        try {
            const response = await fetch(`http://172.24.80.146:8080/users/${userId}/profile`);

            if (!response.ok) {
                throw new Error('Ошибка связи с сервером!!');
            }

            //setUserData(response.json());
            const data = await response.json();
            dispatch(setUser(data));
        } catch (error) {
            console.error('Ошибка обновления данных', error);
        }
    };

    const loadPlaylist = async (playlistId) => {
        try {
            const playlistformat = { userID: playlistId };
            const urlWithParams = new URL(`http://172.24.80.146:8080/playlists/${playlistId}/add-music`);
            urlWithParams.search = encodeQueryParameters(playlistformat);

            const response = await fetch(urlWithParams, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playlistformat)
            });
            if (!response.ok) {
                throw new Error("Ошибка отправки запроса!");
            }
            if (response.status === 404) {
                throw new Error("Плейлист не найден!");
            }

            fecthUpdateData();

            //const data = await response.json();

            console.log(`URL: ${playlistId}`);
        } catch (error) {
            console.error('Ошибка связи с сервером.', error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const player = document.querySelector('.playerContainer');
            setPlayerHeight(player.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const panelPlStyle = {
        bottom: `calc(${playerHeight + 16}px)`,
        left: `33%`
    };

    return (
        <>
            <div className={`add-pl ${showAdd ? "showed" : "hidden"}`} style={panelPlStyle} ref={wref}>
                <div className="pl pl-title">
                    <h2>Добавить в плейлист</h2>
                </div>
                <div className="pl-info">
                    {playlist.length !== 0 ?
                        <>
                            {playlist.map((pl, index) => (
                                <button key={index} onClick={() => loadPlaylist(pl.itemID)} className={"but-pl"}>
                                    <h2 className="pl-text">{pl.title} - {pl.username}</h2>
                                </button>
                            ))}
                        </>
                        : <h2 className="no-pl">У вас нет собственных плейлистов</h2>
                    }
                </div>
                <div className="pl pl-create-pl">
                    <button className="pl create-pl-button" onClick={addPlaylist} disabled={mainEditPlaylist}>+</button>
                </div>
                {mainEditPlaylist ?
                    createPlaylist ?
                        <>
                            <div className="editor-playlist__background">
                                <div className="editor-playlist__container">
                                    <h1 className="editor-playlist__text">Введите имя</h1>
                                    <h1 className="editor-playlist__text">Пожалуйста, введите название нового плейлиста</h1>
                                    <form className="editor-playlist__form">
                                        <input
                                            className="editor-playlist__input"
                                            type="text"
                                            name="title"
                                            placeholder="Название плейлиста"
                                            value={playlistTitle}
                                            onChange={(e) => setPlaylistTitle(e.target.value)}
                                        />
                                        <div className="editor-playlist__container-buttons">
                                            <button className="editor-playlist__buttons" style={{borderBottomLeftRadius: "15px"}} onClick={closeEditor}>Отменить</button>
                                            <button className="editor-playlist__buttons" style={{borderBottomRightRadius: "15px"}} type="sumbit" onClick={fetchCreatePlaylist}>Создать</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                        :
                        editPlaylist ?
                            <>
                                <div className="">
                                    <div className="">
                                        <h1 className="">Изменить название</h1>
                                        <h1 className="">Пожалуйста, введите название плейлиста</h1>
                                        <form>
                                            <input
                                                type="text"
                                                name="title"
                                                placeholder="Название плейлиста"
                                                value={playlistTitle}
                                                onChange={(e) => setPlaylistTitle(e.target.value)}
                                            />
                                            <div className="">
                                                <button className="" onClick={closeEditor}>Отменить</button>
                                                <button className="" type="sumbit" onClick={fetchCreatePlaylist}>Редактировать</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                            :
                            <></>
                    :
                    <></>
                }

            </div>
        </>
    );
}