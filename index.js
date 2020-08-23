"use strict";
{
  const h1 = document.querySelector("h1");
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const startButton = document.getElementById("start");
  const gameState = {
    quizzs: [],
    index: 0,
    successNum: 0,
  };
  let array = [];
  const fetchQuizData = () => {
    h1.removeChild(h1.firstChild);
    questionElement.removeChild(questionElement.firstElementChild);

    const title = document.createElement("p");
    const message = document.createElement("p");
    message.setAttribute("class", "question");

    title.appendChild(document.createTextNode("取得中"));
    message.appendChild(document.createTextNode("少々お待ちください"));

    h1.appendChild(title);
    questionElement.appendChild(message);

    startButton.remove();

    fetch("https://opentdb.com/api.php?amount=10")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        gameState.quizzs = data.results;
        setNextQuiz(gameState.quizzs);
      });
  };

  const countAnswer = (e, answer) => {
    if (e.currentTarget.innerHTML === answer) {
      gameState.successNum++;
    }
    gameState.index++;
    setNextQuiz(gameState.quizzs);
  };

  const showResults = () => {
    const resultsText = document.createElement("p");
    resultsText.appendChild(
      document.createTextNode(
        "あなたの正答数は" + gameState.successNum + "です！"
      )
    );
    h1.appendChild(resultsText);
    const comment = document.createElement("p");
    comment.setAttribute("class", "question");
    comment.appendChild(
      document.createTextNode("再チャレンジしたい場合は以下をクリック")
    );
    questionElement.appendChild(comment);
    const homeButton = document.createElement("button");
    homeButton.appendChild(document.createTextNode("ホームに戻る"));
    homeButton.addEventListener("click", () => {
      location.reload();
    });
    const container = document.getElementById("container");
    container.appendChild(homeButton);
  };

  const shuffle = (answers) => {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = answers[i];
      answers[i] = answers[j];
      answers[j] = tmp;
    }
    return answers;
  };

  const setNextQuiz = (quizzs) => {
    h1.removeChild(h1.firstChild);
    questionElement.removeChild(questionElement.firstElementChild);
    if (questionElement.hasChildNodes()) {
      while (questionElement.firstChild) {
        questionElement.removeChild(questionElement.firstChild);
      }
    }
    if (answersElement.hasChildNodes()) {
      while (answersElement.firstChild) {
        answersElement.removeChild(answersElement.firstChild);
      }
    }
    if (array.length !== 0) {
      array.length = 0;
    }
    if (gameState.index === 10) {
      showResults();
      return;
    }

    const questionCount = gameState.index + 1;
    const questionNum = document.createElement("p");
    questionNum.appendChild(document.createTextNode("問題" + questionCount));
    h1.appendChild(questionNum);
    const genre = document.createElement("p");
    const level = document.createElement("p");
    const questionText = document.createElement("p");
    questionText.setAttribute("class", "question");

    genre.appendChild(
      document.createTextNode("[ジャンル]" + quizzs[gameState.index].category)
    );
    level.appendChild(
      document.createTextNode("[難易度]" + quizzs[gameState.index].difficulty)
    );
    questionText.appendChild(
      document.createTextNode(quizzs[gameState.index].question)
    );
    questionElement.appendChild(genre);
    questionElement.appendChild(level);
    questionElement.appendChild(questionText);
    const correctAnswer = quizzs[gameState.index].correct_answer;
    array.push(correctAnswer);
    let answers = array.concat(quizzs[gameState.index].incorrect_answers);
    answers = shuffle(answers);

    answers.forEach((answer) => {
      let choiceList = document.createElement("li");
      let answersButton = document.createElement("button");
      answersButton.appendChild(document.createTextNode(answer));
      answersButton.addEventListener("click", (e) => {
        countAnswer(e, correctAnswer);
      });
      choiceList.appendChild(answersButton);
      answersElement.appendChild(choiceList);
    });
  };
  startButton.addEventListener("click", fetchQuizData);
}
