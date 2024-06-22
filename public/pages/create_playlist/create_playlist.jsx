import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreatePlaylist() {

    const navigate = useNavigate();

    const location = useLocation();

    const [dis, setDis] = useState(false);
    const [activeUrl, setActiveUrl] = useState(null);

    const userid = useSelector((state) => state.user.userId);
    const userData = useSelector((state) => state.user.userData);

    const [playlists, setPlaylist] = useState({ likedPlaylists: [], likedAlbums: [], createdPlaylists: [] });

    const [loading, setLoading] = useState(false);

    //const [playlists, setPlaylist] = useState(userData.userActionsModel);
    const [likedPlaylists, setLikedPlaylists] = useState(playlists.likedPlaylists);
    const [likedAlbums, setLikedAlbums] = useState(playlists.likedAlbums);
    const [createdPlaylists, setCreatedPlaylists] = useState(playlists.createdPlaylists);

    const [allPlaylists, setAllPlaylists] = useState([
        ...likedPlaylists,
        ...likedAlbums,
        ...createdPlaylists
    ]);

    const loadPlaylist = (playlistId = 0) => {
        if (playlistId !== 0) {
            setActiveUrl(playlistId);
            navigate(`/playlist?pl=${playlistId}`);

            console.log(`URL: ${playlistId}`);
        }
        else {
            console.log(`URL: not found!!`);
        }
    }

    const loadAlbum = (url_album = 0) => {

    }

    useEffect(() => {
        if (location.pathname !== '/playlist') {
            setActiveUrl(null);
        }

        //console.log("create-playlist", userData);

        // const fetchData = async () => {
        //     setLoading(true);
        //     try {
        //         const response = await fetch();

        //         if (!response.ok) {
        //             throw new Error("Ошибка запроса плейлистов!");
        //         }

        //         const data = await response.json();

        //         const { likedPlaylists, likedAlbums, createdPlaylists } = data.userActionsModel;
        //         setPlaylist(data.userActionsModel);
        //         setLikedPlaylists(likedPlaylists || []); // Обновляем likedPlaylists
        //         setLikedAlbums(likedAlbums || []); // Обновляем likedAlbums
        //         setCreatedPlaylists(createdPlaylists || []); // Обновляем createdPlaylists
        //         setAllPlaylists([...(likedPlaylists || []), ...(likedAlbums || []), ...(createdPlaylists || [])]); // Обновляем allPlaylists

        //     } catch (error) {
        //         console.error("Не удалось отправить запрос для получения плейлистов!!", error);
        //     }
        // }

        if (userData && userData.userActionsModel) {
            const { likedPlaylists, likedAlbums, createdPlaylists } = userData.userActionsModel;
            setPlaylist(userData.userActionsModel); // Обновляем основное состояние playlists
            setLikedPlaylists(likedPlaylists || []); // Обновляем likedPlaylists
            setLikedAlbums(likedAlbums || []); // Обновляем likedAlbums
            setCreatedPlaylists(createdPlaylists || []); // Обновляем createdPlaylists
            setAllPlaylists([...(likedPlaylists || []), ...(likedAlbums || []), ...(createdPlaylists || [])]); // Обновляем allPlaylists
        }
        //fetchData();

    }, [location.pathname, userData]);

    // return (
    //     <>
    //         {allPlaylists.map((song, index) => (
    //             <button key={index} onClick={() => loadPlaylist(song.url)} className={`playlist button ${activeUrl === song.url ? 'button-active' : ''}`} >
    //                 <h1>{song.title}</h1>
    //                 <h2>{song.description}</h2>
    //             </button>
    //         ))}
    //     </>
    // );

    if (loading) {
        return (
            <></>
        );
    }

    return (
        <>
            <button onClick={() => loadPlaylist("hyst")} className={`playlist button ${activeUrl === "hyst" ? 'button-active' : ''}`}>
                <h1>История прослушивания</h1>
                <h2>Создано автоматически</h2>
            </button>
            <button onClick={() => loadPlaylist("lK")} className={`playlist button ${activeUrl === "lK" ? 'button-active' : ''}`}>
                <h1>Понравившиеся треки</h1>
                <h2>Создано автоматически</h2>
            </button>
            {createdPlaylists.map((playlist, index) => (
                <button key={index} onClick={() => loadPlaylist(playlist.itemID)} className={`playlist button ${activeUrl === playlist.itemID ? 'button-active' : ''}`}>
                    <h1>{playlist.title}</h1>
                    <h2>{playlist.username}</h2>
                </button>
            ))}
            {likedPlaylists.map((playlist, index) => (
                <button key={index} onClick={() => loadPlaylist(playlist.itemID)} className={`playlist button ${activeUrl === playlist.itemID ? 'button-active' : ''}`}>
                    <h1>{playlist.title}</h1>
                    <h2>{playlist.username}</h2>
                </button>
            ))}
            {likedAlbums.map((playlist, index) => (
                <button key={index} onClick={() => loadPlaylist(playlist.itemID)} className={`playlist button ${activeUrl === playlist.itemID ? 'button-active' : ''}`}>
                    <h1>{playlist.title}</h1>
                    <h2>{playlist.username}</h2>
                </button>
            ))}

        </>
    );

}