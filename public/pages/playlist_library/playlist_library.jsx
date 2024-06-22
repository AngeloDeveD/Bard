import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import './playlist_library.scss';

export default function Explore() {

    const userid = useSelector((state) => state.user.userId);

    const [genres, setGenres] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(`playlist_library: ${userid}`);
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch('http://172.24.80.146:8080/music/genres');

                if (!response.ok) {
                    setGenres([]);
                    throw new Error("Ответ от сервера был не ok!");
                }

                const result = await response.json();
                setGenres(result);
            }
            catch (error) {
                setGenres([]);
                console.error("Ошибка получения данных!");
            }

            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (
            <></>
        );
    }

    return (
        <>
            {!!userid ?
                <>
                    <div className="allContainers">
                        <h1 className="ContainerTitle">Жанры</h1>
                        <div className="genresContainer">
                            {genres.map((genre, index) => {
                                return (
                                    <button key={index} className="cont-genre">
                                        <h1 className="titleGenre">{genre.genreID}</h1>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </>
                : <Navigate to={"/login"} />
            }
        </>
    );
}
