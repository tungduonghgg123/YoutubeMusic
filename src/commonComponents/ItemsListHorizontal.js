import React from 'react';
import { ScrollView } from 'react-native';
import { Spinner} from '../commonComponents'
import {  COMMON_COMPONENTS_COLOR } from '../style'

function isCloseToEdge({ layoutMeasurement, contentOffset, contentSize }) {
  console.log(layoutMeasurement)
  console.log(contentOffset)
  console.log(contentSize)
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

const ItemsListHorizontal = ({ children, isLoading, onCloseToEdge,
  onScrollEndDrag, onScrollBeginDrag }) => {

  return (
    <ScrollView
      horizontal={true}
      style={{ paddingTop: 7 }}
      // onScroll={(event) => {
      //   if (isCloseToEdge(event.nativeEvent)) {
      //     onCloseToEdge()
      //   }
      // }}
      scrollEventThrottle={5000}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
    >
      {children}
      <Spinner size='large' animating={isLoading} color={COMMON_COMPONENTS_COLOR} />
    </ScrollView>
  )
}

export { ItemsListHorizontal }