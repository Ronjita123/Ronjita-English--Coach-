/* =========================================================
   RONJITA ENGLISH COACH
   FINAL COMBINED SCRIPT
   Gemini AI + Vocabulary + Sentence Checker
   AI Coach + Weekly Exam + Progress
========================================================= */


/* =========================================================
   1. GEMINI CONFIGURATION
========================================================= */

const GEMINI_API_KEY = AQ.Ab8RN6JSXiEHgXBDyIgY8J6z_WzThMb9yLKCd6TmHdmWOF66bw

const GEMINI_MODEL = "gemini-3.6-flash";

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;


/* =========================================================
   2. GEMINI FUNCTION
========================================================= */

async function callGemini(prompt) {

  if (
    !GEMINI_API_KEY ||
    GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE"
  ) {
    throw new Error(
      "Gemini API key বসানো হয়নি। script.js-এর উপরে নিজের API key বসাও।"
    );
  }

  const response = await fetch(GEMINI_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },

    body: JSON.stringify({

      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]

    })

  });


  let data;

  try {

    data = await response.json();

  } catch {

    throw new Error(
      "Gemini থেকে সঠিক response পাওয়া যায়নি।"
    );

  }


  if (!response.ok) {

    throw new Error(
      data?.error?.message ||
      "Gemini API request failed."
    );

  }


  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();


  if (!text) {

    throw new Error(
      "Gemini কোনো text response দেয়নি।"
    );

  }


  return text;

}


/* =========================================================
   3. LOCAL STORAGE
========================================================= */

let vocabulary =
  JSON.parse(
    localStorage.getItem("ronjitaVocabulary")
  ) || [];


let stats =
  JSON.parse(
    localStorage.getItem("ronjitaStats")
  ) || {

    sentences: 0,
    exams: 0,
    bestScore: 0

  };


let chatHistory = [];

let currentExam = [];

let examResults = {};


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


/* =========================================================
   4. BASIC HELPERS
========================================================= */

function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function getTodayKey() {

  const date = new Date();

  return date.toISOString().slice(0, 10);

}


/* =========================================================
   5. TABS
========================================================= */

document
  .querySelectorAll(".tab")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".tab")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      document
        .querySelectorAll(".section")
        .forEach(section =>
          section.classList.remove("active")
        );


      button.classList.add("active");


      const target =
        document.getElementById(
          button.dataset.tab
        );


      if (target) {

        target.classList.add("active");

      }

    });

  });


/* =========================================================
   6. TODAY'S 10 VOCABULARY
========================================================= */

const vocabularyList =
  document.getElementById(
    "vocabularyList"
  );


async function generateDailyVocabulary() {

  const today = getTodayKey();

  const saved =
    JSON.parse(
      localStorage.getItem(
        "ronjitaDailyVocabulary"
      )
    );


  if (
    saved &&
    saved.date === today &&
    Array.isArray(saved.words) &&
    saved.words.length >= 10
  ) {

    displayDailyVocabulary(
      saved.words.slice(0, 10)
    );

    return saved.words.slice(0, 10);

  }


  if (!vocabularyList) return [];


  vocabularyList.innerHTML = `

    <div class="card">

      <h3>🤖 Creating today's vocabulary...</h3>

      <p>
        Gemini is preparing 10 new English words for you.
      </p>

    </div>

  `;


  try {

    const prompt = `

You are an English teacher creating a daily vocabulary lesson.

Create exactly 10 useful English vocabulary words for a Bangladeshi HSC student.

Return ONLY valid JSON.

Format:

[
  {
    "word": "example",
    "meaning": "simple English meaning",
    "bangla": "বাংলা অর্থ",
    "translation": "বাংলা অনুবাদ",
    "sentence": "A natural English example sentence."
  }
]

Rules:

- Exactly 10 words.
- Do not repeat these words:
${vocabulary.map(item => item.word).join(", ")}

- Suitable for daily English learning.
- Use different words each day.
- Keep meanings simple.
- Example sentences must be natural.
- Do not add markdown.
- Do not add explanations outside JSON.

Today's date: ${today}

`;


    const response =
      await callGemini(prompt);


    const clean =
      response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();


    const words =
      JSON.parse(clean);


    if (
      !Array.isArray(words) ||
      words.length < 10
    ) {

      throw new Error(
        "Gemini 10টি vocabulary তৈরি করতে পারেনি।"
      );

    }


    const todayWords =
      words.slice(0, 10);


    localStorage.setItem(

      "ronjitaDailyVocabulary",

      JSON.stringify({

        date: today,

        words: todayWords

      })

    );


    displayDailyVocabulary(
      todayWords
    );


    return todayWords;


  } catch (error) {

    vocabularyList.innerHTML = `

      <div class="card">

        <h3>⚠️ Vocabulary তৈরি করা যায়নি</h3>

        <p>
          ${escapeHTML(error.message)}
        </p>

      </div>

    `;

    return [];

  }

}


/* =========================================================
   7. DISPLAY DAILY VOCABULARY
========================================================= */

function displayDailyVocabulary(words) {

  if (!vocabularyList) return;


  vocabularyList.innerHTML = "";


  words.forEach((item, index) => {

    const card =
      document.createElement("div");


    card.className =
      "vocab-card";


    card.innerHTML = `

      <h3>
        ${index + 1}. ${escapeHTML(item.word)}
      </h3>

      <p>
        <strong>English Meaning:</strong><br>
        ${escapeHTML(item.meaning)}
      </p>

      <p>
        <strong>বাংলা অর্থ:</strong><br>
        ${escapeHTML(item.bangla)}
      </p>

      <p>
        <strong>বাংলা অনুবাদ:</strong><br>
        ${escapeHTML(item.translation)}
      </p>

      <p>
        <strong>Example:</strong><br>
        ${escapeHTML(item.sentence)}
      </p>

    `;


    vocabularyList.appendChild(card);

  });


  updateWordSelect(words);

}


/* =========================================================
   8. WORD SELECT
========================================================= */

const wordSelect =
  document.getElementById(
    "wordSelect"
  );


function updateWordSelect(words) {

  if (!wordSelect) return;


  wordSelect.innerHTML = `

    <option value="">
      Choose a word
    </option>

  `;


  words.forEach(item => {

    const option =
      document.createElement("option");


    option.value =
      item.word;


    option.textContent =
      item.word;


    wordSelect.appendChild(option);

  });

}


/* =========================================================
   9. SENTENCE CHECKER
========================================================= */

const sentenceInput =
  document.getElementById(
    "sentenceInput"
  );


const checkSentenceBtn =
  document.getElementById(
    "checkSentenceBtn"
  );


const sentenceResult =
  document.getElementById(
    "sentenceResult"
  );


if (checkSentenceBtn) {

  checkSentenceBtn.addEventListener(
    "click",
    checkSentence
  );

}


async function checkSentence() {

  const sentence =
    sentenceInput?.value.trim();


  const selectedWord =
    wordSelect?.value.trim();


  if (!sentence) {

    alert(
      "আগে একটি English sentence লিখো।"
    );

    return;

  }


  if (!selectedWord) {

    alert(
      "আগে একটি vocabulary word নির্বাচন করো।"
    );

    return;

  }


  checkSentenceBtn.disabled = true;

  checkSentenceBtn.textContent =
    "Checking...";


  sentenceResult.innerHTML = `

    <div class="result">

      🤖 Gemini is checking your sentence...

    </div>

  `;


  try {

    const prompt = `

You are a friendly English teacher.

Student name: Ronjita

Selected vocabulary word:
"${selectedWord}"

Student sentence:
"${sentence}"

Check the sentence carefully.

Return your answer using exactly these headings:

Grammar:
Correct / Needs Correction

What is wrong:
Explain the mistake simply.

Corrected sentence:
Write the corrected sentence.

বাংলা ব্যাখ্যা:
Explain the mistake briefly in Bengali.

Meaning:
Give the Bengali meaning of the corrected sentence.

Teacher note:
Give one short encouraging sentence.

Do not invent a mistake if the sentence is grammatically correct.

`;


    const response =
      await callGemini(prompt);


    sentenceResult.innerHTML = `

      <div class="result">

        <h3>👩‍🏫 English Teacher Feedback</h3>

        <p style="white-space: pre-line;">
          ${escapeHTML(response)}
        </p>

      </div>

    `;


    stats.sentences++;

    saveStats();

    updateStats();


  } catch (error) {

    sentenceResult.innerHTML = `

      <div class="result">

        ❌ ${escapeHTML(error.message)}

      </div>

    `;

  } finally {

    checkSentenceBtn.disabled = false;

    checkSentenceBtn.textContent =
      "Check Sentence";

  }

}


/* =========================================================
   10. AI COACH
========================================================= */

/*
   তোমার পুরোনো HTML-এ AI Coach section না থাকলে
   এই code নিজে থেকে সেটি তৈরি করবে।
*/


function createAICoach() {

  if (
    document.getElementById("aiCoachSection")
  ) return;


  const section =
    document.createElement("section");


  section.id =
    "aiCoachSection";


  section.className =
    "section";


  section.innerHTML = `

    <div class="card sticky blue">

      <h2>🤖 AI English Coach</h2>

      <p>
        Talk with Ronjita English Coach.
      </p>

      <div
        id="chatBox"
        style="
          background:white;
          padding:15px;
          border-radius:15px;
          min-height:200px;
          max-height:400px;
          overflow-y:auto;
        "
      ></div>


      <textarea
        id="chatInput"
        placeholder="Write in English..."
      ></textarea>


      <button
        id="sendChatBtn"
        class="primary"
      >
        Send
      </button>


      <button
        id="byeBtn"
        class="primary"
      >
        Bye 👋
      </button>

    </div>

  `;


  document
    .querySelector("main")
    ?.appendChild(section);


  const nav =
    document.querySelector(".tabs");


  if (nav) {

    const button =
      document.createElement("button");


    button.className =
      "tab";


    button.dataset.tab =
      "aiCoachSection";


    button.textContent =
      "🤖 AI Coach";


    nav.appendChild(button);


    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".tab")
          .forEach(btn =>
            btn.classList.remove("active")
          );


        document
          .querySelectorAll(".section")
          .forEach(sec =>
            sec.classList.remove("active")
          );


        button.classList.add("active");

        section.classList.add("active");

      }
    );

  }

}


createAICoach();


/* =========================================================
   11. AI CHAT
========================================================= */

let chatInput =
  document.getElementById(
    "chatInput"
  );


let sendChatBtn =
  document.getElementById(
    "sendChatBtn"
  );


let chatBox =
  document.getElementById(
    "chatBox"
  );


let byeBtn =
  document.getElementById(
    "byeBtn"
  );


function refreshChatElements() {

  chatInput =
    document.getElementById(
      "chatInput"
    );

  sendChatBtn =
    document.getElementById(
      "sendChatBtn"
    );

  chatBox =
    document.getElementById(
      "chatBox"
    );

  byeBtn =
    document.getElementById(
      "byeBtn"
    );

}


refreshChatElements();


if (sendChatBtn) {

  sendChatBtn.addEventListener(
    "click",
    sendChat
  );

}


if (chatInput) {

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

}


async function sendChat() {

  refreshChatElements();


  if (!chatInput) return;


  const message =
    chatInput.value.trim();


  if (!message) return;


  addChatMessage(
    "user",
    message
  );


  chatInput.value = "";


  sendChatBtn.disabled = true;

  sendChatBtn.textContent =
    "Thinking...";


  try {

    const previousConversation =
      chatHistory
        .slice(-10)
        .map(item =>
          `${item.role}: ${item.text}`
        )
        .join("\n");


    const prompt = `

You are Ronjita's personal English Coach.

Your job is to help a student practice natural English conversation.

Student name: Ronjita

Important rules:

1. Speak naturally and warmly.
2. Keep the conversation going.
3. Ask a follow-up question when appropriate.
4. Start a new topic when the conversation begins.
5. If Ronjita makes a grammar mistake, gently correct it.
6. Use this style:
   "Ronjita, did you mean: ...?"
7. Explain important grammar mistakes briefly in Bengali.
8. Do not stop the conversation unless Ronjita says bye.
9. Do not make every answer too long.
10. Encourage English speaking and writing.

Previous conversation:

${previousConversation}

Current student message:

${message}

Reply naturally as the English Coach.

`;


    const response =
      await callGemini(prompt);


    addChatMessage(
      "ai",
      response
    );


  } catch (error) {

    addChatMessage(
      "ai",
      "Sorry, Gemini connection failed: " +
      error.message
    );

  } finally {

    sendChatBtn.disabled = false;

    sendChatBtn.textContent =
      "Send";

    chatInput.focus();

  }

}


function addChatMessage(
  type,
  text
) {

  refreshChatElements();


  if (!chatBox) return;


  const message =
    document.createElement("div");


  message.style.padding =
    "10px";


  message.style.marginBottom =
    "10px";


  message.style.borderRadius =
    "12px";


  message.style.background =
    type === "user"
      ? "#e8d5ff"
      : "#d7f6c7";


  message.innerHTML = `

    <strong>
      ${
        type === "user"
          ? "You"
          : "Ronjita English Coach"
      }
    </strong>

    <p style="white-space:pre-line;">
      ${escapeHTML(text)}
    </p>

  `;


  chatBox.appendChild(message);


  chatBox.scrollTop =
    chatBox.scrollHeight;


  chatHistory.push({

    role:
      type === "user"
        ? "User"
        : "Coach",

    text

  });

}


/* =========================================================
   12. BYE
========================================================= */

if (byeBtn) {

  byeBtn.addEventListener(
    "click",
    () => {

      refreshChatElements();


      addChatMessage(
        "ai",
        "Goodbye, Ronjita! 👋 See you next time. Keep practicing your English!"
      );


      chatHistory = [];


      if (chatInput) {

        chatInput.disabled = true;

      }


      if (sendChatBtn) {

        sendChatBtn.disabled = true;

      }

    }
  );

}


/* =========================================================
   13. WEEKLY EXAM
========================================================= */

const startExamBtn =
  document.getElementById(
    "startExamBtn"
  );


const examArea =
  document.getElementById(
    "examArea"
  );


if (startExamBtn) {

  startExamBtn.addEventListener(
    "click",
    generateExam
  );

}


async function generateExam() {

  if (!examArea) return;


  startExamBtn.disabled = true;

  startExamBtn.textContent =
    "Creating exam...";


  examArea.innerHTML = `

    <div class="result">

      🤖 Gemini is creating your weekly exam...

    </div>

  `;


  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "ronjitaDailyVocabulary"
        )
      );


    const words =
      saved?.words || [];


    if (!words.length) {

      throw new Error(
        "আজকের vocabulary আগে তৈরি করো।"
      );

    }


    const wordData =
      words
        .map(item =>
          `${item.word} = ${item.bangla}`
        )
        .join("\n");


    const prompt = `

Create a 10-question English vocabulary exam.

Use ONLY these vocabulary words:

${wordData}

Return ONLY valid JSON.

Format:

[
  {
    "question": "question text",
    "answer": "correct answer",
    "meaning": "short Bengali explanation"
  }
]

Question types should be mixed:

- Bengali meaning
- English meaning
- Fill in the blank
- Vocabulary usage
- Translation

Exactly 10 questions.

No markdown.
No extra text.

`;


    const response =
      await callGemini(prompt);


    const clean =
      response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();


    currentExam =
      JSON.parse(clean);


    examResults = {};


    renderExam();


  } catch (error) {

    examArea.innerHTML = `

      <div class="result">

        ❌ Exam তৈরি করা যায়নি.

        <br><br>

        ${escapeHTML(error.message)}

      </div>

    `;

  } finally {

    startExamBtn.disabled = false;

    startExamBtn.textContent =
      "Start Weekly Exam";

  }

}


/* =========================================================
   14. RENDER EXAM
========================================================= */

function renderExam() {

  if (!examArea) return;


  examArea.innerHTML = "";


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
            Number(
              button.dataset.index
            )
          );

        }
      );

    });


  const finishButton =
    document.createElement("button");


  finishButton.className =
    "primary";


  finishButton.textContent =
    "Calculate Final Score";


  finishButton.addEventListener(
    "click",
    calculateExamScore
  );


  examArea.appendChild(
    finishButton
  );

}


/* =========================================================
   15. CHECK EXAM ANSWER
========================================================= */

async function checkExamAnswer(index) {

  const question =
    currentExam[index];


  const answerBox =
    document.getElementById(
      `answer-${index}`
    );


  const res
