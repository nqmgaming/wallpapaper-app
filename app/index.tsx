import {StyleSheet, Text, View, Image, Pressable} from "react-native";
import React from "react";
import {StatusBar} from "expo-status-bar";
import {wp, hp} from "@/helpers/common";
import {LinearGradient} from "expo-linear-gradient";
import Animated, {FadeInDown} from "react-native-reanimated";
import {theme} from "@/constants/theme";
import {useRouter} from "expo-router";

const WelcomeScreen = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <StatusBar style="light"/>

            {/* linear gradient */}
            <Animated.View entering={FadeInDown.duration(600)} style={{
                flex: 1, justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <View>
                    <Image
                        source={require("../assets/images/welcome.png")}
                        resizeMode="cover"
                    />
                </View>
                <LinearGradient
                    colors={[
                        `rgba(255, 255, 255, 0)`,
                        `rgba(255, 255, 255, 0.5)`,
                        "white",
                        "white",
                    ]}
                    style={styles.gradient}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 0.8}}
                />
                {/*    content */}
                <View style={styles.contentContainer}>
                    <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>
                        Pixels
                    </Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.punchline}>
                        Every pixel tells a story
                    </Animated.Text>
                    <Animated.View entering={FadeInDown.delay(600).springify()}>
                        <Pressable style={styles.startButton} onPress={() => {
                            router.push("./home")
                        }}>
                            <Text style={styles.startText}>
                                Start Explore
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Animated.View>

        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    bgImage: {
        width: wp(100),
        height: hp(100),
        position: "absolute",
    },
    gradient: {
        width: wp(100),
        height: hp(65),
        bottom: 0,
        position: "absolute",
    },
    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        position: "absolute",
        bottom: hp(10),
    },
    title: {
        fontSize: hp(7),
        color: theme.colors.neutral(0.9),
        fontWeight: theme.fontWeights.bold,
    },
    punchline: {
        fontSize: hp(2),
        letterSpacing: 1,
        marginBottom: 10,
        fontWeight: theme.fontWeights.medium
    },
    startButton: {
        marginBottom: 50,
        backgroundColor: theme.colors.neutral(0.9),
        padding: 15,
        paddingHorizontal: 90,
        borderRadius: theme.radius.xl,
        borderCurve: "continuous"
    },
    startText: {
        color: theme.colors.white,
        fontSize: hp(3),
        fontWeight: theme.fontWeights.medium,
        letterSpacing: 1,
    }
});
