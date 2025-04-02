export const reducer = (state, action) => {
    switch (action.type) {
        case "setUser":
            return { ...state, user: action.user };
        default:
            break;
    }
}

export const store={
    user:null,
}
