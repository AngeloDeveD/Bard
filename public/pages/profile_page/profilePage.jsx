import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import './profilePage.scss';

export default function ProfilePage({ isUserProfile = true }) {
    let [searchParams, setSearchParams] = useSearchParams();

    //const userid = useSelector(state => state.user.userId);
    const userData = useSelector(state => state.user.userData);

    const navigate = useNavigate();

    const [userID, setUserID] = useState(userData.face.itemID);
    const [userIco, setUserIco] = useState(`http://172.24.80.146/images/${userData.face.coverID}.webp`);
    const [userBackground, setUserBackground] = useState(`http://172.24.80.146/images/${userData.headerID}.webp`); //
    const [userName, setUserName] = useState(userData.face.username);
    const [subscribers, setSubscribers] = useState(0);
    const [subscribtions, setSubscribtions] = useState(userData.subscribed);
    const [description, setDescription] = useState(userData.tale);
    const [mouseEnter, setMouseEnter] = useState(false);

    const [subscribed, setSubscribed] = useState(false);

    const [mainBackdropWidth, setMainBackdropWidth] = useState(0);

    const userIdProfile = searchParams.get('pfID');

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

    useEffect(() => {
        console.log(`profilePage: ${userID}`);

        if (!isUserProfile) {
            if (userIdProfile === userID) {
                navigate('/profile');
            }
        }

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
                            <a className="profile p-description d-text" onClick={() => console.log("Clicked")}>
                                {description}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile p-authors a-main-container">
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
