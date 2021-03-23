
class MoveFactory {}

MoveFactory.createMove = (board, currentCoordinate, destinationCoordinate) => {
  for (const move of board.getAllLegalMoves()) {
    if (move.getCurrentCoordinate() === currentCoordinate
            && move.getDestinationCoordinate() === destinationCoordinate) {
      return move;
    }
  }

  console.log('NO MOVE');
  return null;
};
