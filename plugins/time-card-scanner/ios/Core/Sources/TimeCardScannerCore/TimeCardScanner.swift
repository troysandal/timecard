import CoreGraphics
import Foundation

/// The result of scanning one card.
public struct TableScan: Sendable, Codable, Equatable {
    /// One entry per table row, each with three value cells (minutes, then the
    /// two others), over `[0-9:]`. `""` for a blank cell, never missing.
    public var rows: [[String]]
    /// Vision's text for the same cells before the character mapping.
    public var rawText: [[String]]
    /// Value-cell rects per row, in pixels of the scanned image, top-left origin.
    public var cells: [[CGRect]]
    /// The printed checkpoint number Vision read for each row, if any.
    public var printedCheckpoints: [Int?]
    public var flags: [ScanFlag]
    public var pipelineVersion: String

    /// Flags attached to `row`.
    public func flags(forRow row: Int) -> [ScanFlag] { flags.filter { $0.row == row } }
}

/// S1: Apple's document-table detector, repaired by `AppleTableCleanup`, with
/// recognizer output mapped onto the card's `[0-9:]` alphabet.
@available(iOS 26, macOS 26, *)
public enum TimeCardScanner {
    /// Bump when a change can alter the extracted table.
    public static let pipelineVersion = "S1.1"

    /// Scans an upright photo of the table. Throws only if Vision fails; a
    /// photo with no table comes back with no rows and a `.noTable` flag.
    public static func scan(_ image: CGImage) async throws -> TableScan {
        guard let detection = try await AppleTable.detect(in: image) else {
            return TableScan(
                rows: [], rawText: [], cells: [], printedCheckpoints: [],
                flags: [ScanFlag(kind: .noTable, detail: "no table found by RecognizeDocumentsRequest")],
                pipelineVersion: pipelineVersion
            )
        }

        var flags: [ScanFlag] = []
        if detection.tableCount > 1 {
            flags.append(ScanFlag(kind: .multipleTables, detail: "\(detection.tableCount) tables detected; using the largest"))
        }

        let cleaned = AppleTableCleanup.clean(detection.rows)
        flags += cleaned.flags

        let raw = cleaned.rows.map(\.texts)
        var rows = raw
        for r in rows.indices {
            for c in rows[r].indices {
                let (text, changed) = Charset.normalize(rows[r][c])
                if changed {
                    flags.append(ScanFlag(kind: .charsetMapped, row: r, column: c, detail: "mapped \"\(rows[r][c])\" → \"\(text)\""))
                }
                rows[r][c] = text
            }
        }

        let printed = cleaned.rows.map(\.checkpoint)
        flags += CheckpointCheck.flags(for: printed)

        return TableScan(
            rows: rows, rawText: raw, cells: cleaned.rows.map(\.cells),
            printedCheckpoints: printed, flags: flags, pipelineVersion: pipelineVersion
        )
    }
}
