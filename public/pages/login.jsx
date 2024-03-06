import { Link, Navigate } from "react-router-dom";

export default function Login() {
    return (
        <>
            <div className="container">
                <div className="logo">
                    <img src=""></img>
                    <h1>MuseScore</h1>
                </div>
                <div className="form">
                    <form>
                        <input type="text" placeholder="Логин или email"></input>
                        <input type="password" placeholder="Пароль"></input>
                        <button className="Button login">Войти</button>
                        <Link to="/signup"><button className="Button signup">Регистрация</button></Link>
                        <Link to="/forgot-password">Забыли пароль</Link>
                    </form> 
                </div>
            </div>
        </>
    );
}