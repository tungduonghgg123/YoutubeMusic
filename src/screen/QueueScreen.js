import React, { Component } from 'react'
import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { Card, CardSection, QueueHeader, Header } from '../commonComponents'
import { getTrackQueue, handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils'
import { BACKGROUND_COLOR, TEXT_COLOR } from '../style'
export default class QueueScreen extends Component {
    state = { queue: [] };

    async componentDidMount() { let queue = await getTrackQueue(); this.setState({ queue }) }
    renderQueue() {
        let trackQueue = this.state.queue.map(track => {
            return (
                <Card key={track.id} style={{backgroundColor: BACKGROUND_COLOR}}>
                    <CardSection>
                        <Text style={styles.titleStyle}>
                            {track.title}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Text style={styles.artistStyle}>
                            {track.artist}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Text style={styles.artistStyle}>
                            {track.timestamp}
                        </Text>
                    </CardSection>
                </Card>
            )
        })
        return trackQueue.reverse()
    }
    render() {

        return (
            <SafeAreaView style={styles.containerStyle}>
                <QueueHeader
                    message="History"
                    onBackPress={() => { this.props.navigation.goBack() }}
                />
                <ScrollView style={{ marginTop: 20 }}>
                    {this.renderQueue()}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: BACKGROUND_COLOR,
        flex: 1,

    },
    titleStyle: {
        fontWeight: 'bold',
        color: TEXT_COLOR,
        backgroundColor: BACKGROUND_COLOR
    },
    artistStyle: {
        color: TEXT_COLOR,
        backgroundColor: BACKGROUND_COLOR
    }
}