import CoreGraphics
import Foundation

/// One row of Apple's detected table, reduced to plain values so the cleanup
/// below can be unit-tested without Vision.
struct AppleRow {
    /// All cell texts left to right: `Ck.#`, then the three value columns.
    var texts: [String]
    /// All cell rects (pixel space, top-left origin), same order as `texts`.
    var cells: [CGRect]

    var rect: CGRect { cells.dropFirst().reduce(cells.first ?? .zero) { $0.union($1) } }
}

struct CleanRow {
    /// The three value columns.
    var texts: [String]
    var cells: [CGRect]
    /// Printed checkpoint number if Vision read one.
    var checkpoint: Int?
    /// Index of this row in the raw table, `nil` for an inserted blank row.
    var sourceIndex: Int?
}

/// Repairs the structural mistakes Apple's table detector makes, using
/// geometry rather than the printed numerals alone (a numeral can be
/// misread — `S` for 5, `l` for 1 — or missed entirely):
/// - the caption row(s) are recognised by *shape*, in any language: the
///   leading rows whose value cells hold real words (several letters, any
///   script). Handwritten numbers never read as words, and a misread numeral
///   (`S` for 5) or a missing one doesn't matter, because the Ck cell isn't
///   consulted. No caption words are hard-coded, so a French or Japanese
///   card, or a card folded so no captions show, works the same;
/// - slivers far thinner than a real row (a phantom row seen between two
///   real ones) are dropped, since they shift every row below them;
/// - a vertical gap of about a whole row between two rows gets blank rows
///   inserted, so rows after a detector gap don't slide up.
///
/// Nothing is repaired silently: every dropped, inserted or truncated row
/// comes back as a `ScanFlag`.
enum AppleTableCleanup {
    /// A row thinner than this fraction of the median row height is a sliver.
    static let sliverFraction: CGFloat = 0.5

    /// A cell reads as a word when it has at least this many letters (any
    /// script — `Character.isLetter` covers Latin, Cyrillic, CJK, …) and
    /// letters make up most of its non-space characters. Handwritten digit
    /// cells, even with a stray misread (`S`, `l`, `HA`), stay under this.
    static let minWordLetters = 3

    static func isWordLike(_ cell: String) -> Bool {
        let chars = cell.filter { !$0.isWhitespace && !$0.isPunctuation && $0 != "#" }
        let letters = chars.filter(\.isLetter).count
        return letters >= minWordLetters && letters * 2 >= chars.count
    }

    /// Caption rows only ever come first. Once a row that isn't one has been
    /// seen, nothing later is treated as a caption, so a garbled data row in
    /// the middle of the table is never discarded.
    static func isCaptionRow(_ texts: [String]) -> Bool {
        texts.dropFirst().prefix(3).contains(where: isWordLike)
    }

    static func clean(_ raw: [AppleRow]) -> (rows: [CleanRow], flags: [ScanFlag]) {
        var flags: [ScanFlag] = []
        var inLeadingRows = true
        let data = raw.enumerated().filter { index, row in
            guard row.texts.count >= 4, row.cells.count >= 4 else {
                flags.append(ScanFlag(
                    kind: .malformedRow,
                    detail: "dropped detected row \(index) with only \(min(row.texts.count, row.cells.count)) cell(s)"
                ))
                return false
            }
            if inLeadingRows && isCaptionRow(row.texts) { return false }
            inLeadingRows = false
            return true
        }
        guard !data.isEmpty else { return ([], flags) }

        let heights = data.map { $0.element.rect.height }.sorted()
        let median = heights[heights.count / 2]

        var kept: [(index: Int, row: AppleRow)] = []
        for (index, row) in data {
            if row.rect.height < median * sliverFraction {
                flags.append(ScanFlag(
                    kind: .droppedSliverRow,
                    detail: "ignored a \(Int(row.rect.height)) px sliver row (typical row \(Int(median)) px)"
                ))
            } else {
                kept.append((index, row))
            }
        }

        var out: [CleanRow] = []
        for (i, item) in kept.enumerated() {
            let valueCells = Array(item.row.cells[1..<4])
            if i > 0 {
                let previous = kept[i - 1].row.rect
                let gap = item.row.rect.minY - previous.maxY
                let missing = Int((gap / median).rounded())
                if missing >= 1 {
                    flags.append(ScanFlag(
                        kind: .insertedGapRows, row: out.count,
                        detail: "inserted \(missing) blank row(s) for a \(Int(gap)) px gap in the detected table"
                    ))
                    // Spread the inserted rows evenly across the gap, in this row's columns.
                    let height = gap / CGFloat(missing)
                    for k in 0..<missing {
                        let y = previous.maxY + CGFloat(k) * height
                        let cells = valueCells.map { CGRect(x: $0.minX, y: y, width: $0.width, height: height) }
                        out.append(CleanRow(texts: ["", "", ""], cells: cells, checkpoint: nil, sourceIndex: nil))
                    }
                }
            }
            if item.row.texts.count > 4 || item.row.cells.count > 4 {
                flags.append(ScanFlag(
                    kind: .extraColumns, row: out.count,
                    detail: "detected row has \(item.row.texts.count) cells; kept the first three value cells, values may have shifted"
                ))
            }
            out.append(CleanRow(
                texts: Array(item.row.texts[1..<4]),
                cells: valueCells,
                checkpoint: Int(item.row.texts[0].trimmingCharacters(in: .whitespaces)),
                sourceIndex: item.index
            ))
        }
        return (out, flags)
    }
}
