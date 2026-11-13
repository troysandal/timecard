import Foundation

/// Maps recognizer output onto the card's real alphabet: digits and `:`.
/// Non-digit characters are usually a predictable misread of a specific
/// digit (or of the colon), so they are mapped, not dropped. The table is a
/// starting guess — it should be tuned from misreads logged on the real
/// corpus, keeping only mappings that are right most of the time.
public enum Charset {
    public static let allowed: Set<Character> = Set("0123456789:")

    static let map: [Character: Character] = [
        // looks like 1
        "|": "1", "/": "1", "\\": "1", "l": "1", "I": "1", "i": "1", "!": "1", "]": "1", "[": "1",
        // looks like 0
        "O": "0", "o": "0", "D": "0", "Q": "0", "U": "0",
        "Z": "2", "z": "2",
        "S": "5", "s": "5", "$": "5",
        "b": "6", "G": "6",
        "T": "7", "?": "7",
        "B": "8", "&": "8",
        "g": "9", "q": "9",
        "A": "4",
        // colon-like ticks
        ".": ":", ";": ":", ",": ":", "'": ":", "’": ":", "-": ":", "‘": ":", "`": ":",
    ]

    /// Maps then strips. Whitespace is removed. Returns the cleaned string
    /// and whether anything had to be changed.
    public static func normalize(_ raw: String) -> (text: String, changed: Bool) {
        var out = ""
        for ch in raw where !ch.isWhitespace {
            if allowed.contains(ch) {
                out.append(ch)
            } else if let mapped = map[ch] {
                out.append(mapped)
            }
            // else: unmappable, dropped
        }
        return (out, out != raw)
    }

    public static func isValid(_ s: String) -> Bool {
        s.allSatisfy { allowed.contains($0) }
    }
}
