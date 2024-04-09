import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export const theme = {
    colors: {
        white: "#ffffff",
        black: "#000000",
        grayBG: "#e5e5e5",
        neutral: (opacity) => `rgba(10,10,10, ${opacity})`,
    },
    fontWeights: {
        medium: "500",
        semiBold: "600",
        bold: "700",
    },
    radius: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18
    }
}