import React, {Component} from 'react';
import Main from './src/screen/Main'
import { Provider } from 'react-redux';
import store from './src/redux/store'
export default class App extends Component {
    render() {
        return(
            <Provider store = {store}>
                <Main/>
            </Provider>
        )
        
    }
}
