export const setUser = (userData) =>{
    return{
        type: 'LOGIN_SUCCESS',
        payload: userData
    };
};

export const setTrackId = (trackId) => {
    return{
        type: 'TRACK_ID',
        payload: trackId
    };
};

export const setUserId = (userId) => {
    return{
        type: 'USER_ID',
        payload: userId
    };
};

export const setUserEmail = (userEmail) => {
    return{
        type: 'USER_EMAIL',
        payload: userEmail
    };
};