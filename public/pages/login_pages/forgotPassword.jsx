import { Link } from "react-router-dom";
import myImage from "./../../img/ico.svg";
import { useState } from 'react';
import './login.css';

const MainForget = ({ onPasswordReset }) => {

    const [message, setMessage] = useState('Эл. почта');
    const [formData, setFormData] = useState({ email: '' });
    const [dis, setDis] = useState(true);

    const handleEmailCheck = (e) => {
        setFormData({ email: e.target.value });
        if (e.target.value !== "") {
            setDis(false);
        } else {
            setDis(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setDis(true);
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            //Если запрос отправлен успешно
            if (response.ok) {
                alert("Отправлено");
                onPasswordReset();
            }
            //Если запрос был отправлен неуспешно(пока что это всё равно хорошо)
            else {
                alert('Вроде бы что то есть!');
                onPasswordReset();
            }
        } catch (error) {
            console.error(`Ошибка: ${error}`);
            alert("Ошибка get запроса!!");
            setDis(false);
        }
    }

    return (
        <>
            <div className="spacer min">
            </div>
            <h2>Напишите email вашего аккаунта чтобы сменить пароль</h2>
            <div className="spacer min">
            </div>
            <div className="mainform">
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder={message} className="inputField Login" onChange={handleEmailCheck}></input>
                    <div>
                        <input type="submit" value="Восстановить пароль" className="inputField Button middle" style={{ width: '66%' }} disabled={dis}></input>
                    </div>
                </form>
            </div>
            <div className="spacer mid">
            </div>
            <div className="links">
                <Link to="/register" className="links">Зарегистрироваться</Link>
                <Link to="/login" className="links">Войти</Link>
            </div>
        </>
    );
}

const LastForget = () => {
    return (
        <>
            <div className="spacer min">
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1 style={{ width: '60%' }}>Проверьте ваш почтовый ящик, туда придёт письмо с инструкциями</h1>
            </div>
            <div className="spacer mid">
            </div>
            <div className="links">
                <Link to="/register" className="links">Зарегистрироваться</Link>
                <Link to="/login" className="links">Войти</Link>
            </div>
        </>
    )
}

export default function ForgotPassoword() {
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const handlePasswordReset = () => {
        setIsResettingPassword(true);
    }

    return (
        <>
            <div className="container">
                <div className="logo">
                    <img src={myImage}></img>
                    <h1>OtoWave</h1>
                </div>
                {isResettingPassword ? <LastForget /> : <MainForget onPasswordReset={handlePasswordReset} />}
            </div>
        </>
    );
}