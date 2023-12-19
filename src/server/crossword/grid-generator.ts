import { freeformSampleCanon } from "@/dataset/sample-puzzles";
import dictionary from "@/dataset";
import type { Cell, Grid, WordsWithMetadata, Rules } from "@/lib/types";
export class CrosswordGrid {
  _grid: Grid;

  constructor(
    public _rows: number,
    public _cols: number,
    public _rules: Rules,
  ) {
    this._grid = this.emptyGrid();
    this.writeGrid();
  }

  get grid() {
    return this._grid;
  }

  get rules() {
    return this._rules;
  }

  private emptyGrid() {
    return Array.from({ length: this._rows }, () =>
      Array<Cell>(this._cols).fill(null),
    );
  }

  private writeGrid() {
    // const grid = this._grid;
    this._grid = freeformSampleCanon;
  }

  private getNumbersInRange(start: number, end: number) {
    return Array.from({ length: end - start }, (_, index) => start + index);
  }

  /**
   * @returns {("across" | "down")[] | false} If the cell starts a word in either direction,
   * returns an array indicating the word's 'directions'.
   * If the cell is does not start a word, returns false.
   */
  private getWordDirectionsFromStarter(rowIdx: number, colIdx: number) {
    const grid = this._grid;
    const cellAbove = grid[rowIdx - 1]?.[colIdx];
    const cellBelow = grid[rowIdx + 1]?.[colIdx];
    const cellToLeft = grid[rowIdx]?.[colIdx - 1];
    const cellToRight = grid[rowIdx]?.[colIdx + 1];
    const direction: ("across" | "down")[] = [];

    if (!cellAbove && cellBelow) direction.push("down");
    if (!cellToLeft && cellToRight) direction.push("across");
    return direction.length > 0 ? direction : false;
  }

  private getAcrossWord(grid: Grid, rowIdx: number, startColIdx: number) {
    const row = grid[rowIdx];

    if (!row) throw new Error("Can't get Across word. Row does not exist.");

    const endColIdx = row.indexOf(null, startColIdx);
    const word = row
      .slice(startColIdx, endColIdx !== -1 ? endColIdx : undefined)
      .join("");
    const cols = this.getNumbersInRange(
      startColIdx,
      endColIdx !== -1 ? endColIdx : row.length,
    );

    return {
      word,
      row: rowIdx,
      cols,
    };
  }

  private getDownWord(grid: Grid, colIdx: number, startRowIdx: number) {
    const col = grid.map((row) => row[colIdx]);

    if (!col) throw new Error("Can't get Down word. Col does not exist.");

    const endRowIdx = col.indexOf(null, startRowIdx);
    const word = col
      .slice(startRowIdx, endRowIdx !== -1 ? endRowIdx : undefined)
      .join("");
    const rows = this.getNumbersInRange(
      startRowIdx,
      endRowIdx !== -1 ? endRowIdx : col.length,
    );

    return {
      word,
      col: colIdx,
      rows,
    };
  }

  // O(n * m) time => n = number of rows, m = number of columns
  protected getWords() {
    const grid = this._grid;
    const words: WordsWithMetadata = { across: [], down: [] };
    let number = 1;

    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      const row = grid[rowIdx];

      if (row) {
        for (let colIdx = 0; colIdx < row.length; colIdx++) {
          // Don't consider shaded cells.
          if (!row[colIdx]) continue;

          const directions = this.getWordDirectionsFromStarter(rowIdx, colIdx);

          // Current cell starts a word.
          if (directions) {
            directions.forEach((direction) => {
              if (direction === "across") {
                const word = this.getAcrossWord(grid, rowIdx, colIdx);
                words.across.push({ ...word, number });
              } else if (direction === "down") {
                const word = this.getDownWord(grid, colIdx, rowIdx);
                words.down.push({ ...word, number });
              }
            });

            number++;
          }
        }
      }
    }
    return words;
  }
}
