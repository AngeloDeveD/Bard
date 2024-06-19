import { Link, useNavigate } from "react-router-dom";
import myImage from "./../../img/ico/ico.svg";
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { setUser } from "../../../src/actions/userActions";

//import './login.css';
import './starterPage.scss';
//import './custom.scss';

export default function Login() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    //Форма для отправки get запроса на сервер
    //const [formData, setFormData] = useState({ email: '', passwrd: '' });
    const [formData, setFormData] = useState({ email: '', password: '' });

    const [serverResponse, setServerResponse] = useState(null); // Создаем состояние для хранения ответа сервера

    const [dis, setDis] = useState(true);

    //При изменеии email и пароля в formData меняются данные
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (formData.email != "" && formData.password != "") {
            setDis(false);
        } else {
            setDis(true);
        }
    };

    //Функция по отправке get запроса
    const handleSubmit = async (e) => {
        e.preventDefault();
        setDis(true);

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // const response = await fetch('http://172.24.80.146:8080/users/login');

            if (!response.ok) {
                throw new Error('Сетевой ответ был не ok.');
            }

            const data = await response.json();
            console.log(data);

            if (data === undefined || data === null) {
                alert("Ответ получен. Пользователь не найден.");
            } else {
                alert(`Ответ получен. Пользователь ${data.login} найден.`);
                dispatch(setUser(data));
                navigate('/');
            }
        } catch (error) {
            console.error(`Ошибка: ${error}`);
            //alert('Произошла ошибка при выполнении запроса.');
        } finally {
            setDis(false);
        }
    }


    return (
        <>
            <div className="container">
                <div className="logo">
                    <img src={myImage}></img>
                    <h1 className="title-big">OtoWave</h1>
                </div>
                <div className="spacer mid">
                </div>
                <div className="mainform">
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