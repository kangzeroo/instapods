import React, { useState } from 'react'
import { StyleSheet, View, Clipboard, TouchableOpacity } from 'react-native'
import { Layout, Text, Icon, Button } from '@ui-kitten/components'
import analytics from '@react-native-firebase/analytics'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import { WhiteSpace } from '@ant-design/react-native'
import { GOOGLE_ANALYTICS_LOG_SHARE_TYPES } from '../../../../common/analytics'
import { COLORS, FONTS } from '../../../../styles'
import { PodAsMember } from '../../../../generated-types'
import { BUNDLE_ID } from '../../../../common/constants'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 30,
        width: 300,
        borderRadius: 15,
    },
    headline: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
    },
    checkline: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
    },
    checklineText: {
        marginLeft: 10,
    },
    copyLinkButton: {
        marginTop: 20,
    },
    iconStyle: {
        color: 'black',
        height: '100%',
    },
})

type Props = {
    pod: PodAsMember
    closeModal: () => void
    backOption?: () => void
}
const PodInviteModal = ({ pod, backOption }: Props) => {
    const [clipboardSuccessMessage, setClipboardSuccessMessage] = useState(
        false
    )

    const buildLink = async () => {
        const link = await dynamicLinks().buildShortLink(
            {
                // TODO: move this to an env file
                link: `https://instapod.page.link/onboarding/?pod=${pod.id}`,
                domainUriPrefix: `https://instapod.page.link`,
                ios: {
                    bundleId: BUNDLE_ID,
                    appStoreId: '1508811220',
                    fallbackUrl:
                        'https://apps.apple.com/ca/app/instapods/id1508811220',
                    minimumVersion: '18',
                },
            },
            // @ts-ignore
            'UNGUESSABLE'
        )

        return link
    }

    const copyLink = async () => {
        const link = await buildLink()
        await Clipboard.setString(link)
        setClipboardSuccessMessage(true)
        analytics().logShare({
            content_type: GOOGLE_ANALYTICS_LOG_SHARE_TYPES.POD_SHARE,
            item_id: pod.id,
        })
        setTimeout(() => {
            setClipboardSuccessMessage(false)
        }, 1000)
    }
    const BackNav = () => {
        // return (
        //     <>
        //         <View style={Styles.navHeader}>
        //             <TouchableOpacity onPress={backOption}>
        //                 <Icon
        //                     name="arrow-ios-back-outline"
        //                     style={Styles.iconStyle}
        //                 />
        //             </TouchableOpacity>
        //         </View>
        //         <WhiteSpace />
        //     </>
        // )
        return (
            <>
                <WhiteSpace />
                <Button onPress={backOption} appearance="ghost">
                    Back
                </Button>
            </>
        )
    }
    const requirements = [
        'Be kind, no jerks',
        'Only invite within your niche',
        'Commited members only',
    ]
    return (
        <Layout style={Styles.root}>
            <Text
                style={Styles.headline}
                category="h6"
            >{`Invite friends to join \n @${pod.slug}`}</Text>
            <WhiteSpace />
            <View>
                {requirements.map(req => (
                    <View key={req} style={Styles.checkline}>
                        <Icon
                            name="checkmark-circle-2-outline"
                            width={32}
                            height={32}
                            fill={COLORS.GREEN['500']}
                        />
                        <Text style={Styles.checklineText}>{req}</Text>
                    </View>
                ))}
                <View key="friend-link" style={Styles.checkline}>
                    <Icon
                        name="info-outline"
                        width={32}
                        height={32}
                        fill={COLORS.BLUE['500']}
                    />
                    <Text style={Styles.checklineText}>
                        Send the copied link to your friend
                    </Text>
                </View>
            </View>
            {clipboardSuccessMessage ? (
                <Button status="success" style={Styles.copyLinkButton}>
                    COPIED!
                </Button>
            ) : (
                <Button onPress={copyLink} style={Styles.copyLinkButton}>
                    COPY LINK
                </Button>
            )}
            {backOption && BackNav()}
        </Layout>
    )
}

export default PodInviteModal
