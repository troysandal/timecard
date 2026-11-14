import UIKit
import VisionKit

/// Presents the system document scanner and reports the first page, or why
/// there isn't one. One instance serves one presentation.
@MainActor
final class DocumentCameraPresenter: NSObject, @preconcurrency VNDocumentCameraViewControllerDelegate {
    enum Outcome {
        case captured(UIImage, pageCount: Int)
        case cancelled
        case failed(Error)
    }

    private var completion: ((Outcome) -> Void)?

    static var isSupported: Bool { VNDocumentCameraViewController.isSupported }

    func present(from presenter: UIViewController, completion: @escaping (Outcome) -> Void) {
        self.completion = completion
        let controller = VNDocumentCameraViewController()
        controller.delegate = self
        presenter.present(controller, animated: true)
    }

    private func finish(_ controller: VNDocumentCameraViewController, _ outcome: Outcome) {
        let completion = self.completion
        self.completion = nil
        controller.dismiss(animated: true) { completion?(outcome) }
    }

    func documentCameraViewController(_ controller: VNDocumentCameraViewController, didFinishWith scan: VNDocumentCameraScan) {
        // One card per capture: the first page.
        if scan.pageCount > 0 {
            finish(controller, .captured(scan.imageOfPage(at: 0), pageCount: scan.pageCount))
        } else {
            finish(controller, .cancelled)
        }
    }

    func documentCameraViewControllerDidCancel(_ controller: VNDocumentCameraViewController) {
        finish(controller, .cancelled)
    }

    func documentCameraViewController(_ controller: VNDocumentCameraViewController, didFailWithError error: Error) {
        finish(controller, .failed(error))
    }
}
