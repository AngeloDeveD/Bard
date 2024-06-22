import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { setTrackId } from "../../../src/actions/userActions";

import './main_panel.scss';

const Playlist_div = ({ playlist }) => {

    const dispatch = useDispatch();

    const [newPl, setNewPl] = useState(playlist);

    const updateTrackUrl = (trackId) => {
        dispatch(setTrackId(trackId));
        console.log(`id_track: ${trackId}`);
    }

    return (
        <>
            {newPl.map((pl, index) => {
                return (
                    <div key={index} className={"ContainerInfo"}>
                        <button className="ContainerButton" onClick={() => updateTrackUrl(pl.itemID)}>
                            <img src={`http://172.24.80.146/images/${pl.coverID}.webp`} className="ContainerImage" alt={pl.song_name}></img>
                        </button>
                        <p className="trackInfo">{pl.title} &bull;
                            <a href="" className="trackInfo link">{pl.username}</a> &bull;
                            {pl.genre}
                            {/* <a href="" className="trackInfo link">{pl.album}</a> &bull; 
                            {pl.year} */}
                        </p>
                    </div>
                );

            })}
        </>
    );
}

export default function MainPanel() {
    const userid = useSelector((state) => state.user.userId);

    const [dayMusicData, setDayMusicData] = useState([]);
    //const [authorsMusicData, setAuthorsMusicData] = useState([]);
    const [genresChartData, setGenresChartData] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //console.log(`main_panel: ${userid}`);

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://172.24.80.146:8080/music/daily');
                if (!response.ok) {
                    throw new Error("Ошибка получения данных!");
                }

                const data = await response.json();

                setDayMusicData(data);
            } catch (e) {
                console.error("Ошибка связи с сервером!!");
            }
            setLoading(false);
        }

        fetchData();
        //console.log(`Main panel: ${userid}`);
    }, [])

    if (loading) {
        return (
            <>
            </>
        );
    }

    return (
        <>
            {!!userid ?
                <>
                    <div className="allContainers">
                        {loading ?
                            <></> :
                            <>
                                <div className="MusicDayContainer">
                                    <h1 className="ContainerTitle">Музыка дня</h1>
                                    <div className="Containers">
                                        <Playlist_div playlist={dayMusicData} />
                                    </div>
                                </div>
                                <div className="NewMusicFromAuthors">
                                    <h1 className="ContainerTitle">Новое от ваших авторов</h1>
                                    <div className="Containers">
                                        <Playlist_div playlist={dayMusicData} />
                                    </div>
                                </div>
                                <div className="UsersPlaylists">
                                    <h1 className="ContainerTitle">Плейлисты пользователей</h1>
                                    <div className="Containers">
                                        <Playlist_div playlist={dayMusicData} />
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </>
                : <Navigate to={"/login"} />
            }
        </>
    );
}