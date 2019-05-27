import React from 'react';
import { ScrollView } from 'react-native';
import { Spinner } from '../commonComponents'
import { COMMON_COMPONENTS_COLOR } from '../style'

function isCloseToEdge({ layoutMeasurement, contentOffset, contentSize }) {
  const paddingToRight = 40;
  return layoutMeasurement.width + contentOffset.x >=
    contentSize.width - paddingToRight;
};

const ItemsListHorizontal = ({ children, isLoading, onCloseToEdge,
  onScrollEndDrag, onScrollBeginDrag }) => {

  return (
    <ScrollView
      horizontal={true}
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
      <Spinner size='large' animating={isLoading} style={{ marginLeft: 10 }} color={COMMON_COMPONENTS_COLOR} />
    </ScrollView>
  )
}

export { ItemsListHorizontal }