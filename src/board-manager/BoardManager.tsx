import DefaultActivePieceManager, {
  ActivePiece,
  ActivePieceManager,
} from "../active-piece/ActivePieceManager";
import { TetrisBoard } from "../board-renderer/BoardRenderer";
import { Coordinates } from "../common/available_pieces";

/**
 * The shape of a component that manages various aspects of a tetris game board.
 */
export interface BoardManager {
  /**
   * Spawns a new Tetris piece for the user to control.
   *
   * This should be called at the beginning of EVERY turn.
   */
  initTurn: () => void;

  movePieceLeft: () => void;

  movePieceRight: () => void;

  accerlatedDrop: () => void;

  rotateLeft: () => void;

  rotateRight: () => void;

  tickDrop: () => void;
}

/** Default implementation of a manager for the Tetris board. */
export default class DefaultBoardManager implements BoardManager {
  private readonly pieceManager: ActivePieceManager;
  private readonly board: TetrisBoard;
  private readonly newPieceSpawnPoint: Coordinates;
  private linesRemovedFromBoardInternal = 0;

  /** Blocks operations on active piece during turn init/transitions. */
  private pausePieceOperations = true;

  public get linesRemovedFromBoard() {
    return this.linesRemovedFromBoardInternal;
  }

  constructor(
    board: TetrisBoard,
    newPieceSpawnPoint: Coordinates,
    pieceManager?: ActivePieceManager
  ) {
    this.pieceManager = pieceManager ?? new DefaultActivePieceManager(board);
    this.board = board;
    this.newPieceSpawnPoint = newPieceSpawnPoint;
  }

  initTurn() {
    const newPiece = this.pieceManager.createNewPiece(this.newPieceSpawnPoint);
    this.drawOrErasePiece(newPiece);
    this.pausePieceOperations = false;
  }

  movePieceLeft() {
    const action = () => this.pieceManager.moveLeft();
    this.updateActivePieceOnBoardAfterAction(action, false);
  }

  movePieceRight() {
    const action = () => this.pieceManager.moveRight();
    this.updateActivePieceOnBoardAfterAction(action, false);
  }

  accerlatedDrop() {
    const action = () => this.pieceManager.acceleratedDrop();
    this.updateActivePieceOnBoardAfterAction(action, true);
  }

  tickDrop() {
    const action = () => this.pieceManager.tickDrop();
    this.updateActivePieceOnBoardAfterAction(action, true);
  }

  rotateLeft() {
    const action = () => this.pieceManager.rotateLeft();
    this.updateActivePieceOnBoardAfterAction(action, false);
  }

  rotateRight() {
    const action = () => this.pieceManager.rotateRight();
    this.updateActivePieceOnBoardAfterAction(action, false);
  }

  private updateActivePieceOnBoardAfterAction(
    updateBoardFn: () => ActivePiece | null,
    updateTurnAfterAction: boolean
  ) {
    if (!this.pausePieceOperations) {
      const oldPiece = this.pieceManager.currentlyActivePiece;
      // TODO: consider whether or not having a "shadow" board would be better than this repainting
      // in case of invalid move - original intent.
      this.drawOrErasePiece(oldPiece, true);
      const newPiece = updateBoardFn();
      if (!!newPiece) {
        this.drawOrErasePiece(newPiece);
      } else {
        this.drawOrErasePiece(oldPiece);
        if (updateTurnAfterAction) this.updateTurn();
      }
    }
  }

  private drawOrErasePiece(piece: ActivePiece, eraseMode: boolean = false) {
    const { anchorPoint, pieceBody } = piece;
    const [prevAnchorX, prevAnchorY] = anchorPoint;
    for (const [x, y] of pieceBody) {
      const finalX = prevAnchorX + x;
      const finalY = prevAnchorY + y;
      this.board.board[finalY][finalX] = !eraseMode;
    }
  }

  private updateTurn() {
    this.pausePieceOperations = true;
    for (let i = 0; i < this.board.board.length; i++) {
      const isCompleteRow = this.board.board[i].every((val) => val !== false);
      if (isCompleteRow) {
        const [removedArr] = this.board.board.splice(i, 1);
        const removedArrLen = removedArr.length;
        this.linesRemovedFromBoardInternal++;
        this.board.board.unshift(Array(removedArrLen).fill(false));
        this.initTurn();
      }
    }
  }
}
