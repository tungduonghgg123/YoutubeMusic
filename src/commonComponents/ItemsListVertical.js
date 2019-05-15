import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

function isCloseToEdge({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
function onScroll(event) {
    onScroll123
}
const ItemsListVertical = ({ children, isLoading, onCloseToEdge,
    onScrollEndDrag, onScrollBeginDrag, onScroll}) => {

    return (
        <ScrollView
            style={{ paddingTop: 7 }}
            // onScroll={(event) => {
            //     onScroll123(event)
            //     if (isCloseToEdge(event.nativeEvent)) {
            //         onCloseToEdge();
            //     }
            // }}
            onScroll={(event) => {
                onScroll(event)
                if(isCloseToEdge(event.nativeEvent)) {
                    onCloseToEdge()
                }
            }}
            scrollEventThrottle={5000}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
        >
            {children}
            <ActivityIndicator size='large' animating={isLoading} />
        </ScrollView>
    )
}

export { ItemsListVertical }