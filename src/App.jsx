import { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { FocusProvider } from "./context/FocusContext";

const Login = lazy(() => import('../public/pages/login_pages/login'));
const SignUp = lazy(() => import('../public/pages/login_pages/signup'));
const ForgotPassword = lazy(() => import('../public/pages/login_pages/forgotPassword'));
const SongPage = lazy(() => import('../public/pages/song_page/song_page'));
const NotFound = lazy(() => import('../public/pages/404/404'));

import { setUser } from "../src/actions/userActions";

import './index.scss';
import './standart.scss'; 
//import './custom.scss';

export default function App() {

  const user = useSelector((state) => state.user.userId);
  const [isLogged, setIsLogged] = useState(!!user);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLogged(!!user);
    //console.log(`App: ${user}`);

    if (user) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://172.24.80.146:8080/users/${user}/profile`);

          if (!response.ok) {
            throw new Error('Ошибка связи с сервером!!');
          }

          //setUserData(response.json());
          const data = await response.json();
          dispatch(setUser(data));

        } catch (e) {
          console.error("Ошибка запроса!!");
        }
      }

      fetchData();
    }
  }, [user]);

  return (
    <Routes>
      <Route path='/'
        element={
          isLogged ?
            <Suspense fallback={<></>}>
              <FocusProvider>
                <SongPage />
              </FocusProvider>
            </Suspense>
            : <Navigate to={"/login"} replace={true} />
        }
      //если "/" -> если пользователь зарегестрирован -> <MainPanel />, иначе <Navigate to={"/login"} />
      >
        <Route index element={
          <></>
        } /*Если будет просто "/" */ />
        <Route path='explore'
          element={
            <></>
          }
        //Если будет "/explore"
        />
        <Route path='playlist'
          element={
            <></>
          }
        />
        <Route path='album'
          element={
            <></>
          }
        />
        <Route path='profile'
          element={
            <></>
          }
        />
        <Route path='user'
          element={
            <></>
          }
        />
        <Route path='search'
          element={
            <></>
          }
        />
        <Route path='settings'
          element={
            <></>
          }
        />
      </Route>
      <Route path="login"
        element={
          <Suspense fallback={<></>}>
            <Login />
          </Suspense>
        }
      />
      <Route path="register"
        element={
          <Suspense fallback={<></>}>
            <SignUp />
          </Suspense>
        }
      />
      <Route path="recovery"
        element={
          <Suspense fallback={<></>}>
            <ForgotPassword />
          </Suspense>
        }
      />
      <Route path="*"
        element={
          <Suspense fallback={<></>}>
            <NotFound />
          </Suspense>
        }
      />
      <Route path='404'
        element={
          <Suspense fallback={<></>}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}