import CoreGraphics
import Testing

@testable import TimeCardScannerCore

private func row(_ texts: [String], y: CGFloat, height: CGFloat = 160, columns: Int = 4) -> AppleRow {
    let xs: [CGFloat] = [100, 250, 450, 650, 800, 950, 1100]
    let cells = (0..<columns).map { CGRect(x: xs[$0], y: y, width: xs[$0 + 1] - xs[$0], height: height) }
    return AppleRow(texts: texts, cells: cells)
}

struct CleanupFlagTests {
    /// Used to vanish without a trace; now the host is told.
    @Test func aRowWithTooFewCellsIsDroppedAndFlagged() {
        let (rows, flags) = AppleTableCleanup.clean([
            row(["1", "14", "", ""], y: 0),
            row(["2", "16", ""], y: 160, columns: 3),
            row(["3", "18", "", ""], y: 320),
        ])
        // The hole it leaves is refilled with a blank row, so row 3 stays third.
        #expect(rows.map { $0.texts[0] } == ["14", "", "18"])
        #expect(flags.filter { $0.kind == .malformedRow }.count == 1)
        #expect(flags.contains { $0.kind == .insertedGapRows })
    }

    /// Writing across a divider can make Apple split a cell: values shift.
    @Test func aRowWithExtraCellsKeepsThreeValuesAndIsFlagged() {
        let (rows, flags) = AppleTableCleanup.clean([
            row(["1", "14", "", ""], y: 0),
            row(["2", "1", "6", "", ""], y: 160, columns: 5),
        ])
        #expect(rows.count == 2)
        #expect(rows[1].texts == ["1", "6", ""])
        let flag = flags.first { $0.kind == .extraColumns }
        #expect(flag?.row == 1)
    }

    /// The blank rows fill the gap instead of copying the row below them.
    @Test func insertedRowsAreSpreadAcrossTheGap() {
        // rows at y 0..160 and 320..480: one 160 px row is missing at y 160.
        let (rows, _) = AppleTableCleanup.clean([
            row(["1", "14", "", ""], y: 0),
            row(["3", "21", "", ""], y: 320),
        ])
        #expect(rows.count == 3)
        #expect(rows[1].sourceIndex == nil)
        #expect(rows[1].cells.allSatisfy { $0.minY == 160 && $0.height == 160 })
        #expect(rows[1].cells.map(\.minX) == rows[2].cells.map(\.minX))
    }

    @Test func gapRowFlagPointsAtTheFirstInsertedRow() {
        let (_, flags) = AppleTableCleanup.clean([
            row(["1", "14", "", ""], y: 0),
            row(["3", "21", "", ""], y: 320),
        ])
        #expect(flags.first { $0.kind == .insertedGapRows }?.row == 1)
    }

    /// A sliver flag can't point at a row index that later insertions invalidate.
    @Test func sliverFlagIsTableLevel() {
        let (_, flags) = AppleTableCleanup.clean([
            row(["1", "14", "", ""], y: 0),
            row(["", "", "", ""], y: 160, height: 20),
            row(["2", "16", "", ""], y: 180),
        ])
        #expect(flags.first { $0.kind == .droppedSliverRow }?.row == nil)
    }
}

struct CheckpointCheckTests {
    @Test func agreeingNumeralsAndMissingOnesRaiseNothing() {
        #expect(CheckpointCheck.flags(for: [1, nil, 3, 4]).isEmpty)
    }

    @Test func aDisagreeingNumeralIsFlaggedAtItsRow() {
        let flags = CheckpointCheck.flags(for: [1, 2, 4, 5])
        #expect(flags.map(\.row) == [2, 3])
        #expect(flags.allSatisfy { $0.kind == .checkpointMismatch })
    }
}

struct CharsetTests {
    @Test func mapsLookAlikesAndKeepsColons() {
        #expect(Charset.normalize("|S:2l") == (text: "15:21", changed: true))
        #expect(Charset.normalize(":05") == (text: ":05", changed: false))
        #expect(Charset.normalize("4:21") == (text: "4:21", changed: false))
    }

    @Test func dropsWhitespaceAndUnmappableCharacters() {
        #expect(Charset.normalize("1 4").text == "14")
        #expect(Charset.normalize("1~4").text == "14")
    }
}
