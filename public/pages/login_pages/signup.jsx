import { Link, useNavigate } from "react-router-dom";
import myImage from "./../../img/ico/ico.svg";
import { useState, useEffect } from 'react';

//import './login.css';
import './starterPage.scss';

export default function SignUp() {
    //Создание переменных под логин, email, 2 паролей и сообщения, которое появляется при введении паролей.
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    //Создание boolean переменных, которые блокируют регистрацию если пользователь вводит данные неправильно
    const [passwAccess, setPasswAccess] = useState(false);
    const [logAccess, setLogAccess] = useState(false);
    const [mailAccess, setMailAccess] = useState(false);
    const [allClear, setAllClear] = useState(false);

    //Создание формы для будущей отправки на сервер путём POST запроса.
    const [formData, setFormData] = useState({ nickname: '', email: '', password: '' });

    const [dis, setDis] = useState(false);

    const navigate = useNavigate();

    const encodeQueryParameters = (params) => {
        return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    }

    //Функция по отправке POST запроса на севрер
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setDis(true);
            const urlWithParams = new URL('http://172.24.80.146:8080/users/register');
            urlWithParams.search = encodeQueryParameters(formData);
            const response = await fetch(urlWithParams, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)//data
            });
            //Если запрос отправлен успешно
            if (response.ok && response.status === 200) {
                navigate('/');

            }
            //Если запрос был отправлен неуспешно(пока что это всё равно хорошо)
            else {
                alert('Чёт неработает');
            }
        } catch (error) {
            console.error(`Ошибка: ${error}`);
            setDis(false);
        }
    }

    useEffect(() => {
        //Если все "замки" сняты, то в форму добавляются данные, которые ввёл пользователь
        if (passwAccess && logAccess && mailAccess) {
            setAllClear(true);
            setFormData({
                nickname: username,
                email: email,
                password: password
            });
        }
        else {
            setAllClear(false);
        }
    }, [passwAccess, logAccess, mailAccess, username, email, password])

    //Функция, фиксирующая изменения строчки "Ввода пароля"
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        checkPassword(e.target.value, confirmPassword);
    }

    //Функция, фиксирующая изменения строчки "Повторного ввода пароля"
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        checkPassword(password, e.target.value);
    }

    //Функция, которая проверяет изменения строчки email
    const handleConfirmEmailChange = (e) => {
        setEmail(e.target.value);
        //Способ неактуальный, но менять в нём что-то страшно. Код проверяет, ввёл ли пользователь "@". Если пользователь это ввёл, то "замок" почты снимается
        if (e.target.value.indexOf("@") < 0) {
            setMailAccess(false);
        }
        else {
            setMailAccess(true);
        }
    }

    //Функция, которая фиксирует изменение строчки "Логин". Если пользователь хоть что то ввёл, то "замок" логина снимается
    const handleConfirmUsername = (e) => {
        setUsername(e.target.value);
        if (e.target.value !== "") {
            setLogAccess(true);
        }
        else {
            setLogAccess(false);
        }
    }

    //Функция, которая проверяет пароли на сходство. Если пароли одинаковы и не пусты, то "замок" пароля снимается.
    const checkPassword = (passwordValue, confirmPasswordValue) => {
        if (passwordValue !== confirmPasswordValue) {
            if (confirmPasswordValue !== '') {
                setMessage("Пароли не совпадают.")
            }
            else {
                setMessage(null);
            }
            setPasswAccess(false);
        }
        else if (passwordValue === '') {
            setMessage(null);
            setPasswAccess(false);
        }
        else {
            setMessage(null);
            setPasswAccess(true);
        }
    }

    return (
        <>
            <div className="container">
                <div className="logo">
                    <img src={myImage}></img>
                    <h1 className="title-big">OtoWave</h1>
                </div>
                <div className="spacer min">
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mainform">
                        <input type="text" placeholder="Логин" className="inputField Login" onChange={handleConfirmUsername}></input>
                        <input type="email" placeholder="Эл. почта" className="inputField Login" onChange={handleConfirmEmailChange}></input>
                        <input type="password" placeholder="Пароль" className={`inputField Login ${ message && password !== confirmPassword ? "Red" : ""}`} value={password} onChange={handlePasswordChange}></input>
                        <input type="password" placeholder="Повторить пароль" className={`inputField Password ${password !== confirmPassword ? "Red" : ""}`} value={confirmPassword} onChange={handleConfirmPasswordChange}></input>
                        <div className="link forgot">
                            <Link to="/login" className="link forgot">Войти в аккаунт</Link>
                        </div>
                        <div style={{ paddingTop: '5%' }}>
                            <input type="submit" value="Создать аккаунт" className="inputField Button middle" disabled={!allClear || dis} style={{ width: '56%' }}></input>
                        </div>
                        {message && <p style={{ color: password === confirmPassword ? 'green' : 'red' }}>{message}</p>}
                    </div>
                </form>
                <div className="spacer mid">
                </div>
            </div>
        </>
    );
}