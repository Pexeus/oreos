const puppeteer = require("puppeteer-extra")
const { executablePath } = require("puppeteer")
const extraStealth = require("puppeteer-extra-plugin-stealth");



const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
];

async function init(mail) {
    puppeteer.use(extraStealth())

    const browser = await puppeteer.launch({
        userDataDir: "./devProfile",
        headless: false,
        defaultViewport: null,
        executablePath: executablePath(),
        args: args,
    })

    const p = await browser.newPage()
    p.goto("https://stay-playful.oreo.eu/ch/cookie-sequence", {
        waitUntil: "networkidle0",
    })

    await sleep(4000)

    const solved = await solve(p)
    
    if (solved) {
        await p.evaluate(() =>{
            window.location.href = "https://stay-playful.oreo.eu/ch/success-cookie-sequence"
        })
    }
}

function solve(p) {
    return new Promise(async resolve => {
        const sprites = ["arrow", "xbox", "a", "b", "x", "y"]
        let solved = false
        const t = [sprites[0], sprites[0], sprites[0], sprites[0]]


        while (!solved) {
            const solution = await getSolution(t)

            let flipped = false

            if (solution == true) {
                solved = true;
                break;
            }
            else {
                await p.evaluate(() => {
                    location.reload()
                })

                await sleep(1000)
            }


            for (let i = 0; i < t.length; i++) {
                if (solution[i] == "danger") {
                    //var index = sprites.indexOf(t[i]);
                    //sprites.splice(index, 1)

                    let spritesIndex = Math.floor(Math.random() * sprites.length)

                    t[i] = sprites[spritesIndex]
                }

                if (solution[i] == "warning") {
                    for (let j = 0; j < t.length; j++) {
                        if (solution[j] == "warning" && i != j && !flipped) {
                            const val1 = t[i]
                            const val2 = t[j]

                            t[i] = val2
                            t[j] = val1

                            flipped = true
                        }
                    }
                }
            }

            console.log(t, solution);
        }

        resolve(true)

        function getSolution(t) {
            return new Promise(async resolve => {
                const hint = []

                for (const cookie of t) {
                    await p.evaluate((cookie) => {
                        Alpine.store('cookieSequence').setNextFree(cookie)
                    }, cookie)
                }

                await sleep(1000)

                await p.evaluate(() => {
                    send()
                })

                p.on("response", async res => {
                    if (res.url() == "https://stay-playful.oreo.eu/ch/cookie-sequence" && res.request().method() == "POST") {                        
                        const json = await res.json()
                    
                        try {
                            for (const h of json.content) {
                                hint.push(h.color)
                            }
                
                            console.log(hint);
                            resolve(hint)
                        }
                        catch(e) {
                            console.log("SOLUTION FOUND");
                            console.log("Solution:", t);

                            resolve(true)
                        }
                    }
                })
            })
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

init("a@b.c")