import CoreGraphics
import Testing

@testable import TimeCardScannerCore

/// Rows are laid out like Apple's grid: columns at x 100/250/450/650/800,
/// rows contiguous from `y`, each `height` tall.
private func row(_ texts: [String], y: CGFloat, height: CGFloat = 160) -> AppleRow {
    let xs: [CGFloat] = [100, 250, 450, 650, 800]
    let cells = (0..<4).map { CGRect(x: xs[$0], y: y, width: xs[$0 + 1] - xs[$0], height: height) }
    return AppleRow(texts: texts, cells: cells)
}

private let caption = row(["CK.", "TIME ARRIVED", "TIME DUE", "POINTS LOST"], y: 0, height: 140)

struct AppleTableCleanupTests {
    @Test func dropsTheCaptionRow() {
        let (rows, _) = AppleTableCleanup.clean([caption, row(["1", "14", "", ""], y: 140)])
        #expect(rows.count == 1)
        #expect(rows[0].texts == ["14", "", ""])
        #expect(rows[0].checkpoint == 1)
    }

    /// No caption word is hard-coded: other languages and scripts work.
    @Test func dropsCaptionsInOtherLanguages() {
        let captions: [[String]] = [
            ["N°", "HEURE D'ARRIVÉE", "HEURE PRÉVUE", "POINTS PERDUS"],
            ["番号", "到着時刻", "予定時刻", "失点"],
            ["ск. #", "ВРЕМЯ ПРИБЫТИЯ", "ВРЕМЯ", "ШТРАФ"],
            ["Nr.", "Ankunftszeit", "Sollzeit", "Strafpunkte"],
        ]
        for texts in captions {
            let (rows, _) = AppleTableCleanup.clean([row(texts, y: 0, height: 140), row(["1", "14", "", ""], y: 140)])
            #expect(rows.count == 1, "caption \(texts) should be dropped")
        }
    }

    /// Folded so no captions show: the first row is data and must survive.
    @Test func keepsTheFirstRowWhenThereAreNoCaptions() {
        let (rows, _) = AppleTableCleanup.clean([row(["1", "14", "", ""], y: 0), row(["2", "16", "", ""], y: 160)])
        #expect(rows.count == 2)
    }

    /// A garbled value in the first data row is not a caption.
    @Test func aMisreadFirstRowIsNotACaption() {
        for garbled in ["HA", "S", "l", "1 l", "I3"] {
            let (rows, _) = AppleTableCleanup.clean([row(["1", garbled, "", ""], y: 0), row(["2", "16", "", ""], y: 160)])
            #expect(rows.count == 2, "\(garbled) should stay a data row")
        }
    }

    /// Captions only come first: a wordy row later in the table is kept.
    @Test func aWordyRowAfterDataIsKept() {
        let (rows, _) = AppleTableCleanup.clean([row(["1", "14", "", ""], y: 0), row(["", "TOTAL", "", ""], y: 160)])
        #expect(rows.count == 2)
    }

    /// The bug that dropped checkpoint 5 on card DCC1544B: Vision read the
    /// printed 5 as "S", which looked like "not a digit, so a caption".
    @Test func keepsARowWhoseNumeralWasMisread() {
        let raw = [
            caption,
            row(["4", "40:", "08", ""], y: 140),
            row(["S", "37", "", ""], y: 300),
            row(["6", "38", "", ""], y: 460),
        ]
        let (rows, _) = AppleTableCleanup.clean(raw)
        #expect(rows.map { $0.texts[0] } == ["40:", "37", "38"])
        #expect(rows[1].checkpoint == nil)
    }

    @Test func keepsARowWhoseNumeralWasMissed() {
        let (rows, _) = AppleTableCleanup.clean([caption, row(["", "14", "", ""], y: 140)])
        #expect(rows.count == 1)
        #expect(rows[0].texts[0] == "14")
    }

    /// The phantom ~20px row between two real rows on card 1A6A125F.
    @Test func dropsAPhantomSliverRow() {
        let raw = [
            caption,
            row(["1", "9:33:31", "", ""], y: 140),
            row(["2", "42", "", ""], y: 300),
            row(["", "", "", ""], y: 460, height: 20),
            row(["3", "37", "", ""], y: 480),
            row(["4", "29", "", ""], y: 640),
        ]
        let (rows, flags) = AppleTableCleanup.clean(raw)
        #expect(rows.map { $0.texts[0] } == ["9:33:31", "42", "37", "29"])
        #expect(flags.contains { $0.kind == .droppedSliverRow && $0.row == nil })
    }

    @Test func insertsBlankRowsForAWholeRowGap() {
        let raw = [
            caption,
            row(["1", "14", "", ""], y: 140),
            row(["2", "16", "", ""], y: 300),
            // one whole 160 px row missing between y=460 and y=620
            row(["4", "21", "", ""], y: 620),
        ]
        let (rows, flags) = AppleTableCleanup.clean(raw)
        #expect(rows.count == 4)
        #expect(rows[2].texts == ["", "", ""])
        #expect(rows[2].sourceIndex == nil)
        #expect(flags.contains { $0.kind == .insertedGapRows })
    }

    @Test func contiguousRowsGetNoInsertions() {
        let raw = [caption] + (0..<5).map { row(["\($0 + 1)", "1\($0)", "", ""], y: 140 + CGFloat($0) * 160) }
        let (rows, flags) = AppleTableCleanup.clean(raw)
        #expect(rows.count == 5)
        #expect(flags.isEmpty)
    }
}
