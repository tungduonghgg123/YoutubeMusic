import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

function isCloseToEdge({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
const ItemsListVertical = ({ children, isLoading, onCloseToEdge }) => {
    return (
        <ScrollView
            style={{ paddingTop: 7 }}
            onScroll={({ nativeEvent }) => {
                if (isCloseToEdge(nativeEvent)) {
                    onCloseToEdge();
                }
            }}
            scrollEventThrottle={5000}
        >
            {children}
            <ActivityIndicator size='large' animating={isLoading} />
        </ScrollView>
    )
}

export { ItemsListVertical }