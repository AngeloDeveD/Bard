import { Link, useNavigate } from "react-router-dom";
import myImage from "./../../img/ico/ico.svg";
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { setUserId, setUserEmail } from "../../../src/actions/userActions";
//import { PlayerIcons } from "../player_icons/player_icons"
import login_error from "../../img/login_error/login_error.svg";

//import './login.css';
import './starterPage.scss';
//import './custom.scss';

export default function Login() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    //Форма для отправки get запроса на сервер
    //const [formData, setFormData] = useState({ email: '', passwrd: '' });
    const [formData, setFormData] = useState({ email: '', password: '' });

    const [errorMessage, setErrorMessage] = useState(null); // Создаем состояние для хранения ответа сервера

    const [dis, setDis] = useState(true);

    //При изменеии email и пароля в formData меняются данные
    const handleInputChange = (e) => {
        setFormData(prevParams => ({
            ...prevParams,
            [e.target.name]: e.target.value
        }));
        setDis(!(formData.email !== "" && formData.password !== ""));
    };

    const encodeQueryParameters = (params) => {
        return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    }

    //Функция по отправке get запроса
    const handleSubmit = async (e) => {
        e.preventDefault();
        setDis(true);
        setErrorMessage(null);

        try {
            const urlWithParams = new URL('http://172.24.80.146:8080/users/login');
            urlWithParams.search = encodeQueryParameters(formData);

            const response = await fetch(urlWithParams);

            if (!response.ok) {
                throw new Error('Сетевой ответ был не ok.');
            }

            const data = await response.json();
            //console.log(data);

            if (data === undefined || data === null) {
                //alert("Ответ получен. Пользователь не найден.");
                setErrorMessage("Данные, веденные для входа, недействительны.");
            } else {
                setErrorMessage(null);
                dispatch(setUserId(data));
                dispatch(setUserEmail(formData.email));
                navigate('/');
            }
        } catch (error) {
            if (!error.message.includes('Сетевой ответ был не ok.')) {
                setErrorMessage('Ошибка CORS: Не удалось выполнить запрос.');
            }
            else {
                setErrorMessage("Данные, веденные для входа, недействительны.");
            }
            console.error(`Ошибка: ${error}`);
            //alert('Произошла ошибка при выполнении запроса.');
        } finally {
            setDis(false);
        }
    }

    useEffect(() => {
        setDis(!(formData.email !== "" && formData.password !== ""));
    }, [formData]);

    return (
        <>
            <div className="container">
                <div className="logo">
                    <img src={myImage}></img>
                    <h1 className="title-big">OtoWave</h1>
                </div>
                <div className="mainform">
                    <div className="error__container" style={errorMessage ? { opacity: "1" } : { opacity: "0" }}>
                        <div className="error__message-container">
                            <img src={login_error}></img>
                        </div>
                        <div className="error__message-icon">
                            <h1 className="error__message-text">{errorMessage}</h1>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder="Эл. почта" value={formData.email} onChange={handleInputChange} className="inputField Login"></input>
                        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleInputChange} className="inputField Password"></input>
                        <div className="link forgot">
                            <Link to="/recovery" className="link forgot">Забыли пароль ?</Link>
                        </div>
                        <div>
                            <input type="submit" value="Войти" className="inputField Button middle" disabled={dis}></input>
                        </div>
                    </form>
                </div>
                <div className="spacer min">
                </div>
                <div className="link registration">
                    <Link to="/register" className="link registration">У вас нет аккаунта ? Зарегистрируйтесь!</Link>
                </div>
            </div>
        </>
    );
}