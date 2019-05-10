import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

function isCloseToEdge({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
const YoutubeSeachScroll = ({ children, onSearch, searchInput, isLoading, listItem, nextPageToken }) => {
    return (
        <ScrollView
            style={{ paddingTop: 7 }}
            onScroll={({ nativeEvent }) => {
                if (isCloseToEdge(nativeEvent) &&
                    !isLoading && 
                    listItem.length < 50 &&
                    listItem.length != 0) {
                    onSearch(searchInput, 5, nextPageToken)
                }
            }}
            scrollEventThrottle={5000}
        >
            {children}
            <ActivityIndicator size='large' animating={isLoading} />
        </ScrollView>
    )
}   

export { YoutubeSeachScroll }