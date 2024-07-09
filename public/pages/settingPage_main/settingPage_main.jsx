import { useState, useEffect, useRef } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import FileDropArea from "../filedroparea/filedroparea";
import PlayerIcons from "../player_icons/player_icons";

import { setUser, setUserEmail } from "../../../src/actions/userActions";

import './settingPage_main.scss';

const ChangeEmail = ({ closeSettings }) => {
    const [confirmedPassword, setConfirmedPassword] = useState(false);
    const [confirmedEmail, setConfirmedEmail] = useState(false);
    const [codeSended, setCodeSended] = useState(false);

    const [password, setPassword] = useState('');
    const [emailConfirm, setEmailConfirm] = useState({ email: '', code: '' });
    const [newEmail, setNewEmail] = useState('');

    const submitConfirmPassword = (e) => {
        e.preventDefault();
        closeSettings();
    };

    const submitConfirmEmail = (e) => {
        e.preventDefault();

    };

    const submitChangeEmail = (e) => {
        e.preventDefault();

    }

    const changeEmailConfirm = (e) => {
        setEmailConfirm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    return (
        <>
            <div className="changeEmail__background">
                <div className="changeEmail__container">
                    <div className="changeEmail__title-container">
                        <h2 className="changeEmail__title-container__text">{confirmedPassword ? 'Смена почты' : 'Введите пароль'}</h2>
                    </div>
                    <div className="changeEmail__main-content">
                        {!confirmedPassword ?
                            <>
                                <form onSubmit={submitConfirmPassword} className="changeEmail__main-content__form-content">
                                    <input
                                        type="password"
                                        name='password'
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="changeEmail__buttons-container">
                                        <button className="inputField Button middle" onClick={closeSettings}>Отменить</button>
                                        <button type="sumbit" className="inputField Button middle">Подтвердить</button>
                                    </div>
                                </form>
                            </>
                            :
                            <>
                                {confirmedEmail ?
                                    <>
                                        <form onSubmit={submitChangeEmail} className="changeEmail__main-content__form-content">
                                            <input
                                                type="email"
                                                name='email'
                                                placeholder="Новая Эл. почта"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                            />
                                            <button type="sumbit" className="inputField Button middle">Изменить</button>
                                        </form>
                                    </>
                                    :
                                    <>
                                        <form onSubmit={submitConfirmEmail} className="changeEmail__main-content__form-content">
                                            <input
                                                type="email"
                                                name='email'
                                                placeholder="Эл. почта"
                                                value={emailConfirm.email}
                                                onChange={changeEmailConfirm}
                                            />
                                            <input
                                                type="text"
                                                name='code'
                                                placeholder="Код"
                                                value={emailConfirm.code}
                                                onChange={changeEmailConfirm}
                                            />
                                            <button type="sumbit" className="inputField Button middle">{!codeSended ? "Получить код" : "Подтвердить"}</button>
                                        </form>
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
            </div >
        </>
    );
}

const ChangePassword = ({ closeSettings }) => {
    const [giveAccess, setGiveAccess] = useState(false);
    const [password, setPassword] = useState(
        {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    );

    const handleChangePassword = (e) => {
        setPassword(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value
            }
        ));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        closeSettings();
    }

    useEffect(() => {
        setGiveAccess(password.newPassword && password.confirmNewPassword && password.newPassword === password.confirmNewPassword && password.oldPassword !== password.newPassword);
    }, [password]);

    return (
        <>
            <div className="changeEmail__background">
                <div className="changeEmail__container">
                    <div className="changeEmail__title-container">
                        <h2 className="changeEmail__title-container__text">Смена пароля</h2>
                    </div>
                    <div className="changeEmail__main-content">
                        <form onSubmit={submitPassword}>
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder="Старый пароль"
                                value={password.oldPassword}
                                onChange={handleChangePassword}
                            />
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Новый пароль"
                                value={password.newPassword}
                                onChange={handleChangePassword}
                            />
                            <input
                                type="password"
                                name="confirmNewPassword"
                                placeholder="Повторить новый пароль"
                                value={password.confirmNewPassword}
                                onChange={handleChangePassword}
                            />
                            <div className="changeEmail__buttons-container">
                                <button type="sumbit" className="inputField Button middle" disabled={!giveAccess}>Изменить</button>
                                <button className="inputField Button middle" onClick={closeSettings}>Отменить</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </>
    );
}

export default function SettingPageMain() {
    //const userid = useSelector(state => state.user.userId);
    const userData = useSelector(state => state.user.userData);
    const userEmail = useSelector(state => state.user.userEmail);

    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();

    const [panelDimensions, setPanelDimensions] = useState({ playerHeight: 0, searchHeight: 0 });

    const [submitButtonSettings, setSubmitButtonSettings] = useState({ image: '', widht_height: '50px' });

    const userSettingsParam = params.get('st');

    const [changeNickname, setChangeNickname] = useState(false);
    const [changeEmail, setChangeEmail] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [settingsActive, setSettingsActive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    //const [userName, setUserName] = useState({username: user.username});

    const [sendFile, setSendFile] = useState(null);

    const [isBg, setIsBg] = useState(false);

    const [icon, setIcon] = useState(`http://172.24.80.146/images/${userData.face.coverID}.webp`);
    const [bgImage, setBgImage] = useState(`http://172.24.80.146/images/${userData.headerID}.webp`);
    const [userName, setUserName] = useState(userData.face.username);

    const backgroundUrl = useRef(
        `${bgImage}`
    );

    const avatarUrl = useRef(
        `${icon}`
    );

    // const userName = useRef(
    //     `${user.username}`
    // );

    const [newNickname, setNewNickname] = useState('');

    const handleClickChangeNickname = () => {
        if (!settingsActive) {
            setChangeNickname(true);
            setSettingsActive(true);
        }
    }

    const handleClickChangeEmail = () => {
        if (!settingsActive) {
            setChangeEmail(true);
            setSettingsActive(true);
        }
    }

    const handleChangePassword = () => {
        if (!settingsActive) {
            setChangePassword(true);
            setSettingsActive(true);
        }
    }

    const handleInputNicknameChange = (e) => {
        setNewNickname(e.target.value);
    }

    const UpdateInfo = (nickname) => {
        const newData = {
            ...userData,
            face: {
                ...userData.face,
                username: nickname
            }
        };
        dispatch(setUser(newData));
        setUserName(nickname);
    };

    const encodeQueryParameters = (params) => {
        return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    }

    const handleSubmitNewNickname = (e) => {
        e.preventDefault();

        const sendData = { newName: newNickname };

        const urlWithParams = new URL(`http://172.24.80.146:8080/users/${userData.face.itemID}/change-name`);
        urlWithParams.search = encodeQueryParameters(sendData);
        const fetchData = async () => {
            try {
                const response = await fetch(urlWithParams, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendData)
                });

                if (!response.ok) {
                    throw new Error("Ошибка получения данных от сервера!!");
                }

                UpdateInfo(newNickname);
                //const data = await response.json()

            } catch (error) {
                console.error("Ошибка: ", error);
            }
        }

        fetchData();

        //console.log(user);
        setChangeNickname(false);
        setSettingsActive(false);
    }

    const handleSettingsClose = () => {
        setSettingsActive(false);
        setChangePassword(false);
        setChangeEmail(false);
    };

    const updateAvatar = (imgSrc) => {
        avatarUrl.current = imgSrc;
    };

    const updateBackground = (imageSrc) => {
        backgroundUrl.current = imageSrc;
    }

    const onSelectFile = (e) => {
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (!file) return;
        else setSendFile(file);
    }

    const onSelectFileBg = (e) => {
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (!file) return;
        else {
            setSendFile(file);
            setIsBg(true);
        }
    }

    const onDragOver = (e) => {
        e.preventDefault(); // Это необходимо, чтобы разрешить перетаскивание
    };

    const onDrop = (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение браузера
        onSelectFile(e); // Вызываем функцию onSelectFile с событием drop
    };

    useEffect(() => {
        //console.log(user.img_url);

        const handleResize = () => {
            setPanelDimensions({
                playerHeight: document.querySelector('.playerContainer')?.clientHeight || 0
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        //console.log(`settingPage_main: ${userid}`);
        setModalOpen(!!sendFile);
        setSettingsActive(!!sendFile);
    }, [sendFile]);

    const panelHeight = {
        height: `calc(100vh - ${panelDimensions.playerHeight + 29}px)`
    };

    const maskEmail = (email) => {
        return email.replace(/[^@]+/, match => '*'.repeat(match.length));
    }

    if (!userSettingsParam) {
        return (
            <Navigate to={"/settings?st=account"} replace={true} />
        );
    }

    return (
        <>
            {userSettingsParam === "account" ?
                <>
                    <div className="setting-page__main-content" style={panelHeight}>
                        <h1 className="setting-page__main-content__title">Учётная запись</h1>
                        <div className="setting-page__main-content__allContent">
                            <div className="setting-page__main-content__allContent__info">
                                <h3 className="setting-page__main-content__allContent__info__text">Ваши личные данные</h3>
                            </div>
                            <div className="setting-page__main-content__allContent__info">
                                <h3 className="setting-page__main-content__allContent__info__text">Имя пользователя:</h3>
                                {changeNickname ?
                                    <>
                                        <form onSubmit={handleSubmitNewNickname} className="setting-page__main-content__allContent__info__new-nickname">
                                            <input
                                                type="text"
                                                name="username"
                                                placeholder="Введите новое имя пользователя"
                                                value={newNickname}
                                                onChange={handleInputNicknameChange}
                                            />
                                            <button type="submit" className="setting-page__main-content__allContent__info__buttons profileName-changeButton">
                                                <PlayerIcons icon_name={"settings_apply"} />
                                            </button>
                                        </form>
                                    </>
                                    :
                                    <>
                                        <h3 className="setting-page__main-content__allContent__info__text profileName-text">{userName}</h3>
                                        <button className="setting-page__main-content__allContent__info__buttons profileName-changeButton" onClick={handleClickChangeNickname} disabled={settingsActive}>
                                            <PlayerIcons icon_name={"settings_edit"} />
                                        </button>
                                    </>
                                }
                            </div>
                            <div className="setting-page__main-content__allContent__info">
                                <h3 className="setting-page__main-content__allContent__info__text">Адрес электронная почты:</h3>
                                <h3 className="setting-page__main-content__allContent__info__text profileName-text">{maskEmail(userEmail)}</h3>
                                <button className="setting-page__main-content__allContent__info__buttons profileName-changeButton" onClick={handleClickChangeEmail} disabled={settingsActive}>
                                    <PlayerIcons icon_name={"settings_edit"} />
                                </button>
                            </div>
                            <div className="spacer min-plus"></div>
                            <div className="setting-page__main-content__allContent__info">
                                <h3 className="setting-page__main-content__allContent__info__text">Безопасность</h3>
                            </div>
                            <div className="setting-page__main-content__allContent__info">
                                <h3 className="setting-page__main-content__allContent__info__text">Пароль:</h3>
                                <button className="setting-page__main-content__allContent__info__buttons profilePassword-changeButton" onClick={handleChangePassword}>
                                    {/* <h3 className="setting-page__main-content__allContent__info__buttons profilePassword-changeButton__text">Изменить</h3> */}
                                    Изменить
                                </button>
                            </div>
                            <div className="spacer min-plus"></div>
                            <div className="setting-page__main-content__allContent__info">
                                <h3 className="setting-page__main-content__allContent__info__text">Внешний вид</h3>
                            </div>
                            <div className="setting-page__main-content__allContent__info">
                                <img className="setting-page__main-content__allContent__info__icon" src={avatarUrl.current}></img>
                                <label className="file-input__label" onDragOver={onDragOver} onDrop={onDrop} disabled={settingsActive}>
                                    <span className="sr-only">перетащите сюда картинку чтобы изменить аватар</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onSelectFile}
                                        className="file-input__input"
                                    />
                                </label>
                            </div>
                            <div className="setting-page__main-content__allContent__info">
                                <img className="setting-page__main-content__allContent__info__bg" src={backgroundUrl.current}></img>
                                <label className="file-input__label-bg" onDragOver={onDragOver} onDrop={onDrop} disabled={settingsActive}>
                                    <span className="sr-only">перетащите сюда картинку чтобы изменить фон</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onSelectFileBg}
                                        className="file-input__input"
                                    />
                                </label>
                            </div>
                        </div>
                        {modalOpen && !isBg &&
                            <>
                                <div className="photo-editor__main">
                                    <FileDropArea
                                        updateAvatar={updateAvatar}
                                        closeModal={() => {
                                            setModalOpen(false);
                                            setSettingsActive(false);
                                        }}
                                        file={sendFile}
                                        minWidth="95"
                                        minHeight="95"
                                    />
                                </div>
                            </>
                        }
                        {modalOpen && isBg &&
                            <>
                                <FileDropArea
                                    updateAvatar={updateBackground}
                                    closeModal={() => {
                                        setModalOpen(false);
                                        setSettingsActive(false);
                                        setIsBg(false);
                                    }}
                                    file={sendFile}
                                    minHeight="235"
                                    minWidth="1590"
                                    aspect={7 / 1}
                                />
                            </>
                        }
                        {changeEmail && <ChangeEmail closeSettings={handleSettingsClose} />}
                        {changePassword && <ChangePassword closeSettings={handleSettingsClose} />}
                    </div>
                </>
                :
                <>
                    <Navigate to={"/404"} replace={true} />
                </>
            }
        </>
    );
}