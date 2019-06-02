import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

function isCloseToEdge({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

const ItemsListVertical = ({ children, isLoading, onCloseToEdge,
    onScrollEndDrag, onScrollBeginDrag }) => {

    return (
        <ScrollView
            style={{ paddingTop: 7 }}
            onScroll={(event) => {
                if (isCloseToEdge(event.nativeEvent)) {
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