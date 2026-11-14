import CoreGraphics
import Foundation
import ImageIO

/// The scan assumes an upright image, so every entry point gets one here.
public enum ImageLoading {
    /// Longest side kept when decoding; larger photos are downscaled.
    public static let maxPixelSize = 6000

    /// Decodes `data` with its EXIF orientation applied to the pixels.
    public static func uprightImage(from data: Data) -> CGImage? {
        guard let source = CGImageSourceCreateWithData(data as CFData, nil) else { return nil }
        return CGImageSourceCreateThumbnailAtIndex(source, 0, [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceCreateThumbnailWithTransform: true,
            kCGImageSourceThumbnailMaxPixelSize: maxPixelSize,
        ] as CFDictionary)
    }

    public static func uprightImage(contentsOf url: URL) -> CGImage? {
        (try? Data(contentsOf: url)).flatMap(uprightImage(from:))
    }

    /// JPEG-encodes `image` (already upright, so no orientation tag is needed).
    public static func jpegData(from image: CGImage, quality: CGFloat = 0.9) -> Data? {
        let data = NSMutableData()
        guard let destination = CGImageDestinationCreateWithData(data, "public.jpeg" as CFString, 1, nil) else { return nil }
        CGImageDestinationAddImage(destination, image, [kCGImageDestinationLossyCompressionQuality: quality] as CFDictionary)
        return CGImageDestinationFinalize(destination) ? data as Data : nil
    }
}

#if canImport(UIKit)
import UIKit

extension UIImage {
    /// A `CGImage` with UIKit orientation baked into the pixels.
    public func uprightCGImage() -> CGImage? {
        if imageOrientation == .up, let cg = cgImage { return cg }
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        let renderer = UIGraphicsImageRenderer(size: size, format: format)
        return renderer.image { _ in draw(in: CGRect(origin: .zero, size: size)) }.cgImage
    }
}
#endif
