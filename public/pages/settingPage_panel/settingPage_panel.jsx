import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import './settingPage_panel.scss';

export default function SettingPagePanel() {
    //const userid = useSelector(state => state.user.userId);
    //const userData = useSelector(state => state.user.userData);

    const navigate = useNavigate();

    const [params, setParams] = useSearchParams();

    const userSettingsParam = params.get('st');

    const [playerHeight, setPlayerHeight] = useState(0);
    const [returnHeight, setReturnHeight] = useState(0);

    const [buttons, setButtons] = useState([
        {
            buttonTitle: "Учётная запись",
            id: "account"
        }
    ]);

    useEffect(() => {
        //console.log(`settingPage_panel: ${userid}`);

        const handleResize = () => {
            const player = document.querySelector('.playerContainer');
            setPlayerHeight(player.clientHeight);
            const title = document.querySelector('.return-to-profile__container');
            setReturnHeight(title.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClickChangeSettings = (id) => {
        navigate(`/settings?st=${id}`);
    }

    const handleClickReturn = () => {
        navigate("/");
    }

    const panelHeight = {
        height: `calc(100vh - (${returnHeight + 20}px + ${playerHeight + 10}px))`
    };

    return (
        <>
            <div className="return-to-profile__container">
                <button className="return-to-profile__button" onClick={handleClickReturn}>
                    <h2 className="return-to-profile__button__text__arrow">&lt;</h2>
                    <h3 className="return-to-profile__button__text">назад</h3>
                </button>
            </div>
            <div className="settings_panel__container" style={panelHeight}>
                <h1 className="settings_panel__container__title">Настройки</h1>
                <div className="settings_panel__content">
                    {buttons.map((button, index) => {
                        return (
                            <button key={index} className="settings_panel__content__buttons" disabled={userSettingsParam === button.id} onClick={() => handleClickChangeSettings(button.id)}>
                                <h2 className="settings_panel__content__buttons__text">{button.buttonTitle}</h2>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}