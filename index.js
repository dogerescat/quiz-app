"use strict";
{
  class Main {
    constructor() {
      this.h1 = document.querySelector("h1");
      this.questionElement = document.getElementById("question");
      this.answersElement = document.getElementById("answers");
      this.startButton = document.getElementById("start");
      this.gameState = {
        quizzs: [],
        index: 0,
        successNum: 0,
      };
      this.onClickButton();
    }
    
    onClickButton() {
      this.startButton.addEventListener("click", this.setFetchData.bind(this));
    }

    setFetchData() {
      this.gettingTitle();
      const data = new FetchData(
        this.questionElement,
        this.answersElement,
        this.gameState,
        this.startButton,
        this.h1
      );
      data.setMessage();
      data.getData();
    }

    gettingTitle(){
      const title = new Title(this.h1, "取得中");
      title.setElement();

    }
  }
  class Title {
    constructor(el, message) {
      this.h1 = el;
      this.message = message;
      this.delete();
    }

    setElement() {
      this.title = document.createElement("p");
      this.title.appendChild(document.createTextNode(this.message));
      this.h1.appendChild(this.title);
    }

    delete() {
      this.h1.removeChild(this.h1.firstChild);
    }
  }

  class QuestionTitle extends Title {
    constructor(el, message, gameState) {
      super(el, message);
      this.questionCount = gameState.index + 1;
      this.questionNum = document.createElement("p");
    }

    setTitle() {
      this.questionNum.appendChild(
        document.createTextNode(this.message + this.questionCount)
      );
      this.h1.appendChild(this.questionNum);
    }

    delete() {
      super.delete();
    }
  }

  class FetchData {
    constructor(question, answers, gameState, startButton, el) {
      this.questionElement = question;
      this.answersElement = answers;
      this.gameState = gameState;
      this.startButton = startButton;
      this.h1 = el;
      this.delete();
    }

    delete() {
      this.questionElement.removeChild(this.questionElement.firstElementChild);
      this.startButton.remove();
    }

    setMessage() {
      this.message = document.createElement("p");
      this.message.setAttribute("class", "question");
      this.message.appendChild(document.createTextNode("少々お待ちください"));
      this.questionElement.appendChild(this.message);
    }

    getData() {
      fetch("https://opentdb.com/api.php?amount=10")
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          this.gameState.quizzs = data.results;

          const questionNumber = new QuestionTitle(
            this.h1,
            "問題",
            this.gameState
          );
          questionNumber.setTitle();
          const createQuestion = new CreateQuestion(
            this.gameState,
            this.questionElement
          );
          createQuestion.checkcChildNodes();
          createQuestion.makeQuestionElement();
          const createAnswer = new CreateAnswer(
            this.answersElement,
            this.gameState,
            this.h1,
            this.questionElement
          );
          createAnswer.checkcChildNodes();
          createAnswer.makeAnswerElement();
        });
    }
  }

  class CreateQuestion {
    constructor(gameState, question) {
      this.quizzs = gameState.quizzs;
      this.index = gameState.index;
      this.questionElement = question;
    }

    checkcChildNodes() {
      if (this.questionElement.hasChildNodes()) {
        this.delete();
      }
    }

    delete() {
      while (this.questionElement.firstChild) {
        this.questionElement.removeChild(this.questionElement.firstChild);
      }
    }

    makeQuestionElement() {
      const genre = document.createElement("p");
      const level = document.createElement("p");
      const questionText = document.createElement("p");
      questionText.setAttribute("class", "question");
      genre.appendChild(
        document.createTextNode("[ジャンル]" + this.quizzs[this.index].category)
      );
      level.appendChild(
        document.createTextNode("[難易度]" + this.quizzs[this.index].difficulty)
      );
      questionText.appendChild(
        document.createTextNode(this.quizzs[this.index].question)
      );
      this.questionElement.appendChild(genre);
      this.questionElement.appendChild(level);
      this.questionElement.appendChild(questionText);
    }
  }

  class CreateAnswer {
    constructor(answers, gameState, el, question) {
      this.gameState = gameState;
      this.quizzs = gameState.quizzs;
      this.index = gameState.index;
      this.successNum = gameState.successNum;
      this.answersElement = answers;
      this.correctAnswer = this.quizzs[this.index].correct_answer;
      this.h1 = el;
      this.questionElement = question;
      this.array = [];
    }

    checkcChildNodes() {
      if (this.answersElement.hasChildNodes()) {
        this.delete();
      }
      if (this.array.length !== 0) {
        this.array.length = 0;
      }
    }

    delete() {
      while (this.answersElement.firstChild) {
        this.answersElement.removeChild(this.answersElement.firstChild);
      }
    }

    makeAnswerElement() {
      this.array.push(this.correctAnswer);
      let answers = this.array.concat(
        this.quizzs[this.index].incorrect_answers
      );
      answers = this.shuffle(answers);
      this.createButton(answers);
    }

    shuffle(answers) {
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = answers[i];
        answers[i] = answers[j];
        answers[j] = tmp;
      }
      return answers;
    }

    createButton(answers) {
      answers.forEach((answer) => {
        let choiceList = document.createElement("li");
        let answersButton = document.createElement("button");
        answersButton.appendChild(document.createTextNode(answer));
        answersButton.addEventListener("click", (e) => {
          this.setNextQuestion(e, this.correctAnswer);
        });
        choiceList.appendChild(answersButton);
        this.answersElement.appendChild(choiceList);
      });
    }

    setNextQuestion(e, answer) {
      this.indexCount.call(main, e, answer);
      if (main.gameState.index === 10) {
        const resultPage = this.createResultPage();
        resultPage.setResultMessage();
        resultPage.setMessage();
        resultPage.setHomeButton();
        return;
      } else {
        const questionNumber = new QuestionTitle(
          this.h1,
          "問題",
          this.gameState
        );
        questionNumber.setTitle();
        const createQuestion = new CreateQuestion(
          this.gameState,
          this.questionElement
        );
        createQuestion.checkcChildNodes();
        createQuestion.makeQuestionElement();
        const createAnswer = new CreateAnswer(
          this.answersElement,
          this.gameState,
          this.h1,
          this.questionElement
        );
        createAnswer.checkcChildNodes();
        createAnswer.makeAnswerElement();
      }
    }
    
    createResultPage() {
      return new ResultPage(
        this.successNum,
        this.h1,
        this.questionElement,
        this.answersElement
      );
    }

    indexCount(e, answer) {
      if (e.currentTarget.innerHTML === answer) {
        this.gameState.successNum++;
      }
      this.gameState.index++;
    }
  }

  class ResultPage {
    constructor(successNum, el, question, answers) {
      this.resultsText = document.createElement("p");
      this.homeButton = document.createElement("button");
      this.successNum = successNum;
      this.h1 = el;
      this.questionElement = question;
      this.answersElement = answers;
      this.deleteTitle();
      this.deleteQuestion();
      this.deleteAnswerButton();
    }

    deleteTitle() {
      this.h1.removeChild(this.h1.firstChild);
    }

    deleteQuestion() {
      while (this.questionElement.firstChild) {
        this.questionElement.removeChild(this.questionElement.firstChild);
      }
    }

    deleteAnswerButton() {
      while (this.answersElement.firstChild) {
        this.answersElement.removeChild(this.answersElement.firstChild);
      }
    }

    setResultMessage() {
      this.resultsText.appendChild(
        document.createTextNode("あなたの正答数は" + this.successNum + "です！")
      );
      this.h1.appendChild(this.resultsText);
    }

    setMessage() {
      const comment = document.createElement("p");
      comment.setAttribute("class", "question");
      comment.appendChild(
        document.createTextNode("再チャレンジしたい場合は以下をクリック")
      );
      this.questionElement.appendChild(comment);
    }

    setHomeButton() {
      this.homeButton.appendChild(document.createTextNode("ホームに戻る"));
      this.homeButton.addEventListener("click", () => {
        location.reload();
      });
      const container = document.getElementById("container");
      container.appendChild(this.homeButton);
    }
  }

  const main = new Main();
}
