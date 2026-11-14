import Foundation

/// Something the scan wants the host to know about. Flags are data, not
/// prose: the host can decide which kinds to surface (`detail` is for humans).
public struct ScanFlag: Sendable, Codable, Equatable {
    public enum Kind: String, Sendable, Codable {
        /// Vision found no table at all.
        case noTable
        /// More than one table was found; the one with the most rows was used.
        case multipleTables
        /// A phantom row far thinner than a real row was ignored.
        case droppedSliverRow
        /// Blank rows were inserted for a whole-row vertical gap in the detected table.
        case insertedGapRows
        /// A detected row had fewer than four cells and was dropped.
        case malformedRow
        /// A detected row had more than four cells; only the first three value cells were kept.
        case extraColumns
        /// A recognized character outside `[0-9:]` was mapped to a digit or colon.
        case charsetMapped
        /// A printed checkpoint number disagrees with the row's position.
        case checkpointMismatch
    }

    public var kind: Kind
    /// Zero-based row in the returned table, or `nil` for a table-level flag.
    public var row: Int?
    public var column: Int?
    public var detail: String

    public init(kind: Kind, row: Int? = nil, column: Int? = nil, detail: String) {
        self.kind = kind
        self.row = row
        self.column = column
        self.detail = detail
    }
}
