import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {BlurView} from "expo-blur";
import Animated, {Extrapolation, FadeInDown, interpolate, useAnimatedStyle} from "react-native-reanimated";
import {capitalize, hp} from "../helpers/common";
import {theme} from "../constants/theme";
import SectionView, {ColorFilter, CommonOrderView} from "./filerView";
import {data} from "../constants/data";

const FiltersModal = ({
                          modalRef,
                          onClose,
                          onApply,
                          onReset,
                          filters,
                          setFilters
                      }) => {
    const snapPoints = useMemo(() => ['75%'], []);
    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackrop}
        >
            <BottomSheetView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.filterText}>Filters</Text>
                    {
                        Object.keys(sections).map((sectionName, index) => {
                            let sectionView = sections[sectionName];
                            let sectionData = data.filters[sectionName];
                            let title = capitalize(sectionName)
                            return (
                                <Animated.View entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
                                               key={sectionName}>
                                    <SectionView
                                        title={title}
                                        content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilters,
                                            filterName: sectionName
                                        })}/>
                                </Animated.View>
                            )
                        })
                    }
                    <Animated.View entering={FadeInDown.delay(500).springify().damping(11)}
                        style={styles.buttons}>
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={[styles.buttonText, {color: theme.colors.neutral(0.9)}]}>
                                Reset
                            </Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={onApply}>
                            <Text style={[styles.buttonText, {color: theme.colors.white}]}>
                                Apply
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>

            </BottomSheetView>
        </BottomSheetModal>
    );
};

const CustomBackrop = ({animatedIndex, style}) => {
    const animatedContainerStyle = useAnimatedStyle(() => {
        let opacity = interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolation.CLAMP
        )
        return {
            opacity
        }
    })
    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        style.overlay,
        animatedContainerStyle
    ]
    return (
        <Animated.View style={containerStyle}>
            <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25}/>
        </Animated.View>
    )

}

const sections = {
    "order": (props) => <CommonOrderView {...props}/>,
    "orientation": (props) => <CommonOrderView {...props}/>,
    "type": (props) => <CommonOrderView {...props}/>,
    "colors": (props) => <ColorFilter {...props}/>
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    content: {
        flex: 1,
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "100%",

    },
    filterText: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semiBold,
        color: theme.colors.neutral(0.8),
        marginBottom: 5
    },
    buttons: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.03),
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        borderWidth: 2,
        borderColor: theme.colors.grayBG

    },
    applyButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.8),
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md
    },
    buttonText: {
        fontSize: hp(2.2)
    }

});

export default FiltersModal;
