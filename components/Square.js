import { useState } from "react";
import {ImageBackground, StyleSheet, View } from "react-native";
import { Pressable } from "react-native";

const queenImg = require('../assets/queen.png');

export default function Square({bgColor, coords, onTap, hasQueen}) {
    return (
        <Pressable onPress={() => {onTap && onTap(coords)}}>
            <View style={[styles.container, bgColor && {backgroundColor: bgColor}]} >
                {hasQueen && <ImageBackground source={queenImg} style={styles.img}>
                </ImageBackground>}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        height: 47,
        width: 47,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey'
    },
    img: {
        height: 30,
        width: 30,
    }
});