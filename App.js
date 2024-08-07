import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Board from './components/board';
import IndexedLine from './components/IndexedLine';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const leftAndRightIndexes = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const topIndexes = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'V'];
  const bottomIndexes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const [gameStarted, setGameStarted] = useState(false);
  const [hasQueen, setHasQueen] = useState(Array.from({length: 8}, () => Array(8).fill(false)));
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveCounter, setMoveCoutner] = useState(0);
  const [isValidMove, setIsValidMove] = useState(true);
  const [queenPlaced, setQueenPlaced] = useState(0);
  const [gameStatus, setGameStatus] = useState('');

  // move one step forward
  function onSquareTapped(squareCoords) {
      let moves = hasQueen.map(row => [...row]);

      if(isValidMove && moves[squareCoords.x][squareCoords.y] !== true) {

        moves[squareCoords.x][squareCoords.y] = true;
      
        let currentHistory = [...moveHistory, squareCoords];

        setHasQueen(() => moves);
        setMoveHistory(() => currentHistory);
        setMoveCoutner(currentHistory.length - 1);
        setQueenPlaced(() => queenPlaced + 1);
        setIsValidMove(squareCoords);

        if(getPossibleMove(moves) === -1) {
          setGameStatus('Game Over!');
        } else {
          setGameStatus('Queen placed');
        }
        setIsValidMove(checkMoveValidity(squareCoords, moves));
      }
  }

  // move one step back
  function undo() {
    let moves = hasQueen.map(row => [...row]);

    if(queenPlaced === 0  ) {
      setGameStatus("No queen to remove!");
      return;
    }
    if(moveCounter >= 0) {
      setGameStatus('Queen removed');
      
      let currentMove = moveHistory[moveCounter]; // get the current move from the history

      let updatedHistory = moveHistory.slice(0, -1); // a new history array with the current move removed

      moves[currentMove.x][currentMove.y] = false; // set the current move's position as unoccupied

      // update 
      setHasQueen(() => moves);
      setMoveHistory(() => updatedHistory);
      setQueenPlaced(queenPlaced - 1);

      if(!isValidMove) {
        setIsValidMove(true);
      }
      setMoveCoutner(updatedHistory.length - 1);
    }
  }

  function hint() {
    let moves = hasQueen.map(row => [...row]);
    let possibleMove = getPossibleMove(moves);

    if(possibleMove !== -1) {
      onSquareTapped({x: possibleMove.x, y: possibleMove.y});
      setGameStatus('Used a hint!');
    } 
    else {
      setGameStatus('Game Over!');
    }
  }

  function quit() {
    setGameStarted(false);
    setIsValidMove(true);
    setQueenPlaced(0);
    setGameStatus('');
    setHasQueen(Array.from({length: 8}, () => Array(8).fill(false)));
  }

  function getPossibleMove(moves) {
    // when we place a queen a certain number of squares are eliminated
    // this table represent that number for each queen placed
    let eliminatedPositions = [ 
      [22, 22, 22, 22, 22, 22, 22, 22], 
      [22, 24, 24, 24, 24, 24, 24, 22],
      [22, 24, 26, 26, 26, 26, 25, 22],
      [22, 24, 26, 28, 28, 26, 24, 22],
      [22, 24, 26, 28, 28, 26, 24, 22],
      [22, 24, 26, 26, 26, 26, 25, 22], 
      [22, 24, 24, 24, 24, 24, 24, 22],
      [22, 22, 22, 22, 22, 22, 22, 22], 
    ];

    let lowestEliminatedPositionsValue = 28;
    let possibleMove = -1;

    for(let i = 0; i < moves[0].length; ++i) {
      for(let j = 0; j < moves[0].length; ++j) {
        if(checkMoveValidity({x: i, y: j}, moves) && !moves[i][j]) {
          if(eliminatedPositions[i][j] <= lowestEliminatedPositionsValue) {
            lowestEliminatedPositionsValue = eliminatedPositions[i][j];
            possibleMove = {x: i, y: j};
          }
        }
      }
    }
    return possibleMove;
  }

  function checkMoveValidity(moveCoords, board) {
    for(let i = 0; i < 8; ++i) {
      // if there is another queen in the same row or column
      if((board[i][moveCoords.y] === true && i !== moveCoords.x) ||
       (board[moveCoords.x][i] === true && i !== moveCoords.y)) { 
        return false; // not a valid move
      }
    }
    
    // if there is another queen in the same diagonal
    return checkDiagonals(moveCoords, board);
  }

  function checkDiagonals(moveCoords, board) {
    let startPoint;

      // check top-left diagonal
      startPoint = {...moveCoords};
      while(startPoint.x > 0 && startPoint.y > 0) {
        --startPoint.x;
        --startPoint.y;
  
        if(board[startPoint.x][startPoint.y]) {
          return false;
        }
      }

      // check top-right diagonal
      startPoint = {...moveCoords};
      while(startPoint.x < 7 && startPoint.y > 0) {
        ++startPoint.x;
        --startPoint.y;
        if(board[startPoint.x][startPoint.y]) {
          return false;
        }
      }

      // check bottom-right diagonal
      startPoint = {...moveCoords};
      while(startPoint.x < 7 && startPoint.y < 7) {
        ++startPoint.x;
        ++startPoint.y;
  
        if(board[startPoint.x][startPoint.y]) {
          return false;
        }
      }
      
      // check bottom-left diagonal  
      startPoint = {...moveCoords};
      while(startPoint.x > 0 && startPoint.y < 7) {
        --startPoint.x;
        ++startPoint.y;
  
        if(board[startPoint.x][startPoint.y]) {
          return false;
        }
      }

    return true;
  }


  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>Eight Queens Problem</Text>
        {isValidMove ? <Text style={{textAlign: 'center', marginBottom: 30, color: 'grey'}}>
          {queenPlaced} - Queens {queenPlaced === 8 ? <Text style={{color: 'green'}}>- YOU WON!</Text> : 
          <Text style={{color: gameStatus === 'Game Over!' ? 'red' : 'grey'}}>{` - ${gameStatus}`}</Text>}
        </Text> : <Text style={{textAlign: 'center', marginBottom: 30, color: 'red'}}>
          Your current position is not invalid.
        </Text>}
        <View style={styles.gameBoard}>
          <IndexedLine indexes={topIndexes} rotation={'180deg'}/>
          <View style={styles.middlePanel}>
            <IndexedLine indexes={leftAndRightIndexes} direction={'column'}/>
            <Board hasQueen={hasQueen} onSquareTapped={(gameStatus === 'Game Over!' || queenPlaced === 8) ? null : onSquareTapped}/>
            <IndexedLine indexes={leftAndRightIndexes} direction={'column'}  rotation={'180deg'}/>
          </View>
          <IndexedLine indexes={bottomIndexes}/>
        </View>
      </View>
      {!gameStarted && <View style={styles.topLayout}>
          <Pressable style={styles.button} onPress={() => {setGameStarted(true)}}>
            <Text style={styles.buttonText}>Start Game</Text>
          </Pressable>
      </View>}
      {gameStarted && <View style={[styles.gameplayButtonLayout, {backgroundColor: 'none'}]}>
          <View style={{flexDirection: 'row', gap: 10}}>
          <Pressable style={[styles.button, {width: 120}]} onPress={quit}>
              <Text style={[styles.buttonText, {fontSize: 18,}]}>Quit</Text>
          </Pressable>
          {<Pressable style={[styles.button, {width: 120}]} onPress={undo}>
            <Text style={[styles.buttonText, {fontSize: 18}]}>Undo</Text>
          </Pressable>}
          <Pressable style={[styles.button, {width: 120}]} onPress={hint}>
              <Text style={[styles.buttonText, {fontSize: 18,}]}>
              <FontAwesome name='lightbulb-o' size={15} color='#D3D3D3'/> Hint
              </Text>
            </Pressable> 
          </View>
      </View>}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 'auto',
    marginBottom: 30,
    fontSize: 18,
  },
  container: {
    marginTop: 50
  },
  gameBoard: {
    width: '98%',
    margin: 'auto',
    borderWidth: 1,
    padding: 2
  },
  middlePanel: {
    flexDirection: 'row',
    padding: 1,
    height: 383,
  },
  topLayout: {
    height: 900,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.8)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 120
  }, 
  gameplayButtonLayout: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 130,
  }
  ,
  button: {
    borderWidth: 1,
    borderColor: 'rgb(112, 200, 200)',
    width: 350,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(112, 128, 144)'
  },
  buttonText: {
    fontSize: 22,
    textAlign: 'center'
  }
});
