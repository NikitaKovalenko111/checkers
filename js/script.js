const table = document.querySelector('.checkers-table')
const list_number = document.querySelector('.list-number')
const list_letter = document.querySelector('.list-letter')
const start_button = document.querySelector('.start-button')
const currentWayTeam = document.querySelector('.currentWayTeam')
const GameTimer = document.querySelectorAll('.time')
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

const checkWays = (e) => {
    const slotsHTML = document.querySelectorAll('.checkers-table-slot')
    currentWay = []
    let slot = null
    let x = parseInt(e.currentTarget.dataset.x)
    let y = parseInt(e.currentTarget.dataset.y)
    let checker = document.querySelector(`[data-x="${x}"][data-y="${y}"]`).children[0]
    slotsHTML.forEach((el) => {
        if (checker.classList.contains('black')) {
            if (currentTeamIsMoving === 'black') {
                if ((el.dataset.y - 1 == y && (x == el.dataset.x - 1 || el.dataset.x == x - 1)) || (el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                    if (el.children[0] == undefined && (el.dataset.y - 1 == y && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                        el.innerHTML = '<div class="way"></div>'
                        el.onclick = checkerIsMoving(x, y, 'black')
                    }
                    else if (el.children[0] != undefined) {
                        if (el.children[0].classList.contains('white')) {
                            slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) + 1 == y ? Number(el.dataset.y) - 1 : Number(el.dataset.y) + 1}"]`)
                            let slotX = slot.dataset.x
                            let slotY = slot.dataset.y
                            if (!!!slot.children[0]) {
                                slot.innerHTML = '<div class="way"></div>'
                                const checkerSlot = document.querySelector(`[data-x="${el.dataset.x}"][data-y="${el.dataset.y}"]`)
                                slot.onclick = checkerIsEating(x, y, 'black', 1, checkerSlot)
                                currentWay.push([slot.dataset.x, slot.dataset.y])
                                checkerSlots.push([el.dataset.x, el.dataset.y])
                                checkWaysTwice(slotX, slotY, 'black', [x, y])
                            }
                        }
                    }
                }
                else
                    clearWay(el.dataset.x, el.dataset.y)
            }
        }
        if (checker.classList.contains('white')) {
            if (currentTeamIsMoving === 'white') {
                if ((el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1)) || (el.dataset.y == y + 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1))) {
                    if (el.children[0] == undefined && ((el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1)))) {
                        el.innerHTML = '<div class="way"></div>'
                        el.onclick = checkerIsMoving(x, y, 'white')
                    }
                    else if (el.children[0] != undefined) {
                        if (el.children[0].classList.contains('black')) {
                            slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) - 1 == y ? Number(el.dataset.y) + 1 : Number(el.dataset.y) - 1}"]`)
                            let slotX = slot.dataset.x
                            let slotY = slot.dataset.y
                            if (slot) {
                                if (!!!slot.children[0]) {
                                    slot.innerHTML = '<div class="way"></div>'
                                    const checkerSlot = document.querySelector(`[data-x="${el.dataset.x}"][data-y="${el.dataset.y}"]`)
                                    slot.onclick = checkerIsEating(x, y, 'white', 1, checkerSlot)
                                    currentWay.push([slotX, slotY])
                                    checkerSlots.push([el.dataset.x, el.dataset.y])
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

const checkWaysTwice = (x, y, team, firstSlot) => {
    const slotsHTML = document.querySelectorAll('.checkers-table-slot')
    let slot = null
    slotsHTML.forEach((el) => {
        if (team === 'black') {
            if (currentTeamIsMoving === 'black') {
                if (el.dataset.y - 1 == y && (x == el.dataset.x - 1 || el.dataset.x == x - 1) ) {
                    if (el.children[0] != undefined) {
                        if (el.children[0].classList.contains('white')) {
                            slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) + 1}"]`)
                            let slotX = slot.dataset.x
                            let slotY = slot.dataset.y
                            if (!!!slot.children[0]) {
                                slot.innerHTML = '<div class="way"></div>'
                                slot.onclick = checkerIsEating(firstSlot[0], firstSlot[1], 'black', 2)
                                currentWay.push([slotX, slotY])
                                checkerSlots.push([el.dataset.x, el.dataset.y])
                            }
                        }
                    }
                }
                /*else
                    clearWay(el.dataset.x, el.dataset.y)*/
            }
        }
        else if (team === 'white') {
            if (currentTeamIsMoving === 'white') {
                if (el.dataset.y == y - 1 && (x == el.dataset.x - 1 || el.dataset.x == x - 1)) {
                    if (el.children[0] != undefined) {
                        if (el.children[0].classList.contains('black')) {
                            slot = document.querySelector(`[data-x="${Number(el.dataset.x) - 1 == x ? String(Number(el.dataset.x) + 1) : String(Number(el.dataset.x) - 1)}"][data-y="${Number(el.dataset.y) - 1}"]`)
                            if (slot) {
                                if (!!!slot.children[0]) {
                                    slot.innerHTML = '<div class="way"></div>'
                                    slot.onclick = checkerIsEating(firstSlot[0], firstSlot[1], 'white', 2)
                                    currentWay.push([slot.dataset.x, slot.dataset.y])
                                    checkerSlots.push([el.dataset.x, el.dataset.y])
                                }
                            }
                        }
                    }
                }
                /*else
                    clearWay(el.dataset.x, el.dataset.y)*/
            }
        }
    })
}

const checkerIsMoving = (previousX, previousY, team) => {
    const IsMovingHandler = (e) => {
        clearWays()
        clearWayTimer()
        StartWayTimer()
        const previousSlot = document.querySelector(`[data-x="${previousX}"][data-y="${previousY}"]`)
        previousSlot.innerHTML = ''
        e.currentTarget.innerHTML = `<div class='checker ${team}'></div>`
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
        alert('Победили белые!')
        spawnCheckers()
    }
    else if (countOfWhite === 0)  {
        alert('Победили черные!')
        spawnCheckers()
    }
}

const checkerIsEating = (previousX, previousY, team, countOfSteps, checkerSlotIfOne) => {
    return (e) => {
        if (checkerSlotIfOne) checkerSlotIfOne.innerHTML = ''
        else {
            let checkerSlotsBlock = checkerSlots.reverse().map((el, i, arr) => {
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
        checkerIsMoving(previousX, previousY, team)(e)
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
    start_button.addEventListener('click', spawnCheckers)
}
