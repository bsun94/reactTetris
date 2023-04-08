import DefaultActivePieceManager from "./ActivePieceManager";
import { Coordinates } from "../common/available_pieces";

jest.mock("../common/available_pieces", () => {
  const originalModule = jest.requireActual("../common/available_pieces");
  return {
    ...originalModule,
    getRandomPiece: jest.fn(),
  };
});
const availablePieces = require("../common/available_pieces");

// TODO: try using a debugger for errors here
describe("when creating a new piece", () => {
  let activePieceManager: DefaultActivePieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultActivePieceManager(testBoard);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should be able to create with a given anchor point", () => {
    const testAnchor: Coordinates = [0, 1];
    const newPiece = activePieceManager.createNewPiece(testAnchor);
    const expectedPiece = {
      anchorPoint: testAnchor,
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    };
    expect(newPiece).toEqual(expectedPiece);
  });

  describe("when the resultant new piece is invalid", () => {
    it("should throw when caused by an invalid anchor", () => {
      const testAnchor: Coordinates = [4, 0];
      expect(() => activePieceManager.createNewPiece(testAnchor)).toThrowError(
        "Generated new piece is not in a valid state"
      );
    });

    it("should throw when new piece out of bounds", () => {
      const testAnchor: Coordinates = [3, 0];
      expect(() => activePieceManager.createNewPiece(testAnchor)).toThrowError(
        "Generated new piece is not in a valid state"
      );
    });

    it("should throw when new piece collides with existed pieces", () => {
      const newTestBoard = {
        board: [
          [false, false, false, true],
          [false, false, false, true],
          [false, false, false, true],
          [false, false, false, true],
        ],
      };
      activePieceManager = new DefaultActivePieceManager(newTestBoard);
      const testAnchor: Coordinates = [2, 0];
      expect(() => activePieceManager.createNewPiece(testAnchor)).toThrowError(
        "Generated new piece is not in a valid state"
      );
    });
  });
});

describe("when moving the active piece left", () => {
  let activePieceManager: DefaultActivePieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultActivePieceManager(testBoard);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveLeft();
    expect(movedPiece).toEqual({
      anchorPoint: [0, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const starterPiece = activePieceManager.createNewPiece([0, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [0, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveLeft();
    expect(movedPiece).toEqual(null);
  });

  it("should throw an error if an active piece does not exist", () => {
    // Do not init a starting piece
    expect(() => activePieceManager.moveLeft()).toThrowError(
      "Active piece has not yet been set!"
    );
  });
});

describe("when moving the active piece right", () => {
  let activePieceManager: DefaultActivePieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultActivePieceManager(testBoard);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveRight();
    expect(movedPiece).toEqual({
      anchorPoint: [2, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const starterPiece = activePieceManager.createNewPiece([2, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [2, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveRight();
    expect(movedPiece).toEqual(null);
  });

  it("should throw an error if an active piece does not exist", () => {
    // Do not init a starting piece
    expect(() => activePieceManager.moveRight()).toThrowError(
      "Active piece has not yet been set!"
    );
  });
});

describe("when dropping the active piece by a tick", () => {
  let activePieceManager: DefaultActivePieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultActivePieceManager(testBoard);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.tickDrop();
    expect(movedPiece).toEqual({
      anchorPoint: [1, 1],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const modifiedTestBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
      ],
    };
    activePieceManager = new DefaultActivePieceManager(modifiedTestBoard);
    const starterPiece = activePieceManager.createNewPiece([1, 1]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 1],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.tickDrop();
    expect(movedPiece).toEqual(null);
  });

  it("should throw an error if an active piece does not exist", () => {
    // Do not init a starting piece
    expect(() => activePieceManager.tickDrop()).toThrowError(
      "Active piece has not yet been set!"
    );
  });
});

describe("when dropping the active piece by an accerlerated tick", () => {
  let activePieceManager: DefaultActivePieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultActivePieceManager(testBoard);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.acceleratedDrop();
    expect(movedPiece).toEqual({
      anchorPoint: [1, 5],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 3]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 3],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.acceleratedDrop();
    expect(movedPiece).toEqual(null);
  });

  it("should throw an error if an active piece does not exist", () => {
    // Do not init a starting piece
    expect(() => activePieceManager.acceleratedDrop()).toThrowError(
      "Active piece has not yet been set!"
    );
  });
});

describe("when rotating the active piece left", () => {
  let activePieceManager: DefaultActivePieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    activePieceManager = new DefaultActivePieceManager(testBoard);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateLeft();
    expect(movedPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [2, 0],
        [1, 0],
        [0, 0],
        [0, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const starterPiece = activePieceManager.createNewPiece([2, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [2, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateLeft();
    expect(movedPiece).toEqual(null);
  });

  it("should throw an error if an active piece does not exist", () => {
    // Do not init a starting piece
    expect(() => activePieceManager.rotateLeft()).toThrowError(
      "Active piece has not yet been set!"
    );
  });
});

describe("when rotating the active piece right", () => {
  let activePieceManager: DefaultActivePieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    activePieceManager = new DefaultActivePieceManager(testBoard);
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateRight();
    expect(movedPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 0],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const modifiedTestBoard = {
      board: [
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
    const activePieceManager = new DefaultActivePieceManager(modifiedTestBoard);
    const starterPiece = activePieceManager.createNewPiece([1, 0]);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateRight();
    expect(movedPiece).toEqual(null);
  });

  it("should throw an error if an active piece does not exist", () => {
    // Do not init a starting piece
    expect(() => activePieceManager.rotateRight()).toThrowError(
      "Active piece has not yet been set!"
    );
  });
});
