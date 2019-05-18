import { SYNCTRACK} from '../actions/type'


const initialState = {};

export default function (state = initialState, action) {
    console.log(state)
    switch (action.type) {
        case SYNCTRACK:
            return state = action.payload;

        default:
            return state;

    }
}

