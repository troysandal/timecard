import CoreGraphics
import Foundation
import OSLog
import Vision

private let log = Logger(subsystem: "TimeCardScanner", category: "scan")

/// Vision's `RecognizeDocumentsRequest` table detector: structure *and* text
/// in one call. This is the only place the scan touches Vision.
@available(iOS 26, macOS 26, *)
enum AppleTable {
    struct Detection {
        var rows: [AppleRow]
        /// How many tables Vision found; the one with the most rows is used.
        var tableCount: Int
    }

    /// `nil` when Vision found no table.
    static func detect(in image: CGImage) async throws -> Detection? {
        let observations = try await RecognizeDocumentsRequest().perform(on: image)
        let tables = observations.flatMap { $0.document.tables }
        guard let table = tables.max(by: { $0.rows.count < $1.rows.count }) else { return nil }

        let rows = table.rows.map { row in
            let texts = row.map { $0.content.text.transcript.trimmingCharacters(in: .whitespacesAndNewlines) }
            log.debug("raw row: \(texts, privacy: .private)")
            return AppleRow(texts: texts, cells: row.map { pixelRect(of: $0.content.boundingRegion, in: image) })
        }
        return Detection(rows: rows, tableCount: tables.count)
    }

    /// Bounding box of a Vision region in top-left-origin pixel coordinates.
    static func pixelRect(of region: NormalizedRegion, in image: CGImage) -> CGRect {
        let points = region.normalizedPoints
        guard !points.isEmpty else { return .zero }
        let xs = points.map { CGFloat($0.x) }
        let ys = points.map { CGFloat($0.y) }
        let minX = xs.min() ?? 0, maxX = xs.max() ?? 0
        let minY = ys.min() ?? 0, maxY = ys.max() ?? 0
        // normalizedPoints use Vision's bottom-left origin; flip to top-left.
        let w = CGFloat(image.width), h = CGFloat(image.height)
        return CGRect(x: minX * w, y: (1 - maxY) * h, width: (maxX - minX) * w, height: (maxY - minY) * h)
    }
}
