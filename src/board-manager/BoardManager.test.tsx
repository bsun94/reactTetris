import DefaultBoardManager, { BoardManager } from "./BoardManager";
import { TetrisBoard } from "../board-renderer/BoardRenderer";

jest.mock("../common/available_pieces", () => {
  const originalModule = jest.requireActual("../common/available_pieces");
  return {
    ...originalModule,
    getRandomPiece: jest.fn(),
  };
});
const availablePieces = require("../common/available_pieces");

describe("when initializing a turn", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    testBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
      ],
    };
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should not affect board state if init not run", () => {
    defaultBoardManager.accerlatedDrop();
    const unchangedBoard = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(unchangedBoard);
  });

  it("should allow operations to run their course after initialization", () => {
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceLeft();
    const postOpBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(postOpBoard);
  });
});

describe("when moving a piece to the left", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    testBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceLeft();
    const newBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceLeft();
    // Sqaure was already in this position before left shift
    const newBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});

describe("when moving a piece to the right", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    testBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceRight();
    const newBoard = [
      [false, false, true, true],
      [false, false, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [2, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceRight();
    // Sqaure was already in this position before right shift
    const newBoard = [
      [false, false, true, true],
      [false, false, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});

describe("when rotating a piece to the left", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    testBoard = {
      board: [
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateLeft();
    const newBoard = [
      [true, true, true, true],
      [true, false, false, true],
      [false, false, false, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateLeft();
    // Sqaure was already in this position before right shift
    const newBoard = [
      [false, true, false, true],
      [false, true, false, true],
      [false, true, true, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});

describe("when rotating a piece to the right", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    testBoard = {
      board: [
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateRight();
    const newBoard = [
      [false, false, true, true],
      [true, true, true, true],
      [false, false, false, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateRight();
    // Sqaure was already in this position before right shift
    const newBoard = [
      [false, true, false, true],
      [false, true, false, true],
      [false, true, true, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});
