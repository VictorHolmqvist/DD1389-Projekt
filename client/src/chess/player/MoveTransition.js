
class MoveTransition {
  constructor(transitionBoard, moveStatus) {
    this.transitionBoard = transitionBoard;
    this.moveStatus = moveStatus;
  }

  isMoveOk() {
    return this.moveStatus;
  }

  getTransitionBoard() {
    return this.transitionBoard;
  }
}
