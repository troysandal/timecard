// US Centric Time String
// Globally hh:mm:ss is how ISO says to do this but in the UK it's 
// hh.mm.ss, France HHhMMmSSs, US militiary hhmmss.

export function scoreString(seconds: number): string {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${secs}`
}
