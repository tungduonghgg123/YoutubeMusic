import { TURNON, TURNOFF} from '../actions/type';

const initialState = true;
 
export default function( state = initialState, action) {
    switch (action.type) {
        case TURNON:
            state = true;
            break;
        case TURNOFF:
            state = false;
            break;
        default:
            console.log('there is problem with reducer')
            state = false;
            break;
    }
}
