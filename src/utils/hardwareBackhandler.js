import { BackHandler } from 'react-native'

export function handleAndroidBackButton(callback) {
    BackHandler.addEventListener('hardwareBackPress', () => {
        callback();
        return true;
    })
}

export function removeAndroidBackButtonHandler() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
}