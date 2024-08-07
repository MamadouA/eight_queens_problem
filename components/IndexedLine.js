import { View, Text, StyleSheet } from "react-native";

export default function IndexedLine({indexes, direction, rotation}) {
    return (
        <View style={[styles.indexContainer, direction && {flexDirection: direction},
             rotation && {transform: [{rotate: rotation}]}]}>
            {(Array.isArray(indexes)) && indexes.map((item, index) => (
                <Text style={styles.text} key={index}>{item}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    indexContainer: {
        flexDirection: 'row',
        gap: 38,
        margin: 'auto',
    },
    text: {
        fontSize: 8
    }
});

