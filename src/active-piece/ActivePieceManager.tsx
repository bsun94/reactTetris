import {
  Coordinates,
  getRandomPiece,
  TetrisPiece,
} from "../common/available_pieces";
import { TetrisBoard } from "../board-renderer/BoardRenderer";

/**
 * A component that provides services in managing the tetris piece the user is currently in control
 * of.
 */
export interface ActivePieceManager {
  currentlyActivePiece: ActivePiece;

  /** Creates the new Tetris piece that the piece manager will now work with. */
  createNewPiece: (anchorPoint: Coordinates) => ActivePiece;

  /** Returns null to indicate that the rotation is an illegal move. */
  rotateLeft: () => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  rotateRight: () => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  flipHorizontally: () => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  moveLeft: () => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  moveRight: () => ActivePiece | null;

  /**
   * Represents a normal one-tick drop of a piece in the board. A null returned
   * represents the end of the current piece's lifespan.
   */
  tickDrop: () => ActivePiece | null;
}

/**
 * Object representing the tetris piece the user is currently controlling.
 */
export interface ActivePiece extends TetrisPiece {
  /**
   * Coords of the anchor point of Tetris piece. This is always the top-left
   * corner of the piece's bounding box in this app within the Tetris board.
   */
  anchorPoint: Coordinates;
}

interface PieceBoundingBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Component that provides support in managing the active piece falling down on
 * the board.
 */
export default class DefaultActivePieceManager implements ActivePieceManager {
  private currentlyActivePieceInternal?: ActivePiece;
  private readonly board: TetrisBoard;

  public get currentlyActivePiece(): ActivePiece {
    if (!this.currentlyActivePieceInternal) {
      throw new Error("Active piece has not yet been set!");
    }
    return this.currentlyActivePieceInternal;
  }

  constructor(board: TetrisBoard) {
    this.board = board;
  }

  createNewPiece(anchorPoint: Coordinates): ActivePiece {
    const { pieceBody } = getRandomPiece();
    const potentialNewPiece = { anchorPoint, pieceBody };
    const isNewPieceValid = this.isPieceinAllowedState(potentialNewPiece);
    if (!isNewPieceValid) {
      throw new Error("Generated new piece is not in a valid state");
    }
    this.currentlyActivePieceInternal = potentialNewPiece;
    return this.currentlyActivePiece;
  }

  moveLeft(): ActivePiece | null {
    const { anchorPoint, pieceBody } = this.currentlyActivePiece;
    const [x, y] = anchorPoint;
    const newAnchor: [number, number] = [x - 1, y];
    const potentialNewPiece = { anchorPoint: newAnchor, pieceBody };
    return this.returnPieceIfAllowed(potentialNewPiece);
  }

  moveRight(): ActivePiece | null {
    const { anchorPoint, pieceBody } = this.currentlyActivePiece;
    const [x, y] = anchorPoint;
    const newAnchor: [number, number] = [x + 1, y];
    const potentialNewPiece = { anchorPoint: newAnchor, pieceBody };
    return this.returnPieceIfAllowed(potentialNewPiece);
  }

  tickDrop(): ActivePiece | null {
    const { anchorPoint, pieceBody } = this.currentlyActivePiece;
    const [x, y] = anchorPoint;
    const newAnchor: [number, number] = [x, y + 1];
    const potentialNewPiece = { anchorPoint: newAnchor, pieceBody };
    return this.returnPieceIfAllowed(potentialNewPiece);
  }

  rotateLeft(): ActivePiece | null {
    const { anchorPoint, pieceBody } = this.currentlyActivePiece;
    const transformedBodyBlocks = this.normalizeRelativeCoords(
      this.invertCoords(this.reflectAlongXAxis(pieceBody))
    );
    const potentialNewPiece = { anchorPoint, pieceBody: transformedBodyBlocks };
    return this.returnPieceIfAllowed(potentialNewPiece);
  }

  rotateRight(): ActivePiece | null {
    const { anchorPoint, pieceBody } = this.currentlyActivePiece;
    const transformedBodyBlocks = this.normalizeRelativeCoords(
      this.reflectAlongXAxis(this.invertCoords(pieceBody))
    );
    const potentialNewPiece = { anchorPoint, pieceBody: transformedBodyBlocks };
    return this.returnPieceIfAllowed(potentialNewPiece);
  }

  flipHorizontally(): ActivePiece | null {
    const { anchorPoint, pieceBody } = this.currentlyActivePiece;
    const transformedBodyBlocks = this.normalizeRelativeCoords(
      this.reflectAlongYAxis(pieceBody)
    );
    const potentialNewPiece = { anchorPoint, pieceBody: transformedBodyBlocks };
    return this.returnPieceIfAllowed(potentialNewPiece);
  }

  private returnPieceIfAllowed(piece: ActivePiece): ActivePiece | null {
    const isPieceAllowed = this.isPieceinAllowedState(piece);
    if (isPieceAllowed) {
      this.currentlyActivePieceInternal = piece;
      return this.currentlyActivePiece;
    }
    return null;
  }

  private isPieceinAllowedState(piece: ActivePiece): boolean {
    const withinBoard = this.isPieceWithinBoardBounds(piece);
    if (!withinBoard) return false;
    const collidesWithExistingParticles =
      this.doesPieceCollideWithExistingParticles(piece);
    if (collidesWithExistingParticles) return false;
    return true;
  }

  private isPieceWithinBoardBounds(piece: ActivePiece): boolean {
    const pieceBounds = this.getBoundingBoxForPiece(piece);
    const boardRightBound = this.board.board[0].length;
    const boardBottomBound = this.board.board.length;
    if (
      pieceBounds.left < 0 ||
      pieceBounds.right >= boardRightBound ||
      pieceBounds.bottom >= boardBottomBound
    ) {
      return false;
    }
    return true;
  }

  private getBoundingBoxForPiece(piece: ActivePiece): PieceBoundingBox {
    const { anchorPoint, pieceBody } = piece;
    const [anchorX, anchorY] = anchorPoint;
    let top = 0,
      bottom = 0,
      left = 0,
      right = 0;
    for (const [x, y] of pieceBody) {
      if (x < 0) {
        throw new Error(
          `Relative coord found in current active piece's body with a component block that is left of the anchor point! Block coords x=${x}, y=${y} (x should never be negative)`
        );
      }
      if (y < 0) {
        throw new Error(
          `Relative coord found in current active piece's body with a component block that is higher than the anchor point! Block coords x=${x}, y=${y} (y should never be smaller than 0)`
        );
      }

      top = Math.min(y, top);
      bottom = Math.max(y, bottom);
      left = Math.min(x, left);
      right = Math.max(x, right);
    }

    return {
      top: top + anchorY,
      bottom: bottom + anchorY,
      left: left + anchorX,
      right: right + anchorX,
    };
  }

  private doesPieceCollideWithExistingParticles(piece: ActivePiece): boolean {
    const { anchorPoint, pieceBody } = piece;
    const [anchorX, anchorY] = anchorPoint;
    for (const [blockX, blockY] of pieceBody) {
      const finalX = anchorX + blockX;
      const finalY = anchorY + blockY;
      if (this.board.board[finalY][finalX]) {
        return true;
      }
    }
    return false;
  }

  // TODO: is it more user-friendly to just normalize the coords in each of the functions?
  // Normalized the returned coords from this!
  private invertCoords(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    return coords.map(([x, y]) => [y, x]);
  }

  // Normalized the returned coords from this!
  private reflectAlongXAxis(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    return coords.map(([x, y]) => [x, -y]);
  }

  // Normalized the returned coords from this!
  private reflectAlongYAxis(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    return coords.map(([x, y]) => [-x, y]);
  }

  /**
   * Helps transform raw coords immediately after an inversion or reflection into
   * relative coords from the new top-left corner of the transformed piece
   * designated as [0, 0].
   */
  private normalizeRelativeCoords(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    let minX = Infinity,
      minY = Infinity;
    // Find new top-left corner
    for (const [x, y] of coords) {
      minX = Math.min(x, minX);
      minY = Math.min(y, minY);
    }
    // Return all coords as relative to new top-left corner.
    return coords.map(([x, y]) => [x - minX, y - minY]);
  }
}
