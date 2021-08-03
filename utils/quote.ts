export default function quote(): string {
    // https://warframe.fandom.com/wiki/Konzu/Quotes
    const quotes: string[] = [
        "Handy with a gun or blade? Cetus needs you. Let's talk.",
        "Offworlder! I'm hiring combat talent. Let's talk rates.",
        "Job boards filling up, offworlder. Help Konzu clear the slate, eh?",
        "Offworlder! Help push the Grineer away from Cetus. You do a good deed, I pay you for it.",
        "You pay me in red, I pay you in silver.",
        "Got something, heavy hitter like you needs a little snack, eh?",
        "I give you coordinates, you go in, you work, nobody but you comes out. Good?"
    ]

    return quotes[Math.floor(Math.random()*quotes.length)]
}