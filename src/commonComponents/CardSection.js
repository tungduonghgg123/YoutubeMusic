import React from 'react'
import { View, Text } from 'react-native'

const  CardSection = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    )
}
const styles = {
    containerStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative',
    }
}

export { CardSection }
