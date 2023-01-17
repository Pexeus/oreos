(async function () {
    const sprites = ["arrow", "xbox", "a", "b", "x", "y"]
    let solved = false
    const t = [sprites[0], sprites[0], sprites[0], sprites[0]]

    while(!solved) {
        const solution = await getSolution(t)
        let flipped = false

        if (solution == true) {
            solved = true;
            break;
        }
        
        
        for (let i = 0; i < t.length; i++) {
            if (solution[i] == "danger") {
                //var index = sprites.indexOf(t[i]);
                //sprites.splice(index, 1)

                let spritesIndex = Math.floor(Math.random()*sprites.length)

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


    async function getSolution(t) {
        const res = await fetch("https://stay-playful.oreo.eu/ch/cookie-sequence", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,fr;q=0.8,de;q=0.7",
                "content-type": "application/json",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-xsrf-token": getXSRF()
            },
            "referrer": "https://stay-playful.oreo.eu/ch/cookie-sequence",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `{\"chosenCookies\":{\"0\":\"${t[0]}\",\"1\":\"${t[1]}\",\"2\":\"${t[2]}\",\"3\":\"${t[3]}\"}}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        const hint = []
        const json = await res.json()
        
        try {
            for (const h of json.content) {
                hint.push(h.color)
            }

            return hint
        }
        catch {
            console.log(json, t);
            console.log(res);

            //window.location.href = json.content.original.redirect_url

            return true
        }
    }

    function getXSRF() {
        let a = document.cookie.split(";")
        let index 
        for(let i=0;i<a.length;i++){
            if(a[i].includes("XSRF-TOKEN")){
    
                index = i
                break
            }
    
        }
    
        return decodeURIComponent(a[index].split("=")[1])
    }
})()
