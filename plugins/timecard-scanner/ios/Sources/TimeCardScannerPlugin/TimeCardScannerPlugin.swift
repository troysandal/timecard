import Capacitor
import Foundation
import TimeCardScannerCore
import UIKit
import VisionKit

/// Rejection codes the JS side can switch on (see `src/definitions.ts`).
private enum ErrorCode {
    static let cancelled = "CANCELLED"
    static let unavailable = "UNAVAILABLE"
    static let noTable = "NO_TABLE"
    static let invalidArgument = "INVALID_ARGUMENT"
    static let busy = "BUSY"
    static let scanFailed = "SCAN_FAILED"
}

/// Capacitor bridge for the S1 timecard scanner. The scanning itself lives in
/// `TimeCardScannerCore`, which needs iOS 26; this class compiles for older
/// deployment targets and reports `UNAVAILABLE` there.
@objc(TimeCardScannerPlugin)
public class TimeCardScannerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "TimeCardScannerPlugin"
    public let jsName = "TimeCardScanner"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "captureCard", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "scanImage", returnType: CAPPluginReturnPromise),
    ]

    /// Kept alive for the duration of one camera presentation.
    private var presenter: AnyObject?

    // MARK: Methods

    @objc func isAvailable(_ call: CAPPluginCall) {
        var available = false
        if #available(iOS 26, *) { available = VNDocumentCameraViewController.isSupported }
        call.resolve(["available": available])
    }

    @objc func captureCard(_ call: CAPPluginCall) {
        guard #available(iOS 26, *) else {
            return call.reject("Card scanning requires iOS 26 or later.", ErrorCode.unavailable)
        }
        guard VNDocumentCameraViewController.isSupported else {
            return call.reject("The document scanner is not supported on this device.", ErrorCode.unavailable)
        }
        let folder: URL
        do {
            folder = try Self.destinationFolder(directory: call.getString("directory"), folder: call.getString("folder"))
        } catch {
            return call.reject("Invalid destination: \(error.localizedDescription)", ErrorCode.invalidArgument)
        }
        guard presenter == nil else {
            return call.reject("A capture is already in progress.", ErrorCode.busy)
        }

        Task { @MainActor in
            guard let host = self.bridge?.viewController else {
                return call.reject("No view controller to present the scanner from.", ErrorCode.unavailable)
            }
            let camera = DocumentCameraPresenter()
            self.presenter = camera
            camera.present(from: host) { outcome in
                self.presenter = nil
                switch outcome {
                case .cancelled:
                    call.reject("The user cancelled the scan.", ErrorCode.cancelled)
                case .failed(let error):
                    call.reject("The document scanner failed: \(error.localizedDescription)", ErrorCode.scanFailed, error)
                case .captured(let image, let pageCount):
                    Task { await self.process(image: image, pageCount: pageCount, folder: folder, call: call) }
                }
            }
        }
    }

    @objc func scanImage(_ call: CAPPluginCall) {
        guard #available(iOS 26, *) else {
            return call.reject("Card scanning requires iOS 26 or later.", ErrorCode.unavailable)
        }
        guard let path = call.getString("path"), !path.isEmpty else {
            return call.reject("`path` is required.", ErrorCode.invalidArgument)
        }
        let url = path.hasPrefix("file://") ? URL(string: path) : URL(fileURLWithPath: path)
        guard let url, let image = ImageLoading.uprightImage(contentsOf: url) else {
            return call.reject("Could not read an image at \(path).", ErrorCode.invalidArgument)
        }
        Task { await self.scan(image, savedAt: url, extraWarnings: [], call: call) }
    }

    // MARK: Scanning

    @available(iOS 26, *)
    private func process(image: UIImage, pageCount: Int, folder: URL, call: CAPPluginCall) async {
        guard let upright = image.uprightCGImage(), let jpeg = ImageLoading.jpegData(from: upright) else {
            return call.reject("Could not encode the captured image.", ErrorCode.scanFailed)
        }
        let file = folder.appendingPathComponent("timecard-\(UUID().uuidString).jpg")
        do {
            try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
            try jpeg.write(to: file, options: .atomic)
        } catch {
            return call.reject("Could not save the photo: \(error.localizedDescription)", ErrorCode.scanFailed, error)
        }
        let extra = pageCount > 1 ? ["The scanner returned \(pageCount) pages; only the first was read."] : []
        await scan(upright, savedAt: file, extraWarnings: extra, call: call)
    }

    @available(iOS 26, *)
    private func scan(_ image: CGImage, savedAt file: URL, extraWarnings: [String], call: CAPPluginCall) async {
        do {
            let scan = try await TimeCardScanner.scan(image)
            let result = Self.result(for: scan, file: file, extraWarnings: extraWarnings, webPath: webPath(for: file))
            if scan.rows.isEmpty {
                // Keep the photo so the host can show what was captured.
                call.reject("No table was found in the photo.", ErrorCode.noTable, nil, result)
            } else {
                call.resolve(result)
            }
        } catch {
            call.reject("Scanning failed: \(error.localizedDescription)", ErrorCode.scanFailed, error)
        }
    }

    private func webPath(for file: URL) -> String {
        bridge?.portablePath(fromLocalURL: file)?.absoluteString ?? file.absoluteString
    }

    // MARK: Mapping

    @available(iOS 26, *)
    private static func result(for scan: TableScan, file: URL, extraWarnings: [String], webPath: String) -> [String: Any] {
        let rows: [[String: Any]] = scan.rows.enumerated().map { index, row in
            let cells = row + Array(repeating: "", count: max(0, 3 - row.count))
            return ["c1": cells[0], "c2": cells[1], "c3": cells[2], "flagged": !scan.flags(forRow: index).isEmpty]
        }
        // A mapped character is already visible as a flagged row; it isn't worth a line of its own.
        let warnings = scan.flags.filter { $0.kind != .charsetMapped }.map { flag in
            flag.row.map { "row \($0 + 1): \(flag.detail)" } ?? flag.detail
        }
        return [
            "image": ["path": file.path, "webPath": webPath],
            "rows": rows,
            "warnings": extraWarnings + warnings,
        ]
    }

    /// Resolves a `@capacitor/filesystem`-style directory name plus a relative
    /// folder. Unknown names fall back to Documents, as that plugin does.
    static func destinationFolder(directory: String?, folder: String?) throws -> URL {
        let search: FileManager.SearchPathDirectory
        switch directory {
        case "CACHE": search = .cachesDirectory
        case "LIBRARY": search = .libraryDirectory
        default: search = .documentDirectory
        }
        var url = FileManager.default.urls(for: search, in: .userDomainMask)[0]
        for part in (folder ?? "").split(separator: "/") {
            guard part != ".." else { throw CocoaError(.fileReadInvalidFileName) }
            url.appendPathComponent(String(part), isDirectory: true)
        }
        return url
    }
}
