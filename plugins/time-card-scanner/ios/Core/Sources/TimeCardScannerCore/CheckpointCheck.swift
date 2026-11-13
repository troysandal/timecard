import Foundation

/// Compares the printed checkpoint numerals Vision read with each row's
/// position. A numeral that disagrees means a row was merged, split or
/// shifted upstream. A numeral Vision *didn't* read proves nothing, so
/// `nil` is never flagged. This only flags; it never repairs.
enum CheckpointCheck {
    static func flags(for printed: [Int?]) -> [ScanFlag] {
        printed.enumerated().compactMap { index, number in
            guard let number, number != index + 1 else { return nil }
            return ScanFlag(
                kind: .checkpointMismatch, row: index,
                detail: "row \(index + 1) shows checkpoint \(number) — a row may be missing, merged or split"
            )
        }
    }
}
