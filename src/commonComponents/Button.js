import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const CustomButton = ( props ) => {
    const { textStyle, buttonStyle } = styles
    return (
        <TouchableOpacity onPress={props.whenPressed} style={buttonStyle}>
            <Text style= {textStyle}>
                {props.children} 
            </Text>
        </TouchableOpacity>
    )
}
const styles = {
    buttonStyle: {
        // these two style apply to the text
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'silver',
        // this apply to the button itself, in-line block.
        alignSelf: 'center'

    },
    textStyle: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        padding: 10,
    },
    
}
export  {CustomButton}