import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MasonryFlashList} from "@shopify/flash-list";
import ImageCard from "./imageCard";
import {getColumnCount, wp} from "../helpers/common";

const ImageGrid = ({images}) => {
    const columns = getColumnCount();
    return (
        <View style={styles.container}>
            <MasonryFlashList
                renderItem={({item, index}) => <ImageCard item={item} index={index} columns={columns}/>}
                data={images}
                numColumns={columns}
                initialNumToRender={1000}
                estimatedItemSize={200}
                contentContainerStyle={styles.listContainerStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 3,
        width: wp(100)
    },
    listContainerStyle: {
        paddingHorizontal: wp(4)
    }
});

export default ImageGrid;
