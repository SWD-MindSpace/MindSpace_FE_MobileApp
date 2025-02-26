import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SPDetailScreen = ({ route }) => {
    const { programId } = route.params
    return (
        <View>
            <Text>Suporting Program ID: {programId}</Text>
        </View>
    )
}

export default SPDetailScreen

const styles = StyleSheet.create({})