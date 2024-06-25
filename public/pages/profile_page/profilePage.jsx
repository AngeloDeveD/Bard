import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PlayerIcons from "../player_icons/player_icons";

import './profilePage.scss';

export default function ProfilePage({ isUserProfile = true }) {
    let [searchParams, setSearchParams] = useSearchParams();

    //const userid = useSelector(state => state.user.userId);
    const userData = useSelector(state => state.user.userData);

    const navigate = useNavigate();

    const [isEdit, setIsEdit] = useState(false);

    const [userID, setUserID] = useState(0);
    const [userIco, setUserIco] = useState('');
    const [userBackground, setUserBackground] = useState(''); //
    const [userName, setUserName] = useState('');
    const [subscribers, setSubscribers] = useState(0);
    const [subscribtions, setSubscribtions] = useState(0);
    const [description, setDescription] = useState('');
    const [mouseEnter, setMouseEnter] = useState(false);

    const [subscribed, setSubscribed] = useState(false);

    const [mainBackdropWidth, setMainBackdropWidth] = useState(0);

    const [newDescription, setNewDescription] = useState(description);

    const userIdProfile = searchParams.get('pfid');

    const [authors, setAuthors] = useState([
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        },
        {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIiJSnn9pw1Emb1VN814kbuWvYBb8ATslCPw&s",
            author_name: "Автор"
        }
    ])

    const handleClickSubscribe = () => {
        setSubscribed(!subscribed);
        subscribtions === 0 ? setSubscribtions(subscribtions + 1) : setSubscribtions(subscribtions - 1);
    }

    const toggleShowUnsubscribe = () => {
        setMouseEnter(true);
    }

    const toggleHideUnsubscribe = () => {
        setMouseEnter(false)
    }

    const toggleEditDescription = () => {
        setIsEdit(true);
    }

    const encodeQueryParameters = (params) => {
        return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    }

    const handleSumbitNewDescription = (e) => {
        e.preventDefault();

        const fetchData = async () => {
            const sendData = { newTale: newDescription };

            const changeDescriptionUrl = new URL(`http://172.24.80.146:8080/users/${userID}/change-tale`);
            changeDescriptionUrl.search = encodeQueryParameters(sendData);

            try {
                const response = await fetch(changeDescriptionUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendData)
                });

                if (!response.ok) {
                    throw new Error("Ошибка получения данных от сервера!!");
                }

                setDescription(newDescription);
            } catch (error) {
                console.error("Ошибка обработки данных", error);
            }
        }

        fetchData();

        setIsEdit(false);

    };

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://172.24.80.146:8080/users/${userIdProfile}/profile`);

            if (!response.ok) {
                throw new Error("Ошибка отправки запроса!");
            }

            if (response.status === 404) {
                throw new Error("Пользователь не найден!");
            }

            const data = await response.json();

            setUserID(data.face.itemID);
            setUserIco(`http://172.24.80.146/images/${data.face.coverID}.webp`);
            setUserBackground(`http://172.24.80.146/images/${data.headerID}.webp`);
            setUserName(data.face.username);
            setSubscribtions(data.subscribed);
            setDescription(data.tale);
        } catch (error) {
            console.error("Ошибка получения данных.", error);
            navigate("/404");
        }
    };

    useEffect(() => {
        console.log(`profilePage: ${userID}`);

        if (!isUserProfile) {
            if (userIdProfile === userID) {
                navigate('/profile');
            }
            else {
                fetchUserData();
            }
        }
        else {
            setUserID(userData.face.itemID);
            setUserIco(`http://172.24.80.146/images/${userData.face.coverID}.webp`);
            setUserBackground(`http://172.24.80.146/images/${userData.headerID}.webp`);
            setUserName(userData.face.username);
            setSubscribtions(userData.subscribed);
            setDescription(userData.tale);
            setNewDescription(description);
        }

        console.log(isUserProfile);
        //console.log(user)

        const handleResize = () => {
            const cont = document.querySelector('.main-backdrop');
            setMainBackdropWidth(cont.clientWidth);
        }

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const panelWidth = {
        width: `${mainBackdropWidth}px`
    };

    return (
        <>
            <div className="profile p-background b-container" style={panelWidth}>
                <div className="profile p-background b-image-container">
                    <img className="profile p-background b-image" src={userBackground}></img>
                </div>
            </div>
            <div className="profile p-info in-container">
                <div className="profile p-info in-upper">
                    <div className="profile p-icon i-container">
                        <img className="profile p-icon i-image" src={userIco} onError={(e) => e.target.src = "https://cdni.iconscout.com/illustration/premium/thumb/404-7304110-5974976.png?f=webp"}></img>
                    </div>
                    <div className="profile p-info in-name n-container">
                        <h2 className="profile p-info in-name n-text">{userName}</h2>
                        <div className="profile p-button b-container">
                            {!isUserProfile ?
                                <>
                                    <button
                                        className={`profile p-button b-all-buttons ${subscribed ? "a-subscribed" : "a-subscribe"}`}
                                        onClick={() => handleClickSubscribe()}
                                        onMouseEnter={() => toggleShowUnsubscribe()}
                                        onMouseLeave={() => toggleHideUnsubscribe()}>
                                        {subscribed ? mouseEnter ? "Отписаться" : "Вы подписаны" : "Подписаться"}
                                    </button>
                                </>
                                :
                                <>
                                    <button className="profile p-button b-all-buttons a-edit-profile" onClick={() => navigate("/settings?st=account")}>Настройки профиля</button>
                                </>
                            }
                        </div>
                        <div className="profile p-links l-container">
                            <a className="profile p-links l-link" href="">Подписчиков: {subscribers}</a>
                            <a className="profile p-links l-link" href="">Подписок: {subscribtions}</a>
                        </div>
                        <div className="profile p-description d-container">
                            {!isEdit ?
                                <>
                                    <a className="profile p-description d-text" onClick={() => console.log("Clicked")}>
                                        {description}
                                    </a>
                                    {isUserProfile &&
                                        <>
                                            <button className="profile p-description d-container__change-description" onClick={toggleEditDescription}>
                                                <PlayerIcons icon_name={"settings_edit"} />
                                            </button>
                                        </>
                                    }
                                </> :
                                <>
                                    <form onSubmit={handleSumbitNewDescription} className="profile p-description d-text__form">
                                        <input
                                            type="text"
                                            name="description"
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            value={newDescription}
                                            placeholder="Введите описание"
                                            className="profile p-description d-text dd-edit-desc"
                                        />
                                        <button type="submit" className="profile p-description d-container__change-description">
                                            <PlayerIcons icon_name={"settings_apply"} classname="profile p-description d-container__change-description__button"/>
                                        </button>
                                    </form>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile p-authors a-main-container" style={{ opacity: "1" }}>
                <h2 className="profile p-authors a-main-text">Часто прослушиваемые артисты</h2>
                <div className="profile p-authors a-author-button">
                    {authors.map((author, index) => {
                        return (
                            <button key={index} className="profile p-authors a-containers">
                                <img className="profile p-authors a-containers c-author-image" src={author.img}></img>
                                <h2 className="profile p-authors a-containers c-author-name">{author.author_name}</h2>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
