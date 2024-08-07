import { useState } from "react";
import { View, StyleSheet } from "react-native";
import Square from "./Square";


export default function Board({hasQueen, onSquareTapped}) {
    return (
        <View style={styles.container}>
            {hasQueen.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.bordRow}>
                    {row.map((item, colIndex) => {
                        let bgEvenSquare;
                        let bgOddSquare;
                       
                        if(rowIndex % 2 !== 0 ) {
                            bgEvenSquare = 'grey'
                            bgOddSquare = 'white'
                        } else {
                            bgEvenSquare = 'white';
                            bgOddSquare = 'grey';
                        }
                        return (
                            <Square key={`${rowIndex}-${colIndex}`} coords={{x: rowIndex, y: colIndex}}
                                onTap={onSquareTapped} hasQueen={hasQueen[rowIndex][colIndex]}
                                bgColor={(colIndex % 2 === 0) ? bgEvenSquare : bgOddSquare} />
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderWidth: 1,
        height: 378,
        width: 378,
        margin: 'auto'
    },
    bordRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: 'red',
    },
  });