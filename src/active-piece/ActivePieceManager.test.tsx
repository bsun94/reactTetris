import ReactDOM, { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";

import DefaultActivePieceManager from "./ActivePieceManager";
import { Coordinates } from "src/common/available_pieces";

jest.mock("src/common/available_pieces", () => {
  const originalModule = jest.requireActual("src/common/available_pieces");
  return {
    ...originalModule,
    getRandomPiece: jest.fn(),
  };
});
const availablePieces = require("src/common/available_pieces");

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
  availablePieces.getRandomPiece.mockImplementation(
    () => availablePieces.SQUARE
  );

  beforeEach(() => {
    activePieceManager = new DefaultActivePieceManager(testBoard);
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
      const testAnchor: Coordinates = [0, 4];
      expect(() => activePieceManager.createNewPiece(testAnchor)).toThrowError(
        "Generated new piece is not in a valid state"
      );
    });

    it("should throw when new piece out of bounds", () => {
      const testAnchor: Coordinates = [0, 3];
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
      const testAnchor: Coordinates = [0, 2];
      expect(() => activePieceManager.createNewPiece(testAnchor)).toThrowError(
        "Generated new piece is not in a valid state"
      );
    });
  });
});

describe("when moving the active piece left", () => {
  it("should return the piece's new coords if move is valid", () => {});

  it("should return null if the move is invalid", () => {});

  it("should throw an error if an active piece does not exist", () => {});
});

describe("when moving the active piece right", () => {
  it("should return the piece's new coords if move is valid", () => {});

  it("should return null if the move is invalid", () => {});

  it("should throw an error if an active piece does not exist", () => {});
});

describe("when dropping the active piece by a tick", () => {
  it("should return the piece's new coords if move is valid", () => {});

  it("should return null if the move is invalid", () => {});

  it("should throw an error if an active piece does not exist", () => {});
});

describe("when dropping the active piece by an accerlerated tick", () => {
  it("should return the piece's new coords if move is valid", () => {});

  it("should return null if the move is invalid", () => {});

  it("should throw an error if an active piece does not exist", () => {});
});

describe("when rotating the active piece left", () => {
  it("should return the piece's new coords if move is valid", () => {});

  it("should return null if the move is invalid", () => {});

  it("should throw an error if an active piece does not exist", () => {});
});

describe("when rotating the active piece right", () => {
  it("should return the piece's new coords if move is valid", () => {});

  it("should return null if the move is invalid", () => {});

  it("should throw an error if an active piece does not exist", () => {});
});
