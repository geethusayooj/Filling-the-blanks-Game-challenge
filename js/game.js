class Question {
    constructor(question,choices,answer,timeLimit,timeRemaining) {
        this.question = question; 
        this.choices = choices;
        this.answer = answer;
        this.timeLimit = timeLimit;
        this.timeRemaining = timeRemaining;
    }

    checkAnswer(userInput){
        this.answer === userInput;
    }
}

class Game {
    constructor(){
        this.questions = [];
        this.currentQuestion = 0;
        this.rightAnswers = 0;
    }

    addQuestion(question){
        this.questions = question
    }

    currentRightAnswers(){
        this.rightAnswers = this.rightAnswers + 1
    }

    gotoNextQuestion (){
        this.currentQuestion = this.currentQuestion + 1
    }
}





