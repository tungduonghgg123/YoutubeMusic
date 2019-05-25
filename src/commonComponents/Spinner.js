import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size, color, animating }) => {
    return (
        <View>
            {animating ?
                <View style={styles.spinnerStyle}>
                    <ActivityIndicator size={size || 'large'} color={color}  />
                </View> : <View />
            }
        </View>

    );
};
const styles = {
    spinnerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
};
export { Spinner };