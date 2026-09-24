const AI_API_URL = "https://still-scene-e8cf.mstronjitaakter.workers.dev";

const $ = (id) => document.getElementById(id);

const speakBtn = $("speakBtn");
const sendBtn = $("sendBtn");
const clearBtn = $("clearBtn");
const userText = $("userText");
const status = $("status");
const aiReply = $("aiReply");
const correction = $("correction");
const question = $("question");

const conversationCount = $("conversationCount");
const correctionCount = $("correctionCount");
const vocabularyCount = $("vocabularyCount");
const examScore = $("examScore");

const WORDS_KEY = "ronjita_english_vocabulary_v1";
const STATS_KEY = "ronjita_english_stats_v1";

let words = loadWords();
let stats = loadStats();

function loadWords() {
  try {
    const data = JSON.parse(localStorage.getItem(WORDS_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveWords() {
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
  updateStats();
  renderVocabulary();
}

function loadStats() {
  try {
    const data = JSON.parse(localStorage.getItem(STATS_KEY));

    return data && typeof data === "object"
      ? data
      : {
          conversations: 0,
          corrections: 0,
          lastExam: null
        };
  } catch {
    return {
      conversations: 0,
      corrections: 0,
      lastExam: null
    };
  }
}

function saveStats() {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  updateStats();
}

function updateStats() {
  if (conversationCount) {
    conversationCount.textContent = stats.conversations || 0;
  }

  if (correctionCount) {
    correctionCount.textContent = stats.corrections || 0;
  }

  if (vocabularyCount) {
    vocabularyCount.textContent = words.length;
  }

  if (examScore) {
    examScore.textContent =
      stats.lastExam == null ? "—" : `${stats.lastExam}%`;
  }
}


/* ============================================================
   TAB SYSTEM
============================================================ */

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {

    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));

    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");

    const panel = $(tab.dataset.tab);

    if (panel) {
      panel.classList.add("active");
    }
  });
});


/* ============================================================
   SPEECH RECOGNITION
============================================================ */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition && speakBtn) {

  recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {

    if (status) {
      status.textContent = "🎤 Listening... Speak now.";
    }

    speakBtn.disabled = true;
  };

  recognition.onresult = (event) => {

    userText.value =
      event.results[0][0].transcript;

    if (status) {
      status.textContent =
        "✅ I heard you! Press Send to AI.";
    }
  };

  recognition.onerror = (event) => {

    if (status) {
      status.textContent =
        `❌ Microphone error: ${event.error}`;
    }
  };

  recognition.onend = () => {

    speakBtn.disabled = false;
  };

  speakBtn.addEventListener("click", () => {

    try {

      recognition.start();

    } catch {

      if (status) {
        status.textContent =
          "Microphone is already listening.";
      }
    }
  });

} else if (speakBtn) {

  speakBtn.disabled = true;

  if (status) {
    status.textContent =
      "Speech recognition is not supported in this browser.";
  }
}


/* ============================================================
   AI JSON READER
============================================================ */

function parseAIJson(raw) {

  if (typeof raw !== "string") {
    throw new Error("AI returned no text.");
  }

  let cleaned =
    raw
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

  try {

    return JSON.parse(cleaned);

  } catch {

    const start =
      cleaned.indexOf("{");

    const end =
      cleaned.lastIndexOf("}");

    if (
      start !== -1 &&
      end > start
    ) {

      return JSON.parse(
        cleaned.slice(start, end + 1)
      );
    }

    throw new Error(
      "AI response was not valid JSON."
    );
  }
}


/* ============================================================
   ASK AI
============================================================ */

async function askAI(prompt) {

  const response =
    await fetch(
      AI_API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          action: "generate",
          message: prompt
        })
      }
    );

  let data;

  try {

    data =
      await response.json();

  } catch {

    throw new Error(
      "Worker did not return valid JSON."
    );
  }

  if (
    !response.ok ||
    !data.success
  ) {

    throw new Error(
      data.error ||
      "AI request failed."
    );
  }

  return data.text;
}


/* ============================================================
   SPEAK AI REPLY
============================================================ */

function speakText(text) {

  if (
    !text ||
    !("speechSynthesis" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  window.speechSynthesis.speak(
    utterance
  );
}


/* ============================================================
   CLEAR AI
============================================================ */

if (clearBtn) {

  clearBtn.addEventListener(
    "click",
    () => {

      userText.value = "";

      aiReply.textContent =
        "Your AI reply will appear here.";

      correction.textContent =
        "Your grammar correction will appear here.";

      question.textContent =
        "Your next question will appear here.";

      if (status) {
        status.textContent = "Ready.";
      }
    }
  );
}


/* ============================================================
   AI CONVERSATION
============================================================ */

if (sendBtn) {

  sendBtn.addEventListener(
    "click",
    async () => {

      const text =
        userText.value.trim();

      if (!text) {

        alert(
          "Please speak or type something first."
        );

        return;
      }

      sendBtn.disabled = true;

      if (status) {
        status.textContent =
          "🤖 AI is thinking...";
      }

      const prompt = `

You are Ronjita's English learning AI coach.

The student said:

${JSON.stringify(text)}

Return ONLY valid JSON.

Use exactly this format:

{
  "reply": "Natural English response to the student.",
  "correction": "Brief grammar correction. If there is no important mistake, say: Your sentence is correct.",
  "question": "One simple follow-up question in English."
}

Rules:

- Do not use Markdown.
- Do not use code fences.
- Keep the English suitable for a learner.
- Be friendly.
- Do not invent grammar mistakes.
- Ask only one follow-up question.

`;

      try {

        const raw =
          await askAI(prompt);

        const result =
          parseAIJson(raw);

        aiReply.textContent =
          result.reply ||
          "No reply received.";

        correction.textContent =
          result.correction ||
          "No correction available.";

        question.textContent =
          result.question ||
          "What would you like to talk about?";

        stats.conversations =
          (stats.conversations || 0) + 1;

        const correctionText =
          String(
            result.correction || ""
          ).toLowerCase();

        if (
          correctionText &&
          !correctionText.includes(
            "your sentence is correct"
          ) &&
          !correctionText.includes(
            "no mistake"
          ) &&
          !correctionText.includes(
            "no error"
          )
        ) {

          stats.corrections =
            (stats.corrections || 0) + 1;
        }

        saveStats();

        if (status) {
          status.textContent =
            "✅ AI replied!";
        }

        speakText(
          result.reply || ""
        );

      } catch (error) {

        console.error(error);

        if (status) {
          status.textContent =
            `❌ AI connection failed: ${error.message}`;
        }

        aiReply.textContent =
          "The AI could not reply right now.";

        correction.textContent =
          "Please check the Cloudflare Worker connection.";

        question.textContent = "";

      } finally {

        sendBtn.disabled = false;
      }
    }
  );
}


/* ============================================================
   VOCABULARY ELEMENTS
============================================================ */

const vocabForm =
  $("vocabForm");

const wordInput =
  $("wordInput");

const meaningInput =
  $("meaningInput");

const exampleInput =
  $("exampleInput");

const vocabSearch =
  $("vocabSearch");

const vocabList =
  $("vocabList");

const clearVocabBtn =
  $("clearVocabBtn");


/* ============================================================
   DISPLAY VOCABULARY
============================================================ */

function renderVocabulary() {

  if (!vocabList) {
    return;
  }

  const search =
    (vocabSearch?.value || "")
      .trim()
      .toLowerCase();

  const filtered =
    words.filter(
      (item) =>

        String(item.word || "")
          .toLowerCase()
          .includes(search)

        ||

        String(item.meaning || "")
          .toLowerCase()
          .includes(search)

        ||

        String(item.example || "")
          .toLowerCase()
          .includes(search)
    );

  vocabList.innerHTML = "";

  if (!filtered.length) {

    vocabList.innerHTML =
      "<p class='muted'>No vocabulary found. Add your first word above.</p>";

    return;
  }

  filtered.forEach(
    (item) => {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "word-card";

      const word =
        document.createElement(
          "div"
        );

      word.className =
        "word";

      word.textContent =
        item.word;

      const meaning =
        document.createElement(
          "div"
        );

      meaning.className =
        "meaning";

      meaning.textContent =
        item.meaning;

      const example =
        document.createElement(
          "div"
        );

      example.className =
        "example";

      if (item.example) {

        example.textContent =
          `Example: ${item.example}`;
      }

      const deleteButton =
        document.createElement(
          "button"
        );

      deleteButton.className =
        "danger delete-word";

      deleteButton.textContent =
        "Delete";

      deleteButton.addEventListener(
        "click",
        () => {

          words =
            words.filter(
              (w) =>
                w.id !== item.id
            );

          saveWords();
        }
      );

      card.appendChild(word);
      card.appendChild(meaning);
      card.appendChild(example);
      card.appendChild(deleteButton);

      vocabList.appendChild(card);
    }
  );
}


/* ============================================================
   ADD VOCABULARY
============================================================ */

if (vocabForm) {

  vocabForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const word =
        wordInput.value.trim();

      const meaning =
        meaningInput.value.trim();

      const example =
        exampleInput.value.trim();

      if (
        !word ||
        !meaning
      ) {

        return;
      }

      words.unshift({

        id:
          Date.now(),

        word:
          word,

        meaning:
          meaning,

        example:
          example
      });

      saveWords();

      vocabForm.reset();

      wordInput.focus();
    }
  );
}


/* ============================================================
   SEARCH VOCABULARY
============================================================ */

if (vocabSearch) {

  vocabSearch.addEventListener(
    "input",
    renderVocabulary
  );
}


/* ============================================================
   DELETE ALL VOCABULARY
============================================================ */

if (clearVocabBtn) {

  clearVocabBtn.addEventListener(
    "click",
    () => {

      if (!words.length) {
        return;
      }

      const confirmed =
        confirm(
          "Delete all saved vocabulary from this device?"
        );

      if (!confirmed) {
        return;
      }

      words = [];

      saveWords();
    }
  );
}


/* ============================================================
   SENTENCE CHECKER
============================================================ */

const sentenceInput =
  $("sentenceInput");

const checkSentenceBtn =
  $("checkSentenceBtn");

const clearSentenceBtn =
  $("clearSentenceBtn");

const sentenceResult =
  $("sentenceResult");


if (checkSentenceBtn) {

  checkSentenceBtn.addEventListener(
    "click",
    async () => {

      const text =
        sentenceInput.value.trim();

      if (!text) {

        alert(
          "Please write an English sentence first."
        );

        return;
      }

      checkSentenceBtn.disabled =
        true;

      sentenceResult.textContent =
        "🤖 Checking your sentence...";

      const prompt = `

You are an English grammar teacher.

Check this student's sentence:

${JSON.stringify(text)}

Return ONLY valid JSON.

Use exactly this format:

{
  "original": "The original sentence.",
  "corrected": "The corrected sentence.",
  "explanation": "A short and easy explanation for the student."
}

Rules:

- Do not use Markdown.
- Do not use code fences.
- Keep the explanation simple.

`;

      try {

        const raw =
          await askAI(prompt);

        const result =
          parseAIJson(raw);

        sentenceResult.textContent =

          "Original: " +
          (
            result.original ||
            text
          )

          +

          "\n\nCorrected: " +
          (
            result.corrected ||
            text
          )

          +

          "\n\nExplanation: " +
          (
            result.explanation ||
            "No explanation."
          );

      } catch (error) {

        sentenceResult.textContent =
          `❌ ${error.message}`;

      } finally {

        checkSentenceBtn.disabled =
          false;
      }
    }
  );
}


/* ============================================================
   CLEAR SENTENCE
============================================================ */

if (clearSentenceBtn) {

  clearSentenceBtn.addEventListener(
    "click",
    () => {

      sentenceInput.value = "";

      sentenceResult.textContent =
        "Your result will appear here.";
    }
  );
}


/* ============================================================
   WEEKLY EXAM
============================================================ */

const startExamBtn =
  $("startExamBtn");

const examProgress =
  $("examProgress");

const examArea =
  $("examArea");

const examQuestion =
  $("examQuestion");

const examOptions =
  $("examOptions");

const nextExamBtn =
  $("nextExamBtn");

const examResult =
  $("examResult");

let examQuestions = [];

let examIndex = 0;

let examCorrect = 0;

let examAnswered = false;


/* ============================================================
   SHUFFLE
============================================================ */

function shuffle(array) {

  return [...array].sort(
    () => Math.random() - 0.5
  );
}


/* ============================================================
   START EXAM
============================================================ */

function startExam() {

  if (words.length < 5) {

    if (examResult) {

      examResult.textContent =
        "📚 Please save at least 5 vocabulary words before starting the exam.";
    }

    if (examArea) {
      examArea.hidden = true;
    }

    return;
  }

  const selected =
    shuffle(words).slice(
      0,
      Math.min(10, words.length)
    );

  examQuestions =
    selected.map(
      (item) => {

        const otherWords =
          shuffle(
            words.filter(
              (w) =>
                w.id !== item.id
            )
          ).slice(0, 2);

        const options =
          shuffle([
            item.meaning,
            ...otherWords.map(
              (w) =>
                w.meaning
            )
          ]);

        return {

          word:
            item.word,

          answer:
            item.meaning,

          options:
            options
        };
      }
    );

  examIndex = 0;

  examCorrect = 0;

  examAnswered = false;

  if (examResult) {
    examResult.textContent = "";
  }

  if (examArea) {
    examArea.hidden = false;
  }

  showExamQuestion();
}


/* ============================================================
   SHOW EXAM QUESTION
============================================================ */

function showExamQuestion() {

  const current =
    examQuestions[examIndex];

  if (!current) {
    return;
  }

  examAnswered = false;

  if (examProgress) {

    examProgress.textContent =
      `Question ${examIndex + 1} of ${examQuestions.length}`;
  }

  if (examQuestion) {

    examQuestion.textContent =
      `What is the meaning of: ${current.word}?`;
  }

  if (examOptions) {

    examOptions.innerHTML = "";

    current.options.forEach(
      (option) => {

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "exam-option";

        button.textContent =
          option;

        button.addEventListener(
          "click",
          () => {

            if (examAnswered) {
              return;
            }

            examAnswered = true;

            if (
              option ===
              current.answer
            ) {

              examCorrect++;

              button.classList.add(
                "correct"
              );

            } else {

              button.classList.add(
                "wrong"
              );

              [
                ...examOptions.children
              ].forEach(
                (b) => {

                  if (
                    b.textContent ===
                    current.answer
                  ) {

                    b.classList.add(
                      "correct"
                    );
                  }
                }
              );
            }
          }
        );

        examOptions.appendChild(
          button
        );
      }
    );
  }

  if (nextExamBtn) {
    nextExamBtn.disabled = false;
  }
}


/* ============================================================
   EXAM BUTTON
============================================================ */

if (startExamBtn) {

  startExamBtn.addEventListener(
    "click",
    startExam
  );
}


/* ============================================================
   NEXT EXAM QUESTION
============================================================ */

if (nextExamBtn) {

  nextExamBtn.addEventListener(
    "click",
    () => {

      if (!examAnswered) {

        alert(
          "Please choose an answer first."
        );

        return;
      }

      examIndex++;

      if (
        
