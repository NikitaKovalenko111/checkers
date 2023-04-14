const table = document.querySelector('.checkers-table')
const list_number = document.querySelector('.list-number')
const list_letter = document.querySelector('.list-letter')
const start_button = document.querySelectorAll('.start-button')
const currentWayTeam = document.querySelector('.currentWayTeam')
const GameTimer = document.querySelectorAll('.time')
const endGameTime = document.querySelector('.endtime')
const popup = document.querySelector('.popup__inner')
const popupWinner = document.querySelector('.popup-winner')
let wayTimerInterval = null
let gameTimerInterval = null
let counter = 0
let checkerSlots = []

let slots = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
]

let currentWay = []
let currentTeamIsMoving = 'white'

const deleteCheckers = () => {
    const slotsHTML = document.querySelectorAll('.checkers-table-slot')
    slotsHTML.forEach(el => {
        el.innerHTML = ''
    })
}

const spawnCheckers = () => {
    checkerSlots = []
    clearWays()
    deleteCheckers()
    clearGameTime()
    clearWayTimer()
    currentTeamIsMoving = 'white'
    startGameTime()
    StartWayTimer()
    const slotsHTML = document.querySelectorAll('.checkers-table-slot')
    slotsHTML.forEach(el => {
        el.removeEventListener('click', checkWays)
        el.addEventListener('click', checkWays)
        if (!el.classList.contains('black') && (el.dataset.y <= 3 || (el.dataset.y >= 6 && el.dataset.y <= 8))) {
            if (el.dataset.y <= 3) el.innerHTML =  `<div class='checker black'></div>`
            else if (el.dataset.y >= 6 && el.dataset.y <= 8) el.innerHTML =  `<div class='checker white'></div>`
        }
    })
}

const quitGame = () => {
    checkerSlots = []
    clearWays()
    deleteCheckers()
    clearGameTime()
    clearWayTimer()
}

const startGameTime = () => {
    let minutes = 0
    let seconds = 0
    let format = `0:0`
    GameTimer[0].innerHTML = format

    gameTimerInterval = setInterval(() => {
        seconds++
        if (seconds % 60 === 0) {
            minutes++
            seconds = 0
        }
        format = `${minutes}:${seconds}`
        GameTimer[0].innerHTML = format
    }, 1000)
}

const clearWayTimer = () => {
    if (GameTimer[1].classList.contains('red')) GameTimer[1].classList.remove('red')
    clearInterval(wayTimerInterval)
}

const StartWayTimer = () => {
    clearWayTimer()
    let wayTime = 20
    GameTimer[1].innerHTML = wayTime

    wayTimerInterval = setInterval(() => {
        if (wayTime <= 6) GameTimer[1].classList.add('red')
        if (wayTime === 0) {
            currentTeamIsMoving == 'white' ? currentTeamIsMoving = 'black' : currentTeamIsMoving = 'white'
            currentTeamIsMoving == 'white' ? currentWayTeam.innerHTML = 'ХОД БЕЛЫХ' : currentWayTeam.innerHTML = 'ХОД ЧЁРНЫХ'
            clearWays()
            clearWayTimer()
            StartWayTimer()
        }
        else {
            wayTime--
            GameTimer[1].innerHTML = wayTime
        }
    }, 1000)
}

const clearGameTime = () => {
    clearInterval(gameTimerInterval)
}

const generateWaysSlotsForQueen = (x, y) => {
    let slots = [[], [], [], []]
    let endOfWaysArr = [0, 0, 0, 0]
    let counter = 1
    while (counter <= 8) {
        if (!!document.querySelector(`[data-x="${x + counter}"][data-y="${y + counter}"]`) && endOfWaysArr[0] !== 1) {
            if ((!!document.querySelector(`[data-x="${x + counter}"][data-y="${y + counter}"]`).children[0] && !document.querySelector(`[data-x="${x + counter}"][data-y="${y + counter}"]`).children[0].classList.contains(currentTeamIsMoving)) || !!!document.querySelector(`[data-x="${x + counter}"][data-y="${y + counter}"]`).children[0]) {
                slots[0].push(document.querySelector(`[data-x="${x + counter}"][data-y="${y + counter}"]`))
            }
            else if (!!document.querySelector(`[data-x="${x + counter}"][data-y="${y + counter}"]`).children[0] && document.querySelector(`[data-x="${x + counter}"][data-y="${y + counter}"]`).children[0].classList.contains(currentTeamIsMoving))
                endOfWaysArr[0] = 1
        }
        if (!!document.querySelector(`[data-x="${x - counter}"][data-y="${y + counter}"]`) && endOfWaysArr[1] !== 1) {
            if ((!!document.querySelector(`[data-x="${x - counter}"][data-y="${y + counter}"]`).children[0] && !document.querySelector(`[data-x="${x - counter}"][data-y="${y + counter}"]`).children[0].classList.contains(currentTeamIsMoving)) || !!!document.querySelector(`[data-x="${x - counter}"][data-y="${y + counter}"]`).children[0]) {
                slots[1].push(document.querySelector(`[data-x="${x - counter}"][data-y="${y + counter}"]`))
            }
            else if (!!document.querySelector(`[data-x="${x - counter}"][data-y="${y + counter}"]`).children[0] && document.querySelector(`[data-x="${x - counter}"][data-y="${y + counter}"]`).children[0].classList.contains(currentTeamIsMoving))
                endOfWaysArr[1] = 1
        }
        if (!!document.querySelector(`[data-x="${x + counter}"][data-y="${y - counter}"]`) && endOfWaysArr[2] !== 1) {
            if ((!!document.querySelector(`[data-x="${x + counter}"][data-y="${y - counter}"]`).children[0] && !document.querySelector(`[data-x="${x + counter}"][data-y="${y - counter}"]`).children[0].classList.contains(currentTeamIsMoving)) || !!!document.querySelector(`[data-x="${x + counter}"][data-y="${y - counter}"]`).children[0])
                slots[2].push(document.querySelector(`[data-x="${x + counter}"][data-y="${y - counter}"]`))
            else if (!!document.querySelector(`[data-x="${x + counter}"][data-y="${y - counter}"]`).children[0] && document.querySelector(`[data-x="${x + counter}"][data-y="${y - counter}"]`).children[0].classList.contains(currentTeamIsMoving))
                endOfWaysArr[2] = 1
        }
        if (!!document.querySelector(`[data-x="${x - counter}"][data-y="${y - counter}"]`) && endOfWaysArr[3] !== 1) {
            if ((!!document.querySelector(`[data-x="${x - counter}"][data-y="${y - counter}"]`).children[0] && !document.querySelector(`[data-x="${x - counter}"][data-y="${y - counter}"]`).children[0].classList.contains(currentTeamIsMoving)) || !!!document.querySelector(`[data-x="${x - counter}"][data-y="${y - counter}"]`).children[0])
                slots[3].push(document.querySelector(`[data-x="${x - counter}"][data-y="${y - counter}"]`))
            else if (!!document.querySelector(`[data-x="${x - counter}"][data-y="${y - counter}"]`).children[0] && document.querySelector(`[data-x="${x - counter}"][data-y="${y - counter}"]`).children[0].classList.contains(currentTeamIsMoving))
                endOfWaysArr[3] = 1
        }
        counter++
    }
    return [...slots]
}

const checkWays = (e) => {
    const slotsHTML = document.querySelectorAll('.checkers-table-slot')
    currentWay = []
    let slot = null
    let x = parseInt(e.currentTarget.dataset.x)
    let y = parseInt(e.currentTarget.dataset.y)
    let checker = document.querySelector(`[data-x="${x}"][data-y="${y}"]`).children[0]
    if (checker && checker.classList.contains('queen')) {
        checkerSlots = []
        slotsHTML.forEach(el => {
            clearWay(el.dataset.x, el.dataset.y)
        })
        let slots = generateWaysSlotsForQueen(x, y)
        slots.forEach((el) => {
            let endOfWays = false
            el.forEach((elS, k, arrS) => {
               if (elS !== null && !endOfWays) {
                    currentWay.push([elS.dataset.x, elS.dataset.y])
                    if (checker.classList.contains('black')) {
                        if (currentTeamIsMoving === 'black') {
                            if (!!!elS.children[0]) {
                                elS.innerHTML = '<div class="way"></div>'
                                elS.onclick = checkerIsMoving(x, y, 'black', true)
                                }
                            else if (!!elS.children[0]) {
                                if (k === 0 || (arrS[k - 1] && arrS[k + 1])) {
                                    if (k >= 1 && arrS[k - 1].children[0].classList.contains('checker') && !!elS.children[0] && !elS.children[0].classList.contains('way'))
                                        endOfWays = true
                                    else if (!!arrS[k + 1] && !!!arrS[k + 1].children[0]) {
                                        if (!elS.children[0].classList.contains('way')) 
                                            checkerSlots.push([elS.dataset.x, elS.dataset.y])
                                        arrS[k + 1].innerHTML = '<div class="way"></div>'
                                        arrS[k + 1].onclick = checkerIsEating(x, y, 'black', checkerSlots.length, undefined, true)
                                        checkWaysTwice(Number(arrS[k + 1].dataset.x), Number(arrS[k + 1].dataset.y), 'black', checker.parentElement, true)
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (currentTeamIsMoving === 'white') {
                            if (!!!elS.children[0]) {
                                elS.innerHTML = '<div class="way"></div>'
                                elS.onclick = checkerIsMoving(x, y, 'white', true)
                            }
                            else if (!!elS.children[0]) {
                                if (k === 0 || (arrS[k - 1] && arrS[k + 1])) {
                                    if (k >= 1 && arrS[k - 1].children[0].classList.contains('checker') && !!elS.children[0] && !elS.children[0].classList.contains('way'))
                                        endOfWays = true
                                    else if (!!arrS[k + 1] && !!!arrS[k + 1].children[0]) {
                                        if (!elS.children[0].classList.contains('way')) 
                                            checkerSlots.push([elS.dataset.x, elS.dataset.y])
                                        arrS[k + 1].innerHTML = '<div class="way"></div>'
                                        arrS[k + 1].onclick = checkerIsEating(x, y, 'white', checkerSlots.length, undefined, true)
                                        checkWaysTwice(Number(arrS[k + 1].dataset.x), Number(arrS[k + 1].dataset.y), 'white', checker.parentElement, true)
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
    }
    else {
        slotsHTML.forEach((el) => {
            if (checker && checker.classList.contains('black')) {
                if (currentTeamIsMoving === 'black') {
                    if ((el.dataset.y - 1 == y && (x == el.dataset.x - 1 || el.dataset.x == x - 1)) || (el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                        if (el.children[0] == undefined && (el.dataset.y - 1 == y && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                            el.innerHTML = '<div class="way"></div>'
                            el.onclick = checkerIsMoving(x, y, 'black')
                        }
                        else if (el.children[0] != undefined) {
                            if (el.children[0].classList.contains('white')) {
                                slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) + 1 == y ? Number(el.dataset.y) - 1 : Number(el.dataset.y) + 1}"]`)
                                if (slot) {
                                    let slotX = slot.dataset.x
                                    let slotY = slot.dataset.y
                                    if (!!!slot.children[0]) {
                                        slot.innerHTML = '<div class="way"></div>'
                                        const checkerSlot = document.querySelector(`[data-x="${el.dataset.x}"][data-y="${el.dataset.y}"]`)
                                        checkerSlots.push([el.dataset.x, el.dataset.y])
                                        slot.onclick = checkerIsEating(x, y, 'black', checkerSlots.length, checkerSlot)
                                        currentWay.push([slot.dataset.x, slot.dataset.y])
                                        checkWaysTwice(slotX, slotY, 'black', [x, y])
                                    }
                                }
                            }
                        }
                    }
                    else
                        clearWay(el.dataset.x, el.dataset.y)
                }
            }
            if (checker && checker.classList.contains('white')) {
                if (currentTeamIsMoving === 'white') {
                    if ((el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1)) || (el.dataset.y == y + 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                        if (el.children[0] == undefined && ((el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1)))) {
                            el.innerHTML = '<div class="way"></div>'
                            el.onclick = checkerIsMoving(x, y, 'white')
                        }
                        else if (el.children[0] != undefined) {
                            if (el.children[0].classList.contains('black')) {
                                slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) - 1 == y ? Number(el.dataset.y) + 1 : Number(el.dataset.y) - 1}"]`)
                                if (slot) {
                                    let slotX = slot.dataset.x
                                    let slotY = slot.dataset.y
                                    if (!!!slot.children[0]) {
                                        slot.innerHTML = '<div class="way"></div>'
                                        const checkerSlot = document.querySelector(`[data-x="${el.dataset.x}"][data-y="${el.dataset.y}"]`)
                                        checkerSlots.push([el.dataset.x, el.dataset.y])
                                        slot.onclick = checkerIsEating(x, y, 'white', checkerSlots.length, checkerSlot)
                                        currentWay.push([slotX, slotY])
                                        checkWaysTwice(slotX, slotY, 'white', [x, y])
                                    }
                                }
                            }
                        }
                    }
                    else clearWay(el.dataset.x, el.dataset.y)
                }
            }
        })
    }
}

const checkWaysTwice = (x, y, team, firstSlot, isQueen) => {
    if (isQueen) {
        if (team === 'black') {
            if (currentTeamIsMoving === 'black') {
                let slots = generateWaysSlotsForQueen(x, y)
                let modifiedSlots = [[], [], [], []]
                slots.forEach((el, i) => {
                    let isApproach = false
                    let currentElem = null
                    let currentElemK = null
                    el.forEach((el2, k, arr2) => {
                        if (!isApproach) {
                            slots.forEach((el3, n) => {
                                if (el3.filter(elem => elem == currentElem)[0])
                                    modifiedSlots[i] = el3.filter((elem, j) => j >= currentElemK && currentI == n)
                            })
                        }
                        if (!!el2.children[0] && ((arr2[k + 1] && arr2[k + 1].children[0]) || arr2[k + 1] == undefined)) {
                            if (el2.children[0].classList.contains('checker') && (arr2[k + 1] == undefined || arr2[k + 1].children[0].classList.contains('checker')))
                                isApproach = true
                        }
                        else if (el2 && el2.children[0] && el2.children[0].classList.contains('checker') && !isApproach) {
                            currentElem = el2
                            currentElemK = k
                            currentI = i
                        }
                    })
                })
                modifiedSlots.forEach(el => {
                    el.forEach((el2) => {
                        if (el2 && el2.children[0] && el2.children[0].classList.contains('checker'))
                            checkerSlots.push([el2.dataset.x, el2.dataset.y])
                        else {
                            el2.innerHTML = '<div class="way"></div>'
                            el2.onclick = checkerIsEating(firstSlot.dataset.x, firstSlot.dataset.y, 'black', checkerSlots.length, undefined, true)
                            checkWaysTwice(Number(el2.dataset.x), Number(el2.dataset.y), 'black', firstSlot, true)
                        }
                    })
                })
            }
        }
        else if (team === 'white') {
            if (currentTeamIsMoving === 'white') {
                let slots = generateWaysSlotsForQueen(x, y)
                    let modifiedSlots = [[], [], [], []]
                    slots.forEach((el, i) => {
                        let isApproach = false
                        let currentElem = null
                        let currentElemK = null
                        el.forEach((el2, k, arr2) => {
                            if (!isApproach) {
                                slots.forEach((el3, n) => {
                                    if (el3.filter(elem => elem == currentElem)[0])
                                        modifiedSlots[i] = el3.filter((elem, j) => j >= currentElemK && currentI == n)
                                })
                            }
                            if (!!el2.children[0] && ((arr2[k + 1] && arr2[k + 1].children[0]) || arr2[k + 1] == undefined)) {
                                if (el2.children[0].classList.contains('checker') && (arr2[k + 1] == undefined || arr2[k + 1].children[0].classList.contains('checker')))
                                    isApproach = true
                            }
                            else if (el2 && el2.children[0] && el2.children[0].classList.contains('checker') && !isApproach) {
                                currentElem = el2
                                currentElemK = k
                                currentI = i
                            }
                        })
                    })
                    modifiedSlots.forEach(el => {
                        el.forEach((el2) => {
                            if (el2 && el2.children[0] && el2.children[0].classList.contains('checker'))
                                checkerSlots.push([el2.dataset.x, el2.dataset.y])
                            else {
                                el2.innerHTML = '<div class="way"></div>'
                                el2.onclick = checkerIsEating(firstSlot.dataset.x, firstSlot.dataset.y, 'white', checkerSlots.length, undefined, true)
                                checkWaysTwice(Number(el2.dataset.x), Number(el2.dataset.y), 'white', firstSlot, true)
                            }
                        })
                    })
            }
        }
    }
    else {
        const slotsHTML = document.querySelectorAll('.checkers-table-slot')
        let slot = null
        slotsHTML.forEach((el) => {
            if (team === 'black') {
                if (currentTeamIsMoving === 'black') {
                    if ((el.dataset.y - 1 == y && (x == el.dataset.x - 1 || el.dataset.x == x - 1)) || (el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                        if (el.children[0] != undefined) {
                            if (el.children[0].classList.contains('white')) {
                                slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) + 1 == y ? Number(el.dataset.y) - 1 : Number(el.dataset.y) + 1}"]`)
                                if (slot) {
                                    let slotX = slot.dataset.x
                                    let slotY = slot.dataset.y
                                    if (!!!slot.children[0]) {
                                        slot.innerHTML = '<div class="way"></div>'
                                        checkerSlots.push([el.dataset.x, el.dataset.y])
                                        slot.onclick = checkerIsEating(firstSlot[0], firstSlot[1], 'black', checkerSlots.length)
                                        currentWay.push([slotX, slotY])
                                        checkWaysTwice(slotX, slotY, 'black', firstSlot)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (team === 'white') {
                if (currentTeamIsMoving === 'white') {
                    if ((el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1)) || (el.dataset.y == y + 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                        if (el.children[0] != undefined) {
                            if (el.children[0].classList.contains('black')) {
                                slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) + 1 == y ? Number(el.dataset.y) - 1 : Number(el.dataset.y) + 1}"]`)
                                if (slot) {
                                    let slotX = slot.dataset.x
                                    let slotY = slot.dataset.y
                                    if (!!!slot.children[0]) {
                                        slot.innerHTML = '<div class="way"></div>'
                                        checkerSlots.push([el.dataset.x, el.dataset.y])
                                        slot.onclick = checkerIsEating(firstSlot[0], firstSlot[1], 'white', checkerSlots.length)
                                        currentWay.push([slotX, slotY])
                                        checkWaysTwice(Number(slotX), Number(slotY), 'white', firstSlot)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}

const checkerIsMoving = (previousX, previousY, team, isQueen) => {
    const IsMovingHandler = (e) => {
        clearWays()
        clearWayTimer()
        StartWayTimer()
        const previousSlot = document.querySelector(`[data-x="${previousX}"][data-y="${previousY}"]`)
        previousSlot.innerHTML = ''
        e.currentTarget.innerHTML = `<div class='checker ${team} ${isQueen ? 'queen' : ''}'></div>`
        checkQueens()
        currentTeamIsMoving == 'white' ? currentTeamIsMoving = 'black' : currentTeamIsMoving = 'white'
        currentTeamIsMoving == 'white' ? currentWayTeam.innerHTML = 'ХОД БЕЛЫХ' : currentWayTeam.innerHTML = 'ХОД ЧЁРНЫХ'
    }
    return IsMovingHandler
}

const checkWinners = () => {
    const slotsHTML = document.querySelectorAll('.checkers-table-slot')
    let countOfBlack = 0
    let countOfWhite = 0
    slotsHTML.forEach(el => {
        if (!!el.children[0]) {
            if (el.children[0].classList.contains('black')) countOfBlack++
            else if (el.children[0].classList.contains('white')) countOfWhite++
        }
    })
    if (countOfBlack === 0) {
        popup.parentElement.classList.toggle('hidden')
        endGameTime.textContent = GameTimer[0].textContent
        popupWinner.textContent = "Победили белые"
        quitGame()
    }
    else if (countOfWhite === 0)  {
        popup.parentElement.classList.toggle('hidden')
        endGameTime.textContent = GameTimer[0].textContent
        popupWinner.textContent = "Победили чёрные"
        quitGame()
    }
}

const checkQueens = () => {
    const slotsBlack = document.querySelectorAll(`[data-y="1"]`)
    const slotsWhite = document.querySelectorAll(`[data-y="8"]`)
    slotsBlack.forEach(el => {
        if (!!el.children[0]) {
            if (el.children[0].classList.contains('white')) {
                if (!el.children[0].classList.contains('queen')) el.children[0].classList.add('queen')
            }
        }
    })
    slotsWhite.forEach(el => {
        if (!!el.children[0]) {
            if (el.children[0].classList.contains('black')) {
                if (!el.children[0].classList.contains('queen')) el.children[0].classList.add('queen')
            }
        }
    })
}

const checkerIsEating = (previousX, previousY, team, countOfSteps, checkerSlotIfOne, isQueen) => {
    return (e) => {
        if (checkerSlotIfOne) checkerSlotIfOne.innerHTML = ''
        else {
            let checkerSlotsBlock = checkerSlots.map((el, i, arr) => {
                if (countOfSteps === 1) {
                    if (i === arr.length - 1) {
                        return document.querySelector(`[data-x="${el[0]}"][data-y="${el[1]}"]`)
                    }
                }
                else if (i < countOfSteps) return document.querySelector(`[data-x="${el[0]}"][data-y="${el[1]}"]`)
            })
            checkerSlotsBlock.forEach(el => {
                if (el != undefined) el.innerHTML = ''
            })
        }
        checkerIsMoving(previousX, previousY, team, isQueen)(e)
        checkerSlots = []
        checkWinners()
        clearWays()
    }
}

const clearWays = () => {
    const slotsHTML = document.querySelectorAll('.checkers-table-slot')
    currentWay = []
    slotsHTML.forEach(el => {
        if (!!el.children[0]) {
            if (el.children[0].classList.contains('way')) {
                el.onclick = null
                el.innerHTML = ''
            }
        }
    })
}

const clearWay = (x, y) => {
    const slot = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    let isCurrentWay = false
    currentWay.forEach(el => {
        if (el[0] == x && el[1] == y) isCurrentWay = true
    })
    if (!!slot.children[0]) {
        if (!slot.children[0].classList.contains('checker')) {
            if (isCurrentWay != true) {
                slot.onclick = null
                slot.innerHTML = ''
            }
        }
    }
}

if (!!table) {
    popup.addEventListener('click', (e) => {
        e.currentTarget.parentElement.classList.toggle('hidden')
    })
    let counter = 0
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    slots.forEach((el, i) => {
        list_number.innerHTML += `<li><span>${i + 1}</span></li>`
        el.forEach((el2, k) => {
            counter++
            table.innerHTML += `<div data-x='${k + 1}' data-y='${i + 1}' class='checkers-table-slot ${counter % 2 !== 0 && i % 2 === 0 ? 'black' : counter % 2 === 0 && i % 2 !== 0 ? 'black' : ''}'></div`
        })
    })
    letters.forEach(el => {
        list_letter.innerHTML += `<li><span>${el}</span></li>`
    })
}

if (!!start_button) {
    start_button.forEach(el => {
        if (el.parentElement.classList.contains('popup__content')) {
            el.addEventListener('click', () => {
                spawnCheckers()
                popup.parentElement.classList.toggle('hidden')
            })
        }
        else
            el.addEventListener('click', spawnCheckers)
    })
}
