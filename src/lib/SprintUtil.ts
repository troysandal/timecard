/**
 * Formats the # of seconds that has elapsed since start of day into
 * a US Centric Time String hh:mm:ss.  Globally hh:mm:ss is how ISO says
 * to do this but in the UK it's hh.mm.ss, France HHhMMmSSs, US militiary
 * uses hhmmss.  So this isn't locale aware.  
 * 
 * NOTE - NaN is formatted as 'NaN:NaN:NaN'.
 * 
 * @param seconds # of seconds elapsed since start of day.
 * @returns US Centric Time String hh:mm:ss
 */
export function scoreString(seconds: number): string {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${secs}`
}
