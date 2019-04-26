import React, { Component } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import Music from './Music';
import Search from './Search'

export default class App extends Component {

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray' }}>
        <View>
          <Music/>
          {/* <Search/> */}
        </View>
      </SafeAreaView>
    );
  }
}