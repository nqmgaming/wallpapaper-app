import {Dimensions} from "react-native"

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export const wp = percentages => {
    const witdth = deviceWidth;
    return (percentages * witdth) / 100;
}

export const hp = percentages => {
    const height = deviceHeight;
    return (percentages * height) / 100;
}

export const getColumnCount = () => {
    if (deviceWidth >= 1024) {
        // desktop
        return 4;
    } else if (deviceWidth >= 768) {
        // table
        return 3;
    } else {
        //phone
        return 2;
    }
}

export const getImageSize = (height, width) => {
    if (width>height) {
        // landscape
        return 250;
    }else if (width>height) {
        // portrait
        return 300;
    }else {
        // square
        return 200;
    }
}
