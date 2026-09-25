const WORKER_URL =
  "https://still-scene-e8cf.mstronjitaakter.workers.dev/";


/* =========================================
   STORAGE
========================================= */

let vocabulary =
  JSON.parse(localStorage.getItem("ronjitaVocabulary")) || [];

let stats =
  JSON.parse(localStorage.getItem("ronjitaStats")) || {
    sentences: 0,
    exams: 0,
    bestScore: 0
  };

let chatHistory = [];

let currentExam = [];


function saveVocabulary() {
  localStorage.setItem(
    "ronjitaVocabulary",
    JSON.stringify(vocabulary)
  );
}


function saveStats() {
  localStorage.setItem(
    "ronjitaStats",
    JSON.stringify(stats)
  );
}


/* =========================================
   TABS
========================================= */

document.querySelectorAll(".tab").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".tab")
      .forEach(btn => btn.classList.remove("active"));

    document.querySelectorAll(".section")
      .forEach(section => section.classList.remove("active"));

    button.classList.add("active");

    const target =
      document.getElementById(button.dataset.tab);

    if (target) {
      target.classList.add("active");
    }

  });

});


/* =========================================
   API
========================================= */

async function callWorker(action, data = {}) {

  const response = await fetch(WORKER_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      action,
      ...data
    })

  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "Something went wrong."
    );
  }

  return result;
}


/* =========================================
   VOCABULARY
========================================= */

const wordInput =
  document.getElementById("wordInput");

const addWordBtn =
  document.getElementById("addWordBtn");

const vocabularyList =
  document.getElementById("vocabularyList");


addWordBtn.addEventListener("click", addVocabulary);


wordInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {
    addVocabulary();
  }

});


async function addVocabulary() {

  const word =
    wordInput.value.trim();

  if (!word) {
    alert("Please enter an English word.");
    return;
  }

  addWordBtn.disabled = true;
  addWordBtn.textContent = "Creating...";

  try {

    const result =
      await callWorker("vocabulary", {
        word
      });

    const text = result.text;

    const item = {

      id: Date.now(),

      word,

      card: text,

      meaning: extractLine(
        text,
        "Meaning in simple English:"
      ),

      translation: extractLine(
        text,
        "Bengali translation:"
      ),

      example: extractLine(
        text,
        "One natural English example sentence:"
      ),

      createdAt: new Date().toISOString()

    };

    vocabulary.push(item);

    saveVocabulary();

    wordInput.value = "";

    renderVocabulary();

    updateStats();

  } catch (error) {

    alert(error.message);

  } finally {

    addWordBtn.disabled = false;
    addWordBtn.textContent = "Add Word";

  }

}


function extractLine(text, label) {

  const lines =
    text.split("\n");

  const line =
    lines.find(item =>
      item.toLowerCase()
        .startsWith(label.toLowerCase())
    );

  if (!line) {
    return "";
  }

  return line
    .substring(label.length)
    .replace(/^[:\-\s]+/, "")
    .trim();
}


function renderVocabulary() {

  vocabularyList.innerHTML = "";

  if (!vocabulary.length) {

    vocabularyList.innerHTML = `
      <div class="card">
        <h3>No vocabulary yet.</h3>
        <p>Add your first English word above.</p>
      </div>
    `;

    return;
  }


  vocabulary
    .slice()
    .reverse()
    .forEach(item => {

      const card =
        document.createElement("div");

      card.className = "vocab-card";

      card.innerHTML = `

        <h3>${escapeHTML(item.word)}</h3>

        <p>
          <strong>Meaning:</strong><br>
          ${escapeHTML(item.meaning || "See full card below.")}
        </p>

        <p>
          <strong>বাংলা অর্থ:</strong><br>
          ${escapeHTML(item.translation || "")}
        </p>

        <p>
          <strong>Example:</strong><br>
          ${escapeHTML(item.example || "")}
        </p>

        <details>
          <summary>Full vocabulary card</summary>
          <p>
            ${escapeHTML(item.card)}
          </p>
        </details>

        <button
          class="delete-word"
          data-id="${item.id}"
        >
          Delete
        </button>

      `;

      vocabularyList.appendChild(card);

    });


  document
    .querySelectorAll(".delete-word")
    .forEach(button => {

      button.addEventListener("click", () => {

        const id =
          Number(button.dataset.id);

        vocabulary =
          vocabulary.filter(
            item => item.id !== id
          );

        saveVocabulary();

        renderVocabulary();

        updateStats();

      });

    });

}


/* =========================================
   SENTENCE CHECKER
========================================= */

const sentenceInput =
  document.getElementById("sentenceInput");

const checkSentenceBtn =
  document.getElementById("checkSentenceBtn");

const sentenceResult =
  document.getElementById("sentenceResult");


checkSentenceBtn.addEventListener(
  "click",
  checkSentence
);


async function checkSentence() {

  const sentence =
    sentenceInput.value.trim();

  if (!sentence) {
    alert("Write a sentence first.");
    return;
  }

  checkSentenceBtn.disabled = true;
  checkSentenceBtn.textContent = "Checking...";

  sentenceResult.innerHTML =
    `<div class="result">Checking your sentence...</div>`;

  try {

    const result =
      await callWorker("sentence", {

        sentence,

        vocabulary:
          vocabulary.map(v => ({
            word: v.word,
            meaning: v.meaning,
            translation: v.translation,
            example: v.example
          }))

      });


    sentenceResult.innerHTML = `
      <div class="result">
        ${escapeHTML(result.text)}
      </div>
    `;

    stats.sentences++;

    saveStats();

    updateStats();

  } catch (error) {

    sentenceResult.innerHTML = `
      <div class="result">
        Error: ${escapeHTML(error.message)}
      </div>
    `;

  } finally {

    checkSentenceBtn.disabled = false;
    checkSentenceBtn.textContent =
      "Check My Sentence";

  }

}


/* =========================================
   AI COACH
========================================= */

const chatInput =
  document.getElementById("chatInput");

const sendChatBtn =
  document.getElementById("sendChatBtn");

const chatBox =
  document.getElementById("chatBox");

const byeBtn =
  document.getElementById("byeBtn");


sendChatBtn.addEventListener(
  "click",
  sendChat
);


chatInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendChat();

    }

  }
);


async function sendChat() {

  const message =
    chatInput.value.trim();

  if (!message) {
    return;
  }

  addChatMessage(
    "user",
    message
  );

  chatInput.value = "";

  sendChatBtn.disabled = true;
  sendChatBtn.textContent = "Thinking...";


  try {

    const result =
      await callWorker("chat", {

        message,

        history: chatHistory

      });


    addChatMessage(
      "ai",
      result.text
    );


    chatHistory.push({
      role: "user",
      content: message
    });

    chatHistory.push({
      role: "assistant",
      content: result.text
    });


    chatHistory =
      chatHistory.slice(-12);


  } catch (error) {

    addChatMessage(
      "ai",
      "Sorry, I couldn't connect right now. " +
      error.message
    );

  } finally {

    sendChatBtn.disabled = false;
    sendChatBtn.textContent = "Send";

    chatInput.focus();

  }

}


function addChatMessage(
  type,
  text
) {

  const message =
    document.createElement("div");

  message.className =
    type === "user"
      ? "user-message"
      : "ai-message";

  message.textContent = text;

  chatBox.appendChild(message);

  chatBox.scrollTop =
    chatBox.scrollHeight;

}


byeBtn.addEventListener(
  "click",
  () => {

    addChatMessage(
      "ai",
      "Goodbye Ronjita! 👋 See you next time."
    );

    chatHistory = [];

    chatInput.disabled = true;
    sendChatBtn.disabled = true;

  }
);


/* =========================================
   WEEKLY EXAM
========================================= */

const startExamBtn =
  document.getElementById("startExamBtn");

const examArea =
  document.getElementById("examArea");


startExamBtn.addEventListener(
  "click",
  generateExam
);


async function generateExam() {

  if (vocabulary.length < 1) {

    alert(
      "First add some vocabulary."
    );

    return;
  }


  startExamBtn.disabled = true;
  startExamBtn.textContent =
    "Creating exam...";


  examArea.innerHTML =
    `<div class="result">
      Creating your weekly exam...
    </div>`;


  try {

    const result =
      await callWorker("exam", {

        vocabulary

      });


    currentExam =
      result.exam.questions || [];


    renderExam();

  } catch (error) {

    examArea.innerHTML =
      `<div class="result">
        ${escapeHTML(error.message)}
      </div>`;

  } finally {

    startExamBtn.disabled = false;
    startExamBtn.textContent =
      "Generate Weekly Exam";

  }

}


function renderExam() {

  examArea.innerHTML = "";

  if (!currentExam.length) {

    examArea.innerHTML =
      `<div class="result">
        No questions were generated.
      </div>`;

    return;

  }


  currentExam.forEach(
    (question, index) => {

      const box =
        document.createElement("div");

      box.className =
        "exam-question";

      box.innerHTML = `

        <h3>
          Question ${index + 1}
        </h3>

        <p>
          ${escapeHTML(question.question)}
        </p>

        <textarea
          id="answer-${index}"
          placeholder="Write your answer..."
        ></textarea>

        <button
          class="primary exam-submit"
          data-index="${index}"
        >
          Submit Answer
        </button>

        <div
          id="exam-result-${index}"
          class="exam-result"
        ></div>

      `;

      examArea.appendChild(box);

    }
  );


  document
    .querySelectorAll(".exam-submit")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          checkExamAnswer(
            Number(button.dataset.index)
          );

        }
      );

    });

}


async function checkExamAnswer(index) {

  const question =
    currentExam[index];

  const answerBox =
    document.getElementById(
      `answer-${index}`
    );

  const resultBox =
    document.getElementById(
      `exam-result-${index}`
    );


  const userAnswer =
    answerBox.value.trim();


  if (!userAnswer) {

    alert("Write your answer first.");

    return;

  }


  const button =
    answerBox
      .parentElement
      .querySelector(".exam-submit");


  button.disabled = true;

  resultBox.textContent =
    "Checking answer...";


  try {

    const result =
      await callWorker(
        "checkExam",
        {

          question:
            question.question,

          correctAnswer:
            question.answer,

          userAnswer,

          meaning:
            question.meaning

        }
      );


    resultBox.textContent =
      result.text;


    stats.exams++;

    saveStats();

    updateStats();

  } catch (error) {

    resultBox.textContent =
      error.message;

  } finally {

    button.disabled = false;

  }

}


/* =========================================
   PROGRESS
========================================= */

function updateStats() {

  document.getElementById(
    "wordCount"
  ).textContent =
    vocabulary.length;

  document.getElementById(
    "sentenceCount"
  ).textContent =
    stats.sentences;

  document.getElementById(
    "examCount"
  ).textContent =
    stats.exams;

  document.getElementById(
    "bestScore"
  ).textContent =
    `${stats.bestScore || 0}%`;

}


/* =========================================
   SECURITY / HTML ESCAPE
========================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================
   INITIAL LOAD
========================================= */

renderVocabulary();

updateStats();
