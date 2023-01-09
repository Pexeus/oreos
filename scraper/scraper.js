const puppeteer = require("puppeteer-extra")
const { executablePath } = require("puppeteer")
const extraStealth = require("puppeteer-extra-plugin-stealth")



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
        userDataDir: "./browserdata",
        headless: false,
        defaultViewport: null,
        executablePath: executablePath(),
        args: args,
    })

    const tab = await browser.newPage()
    await tab.goto("https://stay-playful.oreo.eu/ch/pre")

    await tab.waitForSelector("#first_name")
    await tab.focus("#first_name")
    await tab.keyboard.type("barak")

    await tab.focus("#last_name")
    await tab.keyboard.type("obama")

    await tab.focus("#email")
    await tab.keyboard.type(mail)

    await sleep(2000)

    await tab.waitForSelector(".hint-wrapper.w-100")
    await tab.click(".hint-wrapper.w-100")

    await sleep(2000)
    
    await tab.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    })

    const frames = await tab.frames()
    let captcha

    for (const frame of frames) {
        if (frame.url().includes("https://www.google.com/recaptcha/api2/anchor")) {
            console.log("captcha found");

            captcha = frame
        }
    }

    console.log("waiting for checkbox");
    await captcha.waitForSelector(".recaptcha-checkbox")
    await captcha.click("#rc-anchor-container")

    console.log("waiting for solver");
    await tab.$$("pierce/button")
    console.log("found!");
    
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

init("a@b.c")