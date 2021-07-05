import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Spinner, Text } from '@ui-kitten/components'

const initMessages = [
    'Connecting directly to your niche',
    'Warming up your fans',
    'Beating the Instagram algorithm',
]
const initEmoticon = ['😇', '🥳', '😘']
const ellipse = '...'

const Styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        alignItems: 'center',
    },
    emo: {
        fontSize: 42,
        lineHeight: 64,
    },
    message: {
        fontSize: 20,
        marginTop: 15,
        marginBottom: 30,
        marginHorizontal: 20,
        lineHeight: 26,
        textAlign: 'center',
    },
    inlineEmo: {
        lineHeight: 0,
    },
})

type TypewriterProps = {
    messages?: Array<String>
    emoticons?: Array<String>
    isLoading?: boolean
    period?: number
    isInline?: boolean
    maxLoops?: number
}

/**
 * loading typewriter to keep the user engaged... ;P
 * @param messages optinonal array of messages to display defaults to above initScript
 * @param emoticons optional array of cute emoticons to display in sync (or not) with initScript
 * @param isLoading true displays spinner
 * @param period to update the message and icon every ms
 * @param isInline puts emoticon inline (also makes it smaller)
 * @param maxLoops max number of typewriter loops to use (default 10) --- hacky shit needed to stop updating state in background
 *
 */
const Typewriter = ({
    messages = initMessages,
    emoticons = initEmoticon,
    isLoading = true,
    period = 3000, // ms
    isInline = true,
    maxLoops = 10,
}: TypewriterProps) => {
    const [idx, setIdx] = useState(0)
    const [isEnabled, setIsEnabled] = useState(true)

    useEffect(() => {
        if (isEnabled) {
            setTimeout(() => {
                setIdx(idx + 1)
            }, period)
        }

        return () => {
            if (idx > maxLoops) {
                // kill the loop - prevents state changes when unmounted
                setIsEnabled(false)
                setIdx(0)
            }
        }
    })

    const showEmo: boolean = emoticons && emoticons.length > 0
    const emo: string = emoticons[idx % emoticons.length]
    return (
        <View style={Styles.container}>
            {showEmo && !isInline && (
                <Text category="h1" style={Styles.emo}>
                    {emo}
                </Text>
            )}

            <Text style={Styles.message}>
                {showEmo && isInline && (
                    <Text
                        category="h1"
                        style={Styles.inlineEmo}
                    >{`${emo} `}</Text>
                )}
                {messages[idx % messages.length] + ellipse
                // ellipse.slice(0, idx % (ellipse.length + 1))
                }
            </Text>
            {isLoading ? <Spinner size="large" /> : null}
        </View>
    )
}

export default Typewriter
