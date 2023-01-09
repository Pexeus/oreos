async function solve() {
    const selected = document.querySelector(".owl-item.active.center")
    const next = document.querySelector(".owl-next")
    const select = document.querySelector(".btn.btn-light.btn-choser.mx-auto")

    const solution = ["a.png", "y.png", "x.png", "b.png"]
    const solved = false
    let i = 0

    while(!solved) {
        if (document.querySelector(".owl-item.active.center").innerHTML.includes(solution[i])) {
            select.click()
            await sleep(100)

            i++
        }
        else {
            next.click()
            await sleep(100)
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

solve()