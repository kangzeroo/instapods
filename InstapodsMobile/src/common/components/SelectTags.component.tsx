import React, { useState } from 'react'
import { View, Text, Keyboard, StyleSheet } from 'react-native'
import { Input, Layout, Icon } from '@ui-kitten/components'
import { COLORS } from '../styles'

type SelectTagProps = {
    tags: Array<string>
    updateTags: Function
    onChange?: Function
    label?: string
    tagPrefix?: string
    isHashTag?: boolean
    placeholder?: string
}

/**
 * General Tag Input/Selection Component
 * Can add arbitrary tags and also remove them. Access the tags with optional @param onChange like onChange={(list) => {console.log(list)}}
 *
 * @param tags: array of string (we manage the state outside)
 * @param updateTags: function - to update tags state (externally)
 * @param label: optional string - @default "" provides a label for the input
 * @param tagPrefix: optional string - @default "" Prefixed to tags if specified
 * @param isHashTag: optional boolean - @default false if true, tags conform to hash tag rules: all lowercase, no spaces...
 * @param placeholder: optional string - @default "Add tags"
 *
 * @note you need to manage the state of tags outside of this component for @example:
 *       const [tags, setTags] = useState([])
 *       return (
 *              <SelectTags
 *                  tags={tags}
 *                  updateTags={setTags}
 *                  />
 *      )
 */
const SelectTags = ({
    tags,
    updateTags,
    label = '',
    tagPrefix = '',
    isHashTag = false,
    placeholder = 'Add tags',
}: SelectTagProps) => {
    // if (updateTags == null) {
    //     const [tags, updateTags] = useState([])
    // }
    const [tag, setTagStr] = useState('')

    const validTag = (tagStr: string) =>
        tagStr.length > 0 && tags.indexOf(tagStr) === -1

    const addTag = (tagStr: string) => {
        if (validTag(tagStr)) {
            const newData = [...tags, tagStr]
            updateTags(newData)
            setTagStr('')
        }
    }

    const removeTag = (tagStr: string) => {
        const newData = tags.filter(f => f !== tagStr)
        updateTags(newData)
    }

    const returnTag = (tagStr: string) => {
        if (tagPrefix) {
            return `${tagPrefix}${tagStr}`
        }
        return tagStr
    }

    const onChangeText = (tagStr: string) => {
        let outputTagStr = tagStr
        if (isHashTag) {
            outputTagStr = outputTagStr
                .replace(/\s/g, '')
                .replace(/@/g, '')
                .toLowerCase()
        }
        setTagStr(outputTagStr)
    }

    return (
        <Layout>
            <Input
                value={tag}
                placeholder={placeholder}
                icon={AddIcon}
                autoCorrect={false}
                // ref={hashtagsInputRef}
                // label="Add Hashtags"
                label={label}
                onIconPress={() => {
                    addTag(tag)
                    Keyboard.dismiss()
                }}
                onChangeText={value => onChangeText(value)}
                // onSubmitEditing={() => Keyboard.dismiss()}
                onSubmitEditing={() => {
                    addTag(tag)
                    Keyboard.dismiss()
                }}
                size="large"
                style={Styles.input}
                maxLength={20}
            />
            <Layout style={Styles.pills}>
                {tags
                    .filter(p => p)
                    .map(dataTag => (
                        <View key={`tag-${dataTag}`} style={Styles.pill}>
                            <View style={Styles.removeButtonWrap}>
                                <Text
                                    onPress={() => removeTag(dataTag)}
                                    style={Styles.removeButton}
                                >
                                    x
                                </Text>
                            </View>
                            <Text style={Styles.hashtag}>
                                {returnTag(dataTag)}
                            </Text>
                        </View>
                    ))}
            </Layout>
        </Layout>
    )
}

export default SelectTags

const AddIcon = (style: object) => <Icon {...style} name="plus-outline" />

const Styles = StyleSheet.create({
    pills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 30,
    },
    pill: {
        padding: 7,
        // backgroundColor: COLORS.BLUE['400'],
        backgroundColor: COLORS.BLACK['200'],
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginRight: 20,
        borderRadius: 6,
        minWidth: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hashtag: {
        flexWrap: 'wrap',
        // color: COLORS.WHITE['100'],
        color: COLORS.BLACK['500'],
        // fontWeight: 'bold',
        textAlignVertical: 'center',
        textAlign: 'center',
        paddingLeft: 3,
        paddingRight: 3,
    },
    removeButtonWrap: {
        borderRadius: 15,
        backgroundColor: COLORS.RED['300'],
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -5,
        right: -12,
        paddingBottom: 5,
        paddingHorizontal: 2,
    },
    removeButton: {
        width: 15,
        height: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: COLORS.WHITE['100'],
        fontWeight: 'bold',
    },
    input: {
        // marginTop: 10,
    },
})
