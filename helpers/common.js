import { Dimensions } from "react-native"

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('windows');

export const wp = percentages => {
    const witdth = deviceWidth;
    return (percentages * witdth) / 100;
}

export const hp = percentages => {
    const height = deviceHeight;
    return (percentages * height) / 100;
}