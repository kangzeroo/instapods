import React from 'react'
import {
    TouchableWithoutFeedback,
    Keyboard,
    View,
    StyleSheet,
} from 'react-native'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
    },
})

const DismissKeyboardHOC = ({ children }: { children: any }) => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={Styles.root}>{children}</View>
        </TouchableWithoutFeedback>
    )
}

export default DismissKeyboardHOC
