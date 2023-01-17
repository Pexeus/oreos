//this script handles the book element

//global variables:
var bookEventCooldown = false

function openBook() {
    console.log("opening...")

    //set book to status open
    const book = document.getElementById("book")
    book.id = "bookOpen"

    //flip cover
    const cover = document.getElementById("cover")
    cover.style.transform = "rotateY(180deg)"
    cover.style.color = "#1e272e"
    cover.style.zIndex = 2

    //make content visible
    const content = document.getElementById("content")
    content.style.display = "inline-block"

    //open bookmarks
    document.getElementById("bookmarks").style.right = "-130px"

    openFirst()

    setTimeout(() => {
        document.getElementById("bookInside").style.opacity = 1
    }, 500);
}

function closeBook() {
    console.log("closing...")
    document.getElementById("bookInside").style.opacity = 0

    //closing bookmarks
    document.getElementById("bookmarks").style.right = "-15px"
    
    //close pages
    closePages()

    //set book to status closed
    setTimeout(() => {
        const book = document.getElementById("bookOpen")
        book.id = "book"

        //flip cover
        const cover = document.getElementById("cover")
        cover.style.transform = "rotateY(0deg)"
        cover.style.color = "white"
        cover.style.zIndex = 5
    }, 100);

    //hide content
    const content = document.getElementById("content")
    setTimeout(() => {
        content.style.display = "none"
        console.log("hidden content")
    }, 800);
}

//open first page
function openFirst() {
    pages = getPages()

    openPage(pages[0])
}

function closePages() {
    pages = getPages()

    for (i = 0; i < pages.length; i++) {
        if (pages[i].style.display != "none") {
            closePage(pages[i])
        }
    }
}

function goToPage(page) {
    currentlyOpen = getCurrentPage()
    closePage(currentlyOpen)

    openPage(page)
}

function goToIndex(pageIndex) {
    currentlyOpen = getCurrentPage()
    closePage(currentlyOpen)

    pages = getPages()
    openPage(pages[pageIndex])
}

function getPageIndex(currentPage) {
    pages = getPages()

    for (i = 0; i < pages.length; i++) {
        if (pages[i] == currentPage) {
            return i
        }
    }
}

function getCurrentPage() {
    pages = getPages()

    for (i = 0; i < pages.length; i++) {
        if (pages[i].style.display == "inline-block") {
            console.log("page")
            return pages[i]
        }
    }
}

function openPage(page) {
    page.style.display = "inline-block"
    
    const left = page.children[0]
    const right = page.children[1]
    setTimeout(() => {
        //flip page
        left.style.transform = "rotateY(0deg)"
        right.style.transform = "rotateY(0deg)"
    }, 400);
}

function nextPage(page) {
    if (page == undefined) {
		page = event.target.parentElement.parentElement.parentElement
	}

    currentPageIndex = getPageIndex(page)

    if (currentPageIndex + 1 < getPages().length) {
        goToIndex(currentPageIndex + 1)
    }
}

function previousPage(page) {
    if (page == undefined) {
		page = event.target.parentElement.parentElement.parentElement
	}

    currentPageIndex = getPageIndex(page)

    if (currentPageIndex > 0) {
        goToIndex(currentPageIndex - 1)
    }
}

function closePage(page) {

    console.log("closing: " + page + " in: " + page.parentElement.id)

    const left = page.children[0]
    const right = page.children[1]

    left.style.transform = "rotateY(-90deg)"
    right.style.transform = "rotateY(-90deg)"


    setTimeout(() => {
        page.style.display = "none"
        console.log("closed page")
    }, 700);
}

//get all pages
function getPages() {
    let pages = []

    const content = document.getElementById("content")
    const categories = content.children

    for(i = 0; i < categories.length; i++) {
        let catContents = categories[i].children

        for (l = 0; l < catContents.length; l++) {
            pages.push(catContents[l])
        }
    }

    return pages
}

function getCategories() {
    categories =  []

    const content = document.getElementById("content")
    const categorieNodes = content.children

    for (i = 0; i < categorieNodes.length; i++) {
        categories.push(categorieNodes[i].id)
    }

    return categories
}

function switchCategory(category) {
    const currentCategory = getCurrentPage().parentElement.id

    console.log(category)
    console.log(currentCategory)

    if (category != currentCategory) {
        const page = document.getElementById(category).children[0]

        goToPage(page)
    }
    else {
        console.log("cant switch to current")
    }
}

//beim laden der seite buch konfigurieren
function initBook() {
    const book = document.getElementById("book")
    const background = document.getElementById("books")

    //ein/aus der maus
    book.addEventListener("click", function() {
        if (document.getElementById("book") != null) {
            setBookEventCooldown(1200)
            openBook()
        }
    })
    background.addEventListener("click", function() {
        if (document.getElementById("bookOpen") != null && bookEventCooldown == false && event.target.id == "books") {
            setBookEventCooldown(1200)
            closeBook()
        }
    })

    insertBookmarks()
}

function setBookEventCooldown(cooldown) {
    bookEventCooldown = true

    setTimeout(() => {
        bookEventCooldown = false
    }, cooldown);
}


//insert bookmarks for quick access via categories
function insertBookmarks() {
    createSectionNew()
    const container = document.getElementById("bookmarks")

    const categories = getCategories()
    const colors = ["#f6e58d", "#eb4d4b", "#6ab04c", "#0abde3", "#5f27cd", "#ff9f43"]

    for (i = 0; i < categories.length; i++) {
        if (categories[i] != "bookInside") {
            let bookmark = createBookmark(categories[i], colors[i])

            container.appendChild(bookmark)
        }
    }
}

function createSectionNew() {
    const container = document.getElementById("content")

    let section = document.createElement("div")
    section.id = "Neues"

    const categories = container.childNodes

    categories.forEach(cat => {
        const posts = cat.childNodes

        posts.forEach(post => {
            if (post.className == "fav") {
                let insertant = post.cloneNode(true)
                section.appendChild(insertant)
            }
        })
    });

    container.insertBefore(section, container.childNodes[2])
}

//create a bookmark
function createBookmark(cat, color) {
    const bookmark = document.createElement("div")
    bookmark.classList.add("bookmark")
    bookmark.style.backgroundColor = color

    const bookmarkText = document.createElement("p")
    bookmarkText.innerHTML = cat

    bookmark.appendChild(bookmarkText)

    bookmark.addEventListener("click", function() {
        if(event.target.tagName == "DIV") {
            switchCategory(event.target.children[0].innerHTML)
        }
        else {
            switchCategory(event.target.innerHTML)
        }
    })

    return bookmark
}

function insertPageNavigors() {
    pages = getPages()

    for (i = 0; i < pages.length; i++) {
        inserNavigator(pages[i], i)
    }
}

function inserNavigator(page, index) {
    navigatorLeft(page.children[0], index)
    navigatorRight(page.children[1], index)
}

function navigatorLeft(site, index) {
    const navigator = document.createElement("div")
    navigator.id = "pageNavigator"

    const pageNr = document.createElement("h1")
    pageNr.id = "pageNr"
    pageNr.innerHTML = (index * 2) + 1

    const previousPageButton = document.createElement("h1")
    previousPageButton.id = "togglePageButton"
    previousPageButton.innerHTML = "<"

    previousPageButton.addEventListener("click", previousPage)

    navigator.appendChild(previousPageButton)
    navigator.appendChild(pageNr)

    site.appendChild(navigator)
}

function navigatorRight(site, index) {
    const navigator = document.createElement("div")
    navigator.id = "pageNavigator"

    const pageNr = document.createElement("h1")
    pageNr.id = "pageNr"
    pageNr.innerHTML = (index * 2) + 2

    const nextPageButton = document.createElement("h1")
    nextPageButton.id = "togglePageButton"
    nextPageButton.innerHTML = ">"

    nextPageButton.addEventListener("click", nextPage)


    navigator.appendChild(pageNr)
    navigator.appendChild(nextPageButton)

    site.appendChild(navigator)
}


function addImageListeners() {
    forms = document.getElementsByClassName("openImageForm")
    for (i = 0; i < forms.length; i++) {
        forms[i].addEventListener("click", function () {
            console.log("clock");

            form = event.target.parentElement

            try {
				form.submit()
			}
			catch(e) {
				console.log(form.parentElement.parentElement)
				if (form.parentElement.parentElement.id == "right") {
					nextPage(form.parentElement.parentElement.parentElement)
				}
				else {
					previousPage(form.parentElement.parentElement.parentElement)
				}
			}
        })
    }
}

