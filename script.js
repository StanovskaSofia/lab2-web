let questions = [];

async function fetchQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();

    init();
}

fetchQuestions();
const welcomeScreen = document.getElementById('welcomeScreen');
const quizContainer = document.getElementById('quizContainer');
const nameInput = document.getElementById('nameInput');
const startBtn = document.getElementById('startBtn');
const navigationDiv = document.getElementById('navigation');
const questionContainer = document.getElementById('questionContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resultContainer = document.getElementById('resultContainer');
const userNameElement = document.getElementById('userName');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const previousResult = document.getElementById('previousResult');
const previousName = document.getElementById('previousName');
const previousScore = document.getElementById('previousScore');
const previousDate = document.getElementById('previousDate');
const serverStatus = document.getElementById('serverStatus');

const jsonServerUrl = 'http://localhost:3000/results';

let currentQuestionIndex = 0;
let userName = "";
let userAnswers = Array(questions.length).fill(null);

function init() {
    startBtn.addEventListener('click', startQuiz);
    prevBtn.addEventListener('click', goToPrevQuestion);
    nextBtn.addEventListener('click',goToNextQuestion);
    restartBtn.addEventListener('click', restartQuiz);

    for (let i = 0; i < questions.length; i++) {
        const navButton = document.createElement('button');
        navButton.classList.add('nav-button');
        navButton.textContent = i + 1;
        navButton.addEventListener('click', () => goToQuestion(i));
        navigationDiv.appendChild(navButton);
    }
}

function startQuiz() {
    userName = nameInput.value.trim();
    if (userName === "") {
        alert("Будь ласка, введіть своє ім'я");
        return;
    }

    welcomeScreen.style.display = 'none';
    quizContainer.style.display = 'block';

    loadQuestion(currentQuestionIndex);
    updateNavigation();
    updateButtons();
}

function loadQuestion(index) {
    const question = questions[index];
    questionContainer.innerHTML = '';

    const questionTitle = document.createElement('h2');
    questionTitle.textContent = `Питання ${index + 1}: ${question.question}`;
    questionContainer.appendChild(questionTitle);

    if (question.image) {
        const imageElement = document.createElement('img');
        imageElement.src = question.image;
        imageElement.alt = `Зображення до питання ${index + 1}`;
        imageElement.classList.add('question-image');
        questionContainer.appendChild(imageElement);
    }

    const optionsList = document.createElement('ul');
    optionsList.classList.add('options');

    question.options.forEach((option, optIndex) => {
        const optionItem = document.createElement('li');
        optionItem.classList.add('option');
        optionItem.textContent = option;

        if (userAnswers[index] === optIndex) {
            optionItem.classList.add('selected');
        }

        optionItem.addEventListener('click', () => selectOption(index, optIndex));
        optionsList.appendChild(optionItem);
    });

    questionContainer.appendChild(optionsList);
}

function selectOption(questionIndex, optionIndex) {
    userAnswers[questionIndex] = optionIndex;

    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));

    const selectedOption = document.querySelectorAll('.option')[optionIndex];
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
        updateNavigation();
        updateButtons();
    } else {
        showResults();
    }
}

function goToPrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
        updateNavigation();
        updateButtons();
    }
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    loadQuestion(currentQuestionIndex);
    updateNavigation();
    updateButtons();
}

function updateNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === currentQuestionIndex) {
            btn.classList.add('active');
        }
    });
}

function updateButtons() {
    prevBtn.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';

    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Завершити';
    } else {
        nextBtn.textContent = 'Наступне питання';
    }
}

