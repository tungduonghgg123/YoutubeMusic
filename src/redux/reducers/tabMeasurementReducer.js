const SET_TAB_MEASUREMENT = 'set_tab_measurement';

let initialState = {}
export default function (state = initialState, action){

    switch (action.type) {
        case SET_TAB_MEASUREMENT:
            console.log('ahihi')
            console.log(action.measurement)
            return state = action.measurement;
        default:
            console.log('default')
            return state;
    }
}