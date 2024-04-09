import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Image} from 'expo-image';
import {getImageSize, wp} from "../helpers/common";
import {theme} from "../constants/theme";

const ImageCard = ({item, index, columns, router}) => {
    const isLastInRow = () => {
        return (index + 1) % columns === 0;
    }
    const getImageHeight = () => {
        let {imageHeight: height, imageWidth: width} = item;
        return {
            height: getImageSize(height, width)
        }
    }
    return (
        <Pressable
            style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}
            onPress={() => {
                router.push({
                    pathname: "home/image",
                    params: {...item}
                })
            }}
        >
            <Image
                style={[styles.image, getImageHeight()]}
                source={item?.webformatURL}
                transition={100}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {},
    image: {
        height: 300,
        width: "100%"
    },
    imageWrapper: {
        backgroundColor: theme.colors.grayBG,
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        overflow: 'hidden',
        marginBottom: wp(2)
    },
    spacing: {
        marginRight: wp(2)
    }
});

export default ImageCard;
