const initialState = {
    userData: null,
    trackId: '',
    userId: null,
    userEmail: ''
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return{
                ...state,
                userData: action.payload
            };
        
        case 'TRACK_ID':
            return{
                ...state,
                trackId: action.payload
            };

        case 'USER_ID':
            return{
                ...state,
                userId: action.payload
            };

        case 'USER_EMAIL':
            return{
                ...state,
                userEmail: action.payload
            }
        
        default:
            return state;
    }
};

export default userReducer