import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import CreatePlaylist from '../create_playlist/create_playlist';

import './library_panel.scss';

export default function LibraryPanel() {

    const [playerHeight, setPlayerHeight] = useState(0);
    const [titleHeight, setTitleHeight] = useState(0);

    const userid = useSelector((state) => state.user.userId);
    const [userData, setUserData] = useState({});

    //const user = useSelector((state) => state.user.user);

    //логика отправки get/post запроса
    //..............................//

    useEffect(() => {
        //console.log(`library_panel: ${userid}`);

        const handleResize = () => {
            const player = document.querySelector('.playerContainer');
            setPlayerHeight(player.clientHeight);
            const title = document.querySelector('.backdrop');
            setTitleHeight(title.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const panelHeight = {
        height: `calc(100vh - (${titleHeight + 20}px + ${playerHeight + 10}px))`
    };

    return (
        <>
            {!!userid ?
                <div className={"lib backdrop"} style={panelHeight}>
                    <div className={"lib content"}>
                        <div className={"lib title"}>
                            <h2 className={'library-text'}>Моя библиотека</h2>
                        </div>
                        <div className={"playlist backdrop"}>
                            <CreatePlaylist />
                        </div>
                    </div>
                </div>
                :
                <Navigate to="/login" replace={true} />
            }
        </>
    );


}