const main_screen = document.querySelector('.main-screen')
const question = document.querySelector('.question')
const start_screen = document.querySelector('.start-screen')

const answers = document.querySelector('.answers')
const answer_buttons = document.querySelectorAll('.answer-button')
const start_button = document.querySelector('.start-button')
const skip = document.querySelector('.skip')
let result = document.querySelector('.result')

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) { // Цикл повторюється до тих пір, поки залишаються елементи для перемішування
        randomIndex = Math.floor(Math.random() * currentIndex); // Вибираємо елемент, що залишився.
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [    // Міняємо місцями з поточним елементом.
            array[randomIndex], array[currentIndex]];
    }
    return array; // Повертаємо перемішаний масив
}

function randint(min, max) {
    let number = Math.round(Math.random() * (max - min) + min)
    return number
}

function getRandomSign() {
    let signs = ['+', '-', '*', '/']
    return signs[randint(0, 3)]
}

class Question {
    constructor() {
        this.a = randint(1, 30)
        this.b = randint(1, 30)
        this.sign = getRandomSign()
        this.question = this.a + this.sign + this.b
        if (this.sign == '+') {
            this.correct = this.a + this.b
        } else if (this.sign == '-') {
            this.correct = this.a - this.b
        } else if (this.sign == '*') {
            this.correct = this.a * this.b
        } else if (this.sign == '/') {
            this.correct = Math.round(this.a / this.b)
        }
        this.answers = [
            this.correct,
            randint(this.correct - 15, this.correct - 1),
            randint(this.correct + 1, this.correct + 15),
            randint(this.correct - 15, this.correct - 1),
            randint(this.correct + 1, this.correct + 15),
        ]
        shuffle(this.answers)
    }
    display() {
        question.innerHTML = this.question
        for (let i = 0; i < this.answers.length; i += 1) {
            answer_buttons[i].innerHTML = this.answers[i]
        }
    }
}

skip.addEventListener('click', function () {
    start_screen.style.display = 'none'
    main_screen.style.display = 'flex'
    current_question = new Question()
    current_question.display()
    total_skip_answers += 1
})

let current_question = new Question()
current_question.display()
let correct_answers_counter = 0
let total_answers_counter = 0
let total_skip_answers = 0
let cookie = false
let cookies = document.cookie.split(';')

for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].split('=')[0] == 'result_cookie') {
        cookies = cookies[i].split('=')[1]
        cookie = true
        break
    }
}

if (cookie) {
    let data = cookies.split('/')
    result.innerHTML = `<h3 class="result">Минулого разу ви дали ${data[1]} правильних відповідей із ${data[0]}. Точність - ${correct_answers_counter * 100 / total_answers_counter}%.</h3>`
}


start_button.addEventListener("click", function () {
    start_screen.style.display = 'none'
    main_screen.style.display = 'flex'
    current_question = new Question()
    current_question.display()
    correct_answers_counter = 0
    total_answers_counter = 0

    let time = 60
    const countDownEl = document.getElementById("timer")

    setInterval(updateCountdown, 1000)

    function updateCountdown() {
        const minutes = Math.floor(time / 60)
        let seconds = time % 60
        seconds = seconds < 10 ? "0" + seconds :
            seconds
        countDownEl.innerHTML = `${minutes}:${seconds}`
        time--
    }

    setTimeout(function () {
        let new_cookie = `result_cookie=${correct_answers_counter}/${total_answers_counter}; max-age=10000000000`
        document.cookie = new_cookie
        let accuracy = Math.round(correct_answers_counter * 100 / total_answers_counter)
        let result = document.querySelector('.result')
        result.innerHTML = (`Правильно: ${correct_answers_counter}
    Усього: ${total_answers_counter}
    Точність: ${accuracy} %
    Пропущено: ${total_skip_answers}`)
        start_screen.style.display = 'flex'
        main_screen.style.display = 'none'
    }, 62000)
})

answer_buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (button.innerHTML == current_question.correct) {
            correct_answers_counter += 1
            button.style.background = '#51f542'
            anime({
                targets: button,
                background: 'linear-gradient(90deg, #D9D9D9 15%, #737373 100%)',
                keyframes: [
                    { borderRadius: 0 },
                    { borderRadius: '50% 50%' },
                    { borderRadius: '50% 20%' },
                    { borderRadius: '20% 20%' },
                    { borderRadius: '50% 50%' },
                    { borderRadius: '0% 0%' }
                ],
                duration: 500,
                delay: 100,
                easing: 'linear'
            })
        } else {
            button.style.background = '#f50202'
            anime({
                targets: button,
                background: 'linear-gradient(90deg, #D9D9D9 15%, #737373 100%)',
                keyframes: [
                    { borderRadius: 0 },
                    { borderRadius: '50% 50%' },
                    { borderRadius: '50% 20%' },
                    { borderRadius: '20% 20%' },
                    { borderRadius: '50% 50%' },
                    { borderRadius: '0% 0%' }
                ],
                duration: 500,
                delay: 100,
                easing: 'linear'
            })
        }
        total_answers_counter += 1
        current_question = new Question()
        current_question.display()
    })
})