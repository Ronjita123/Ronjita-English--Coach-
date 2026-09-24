// ============================================================
// RONJITA'S AI ENGLISH COACH
// ============================================================
//
// Website:
// GitHub Pages
//
// AI:
// GitHub Pages
//      ↓
// Cloudflare Worker
//      ↓
// Gemini API
//
// IMPORTANT:
// Gemini API key is NOT stored in this file.
// ============================================================


const AI_API_URL =
  "https://still-scene-e8cf.mstronjitaakter.workers.dev";


// ============================================================
// ELEMENTS
// ============================================================

const speakBtn =
  document.getElementById("speakBtn");

const sendBtn =
  document.getElementById("sendBtn");

const clearBtn =
  document.getElementById("clearBtn");

const userText =
  document.getElementById("userText");

const status =
  document.getElementById("status");

const aiReply =
  document.getElementById("aiReply");

const correction =
  document.getElementById("correction");

const question =
  document.getElementById("question");

const conversationCount =
  document.getElementById("conversationCount");

const correctionCount =
  document.getElementById("correctionCount");

const vocabularyCount =
  document.getElementById("vocabularyCount");

const examScore =
  document.getElementById("examScore");


// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const WORDS_KEY =
  "ronjita_english_vocabulary_v1";

const STATS_KEY =
  "ronjita_english_stats_v1";


// ============================================================
// LOAD SAVED DATA
// ============================================================

let words =
  loadWords();

let stats =
  loadStats();


// ============================================================
// LOAD VOCABULARY
// ============================================================

function loadWords() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          WORDS_KEY
        )
      );

    if (Array.isArray(saved)) {

      return saved;

    }

  }

  catch (error) {

    console.log(
      "Vocabulary loading error:",
      error
    );

  }

  return [];

}


// ============================================================
// SAVE VOCABULARY
// ============================================================

function saveWords() {

  localStorage.setItem(
    WORDS_KEY,
    JSON.stringify(words)
  );

  updateStats();

  renderVocabulary();

}


// ============================================================
// LOAD STATISTICS
// ============================================================

function loadStats() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          STATS_KEY
        )
      );

    if (
      saved &&
      typeof saved === "object"
    ) {

      return saved;

    }

  }

  catch (error) {

    console.log(
      "Stats loading error:",
      error
    );

  }

  return {

    conversations: 0,

    corrections: 0,

    lastExam: null

  };

}


// ============================================================
// SAVE STATISTICS
// ============================================================

function saveStats() {

  localStorage.setItem(
    STATS_KEY,
    JSON.stringify(stats)
  );

  updateStats();

}


// ============================================================
// UPDATE STATISTICS
// ============================================================

function updateStats() {

  conversationCount.textContent =
    stats.conversations || 0;

  correctionCount.textContent =
    stats.corrections || 0;

  vocabularyCount.textContent =
    words.length;

  if (
    stats.lastExam === null ||
    stats.lastExam === undefined
  ) {

    examScore.textContent =
      "—";

  }

  else {

    examScore.textContent =
      stats.lastExam + "%";

  }

}


// ============================================================
// INITIAL STATISTICS
// ============================================================

updateStats();


// ============================================================
// TAB SYSTEM
// ============================================================

const tabs =
  document.querySelectorAll(
    ".tab"
  );

const panels =
  document.querySelectorAll(
    ".tab-panel"
  );


tabs.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        tabs.forEach(
          function (tab) {

            tab.classList.remove(
              "active"
            );

          }
        );


        panels.forEach(
          function (panel) {

            panel.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        const target =
          document.getElementById(
            button.dataset.tab
          );


        if (target) {

          target.classList.add(
            "active"
          );

        }

      }
    );

  }
);


// ============================================================
// SPEECH RECOGNITION
// ============================================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


let recognition =
  null;


if (SpeechRecognition) {

  recognition =
    new SpeechRecognition();


  recognition.lang =
    "en-US";


  recognition.interimResults =
    false;


  recognition.continuous =
    false;


  recognition.onstart =
    function () {

      status.textContent =
        "🎤 Listening... Speak now.";

      speakBtn.disabled =
        true;

    };


  recognition.onresult =
    function (event) {

      const spokenText =
        event.results[0][0].transcript;


      userText.value =
        spokenText;


      status.textContent =
        "✅ I heard you! Press Send to AI.";

    };


  recognition.onerror =
    function (event) {

      status.textContent =
        "❌ Microphone error: " +
        event.error;

    };


  recognition.onend =
    function () {

      speakBtn.disabled =
        false;

    };

}

else {

  speakBtn.disabled =
    true;


  status.textContent =
    "Speech recognition is not supported in this browser.";

}


// ============================================================
// START MICROPHONE
// ============================================================

speakBtn.addEventListener(
  "click",
  function () {

    if (!recognition) {

      return;

    }


    try {

      recognition.start();

    }

    catch (error) {

      status.textContent =
        "Microphone is already listening.";

    }

  }
);


// ============================================================
// CLEAR AI CONVERSATION
// ============================================================

clearBtn.addEventListener(
  "click",
  function () {

    userText.value =
      "";


    aiReply.textContent =
      "Your AI reply will appear here.";


    correction.textContent =
      "Your grammar correction will appear here.";


    question.textContent =
      "Your next question will appear here.";


    status.textContent =
      "Ready.";

  }
);


// ============================================================
// AI JSON READER
// ============================================================

function parseAIJson(raw) {

  if (
    typeof raw !==
    "string"
  ) {

    throw new Error(
      "AI returned no text."
    );

  }


  let cleaned =
    raw.trim();


  cleaned =
    cleaned.replace(
      /^```json\s*/i,
      ""
    );


  cleaned =
    cleaned.replace(
      /^```\s*/i,
      ""
    );


  cleaned =
    cleaned.replace(
      /\s*```$/i,
      ""
    );


  cleaned =
    cleaned.trim();


  try {

    return JSON.parse(
      cleaned
    );

  }

  catch (error) {

    const start =
      cleaned.indexOf(
        "{"
      );


    const end =
      cleaned.lastIndexOf(
        "}"
      );


    if (
      start !== -1 &&
      end > start
    ) {

      return JSON.parse(
        cleaned.substring(
          start,
          end + 1
        )
      );

    }


    throw new Error(
      "AI response was not valid JSON."
    );

  }

}


// ============================================================
// SEND REQUEST TO CLOUDFLARE WORKER
// ============================================================

async function askAI(
  prompt
) {

  const response =
    await fetch(
      AI_API_URL,
      {

        method:
          "POST",

        headers:
          {

            "Content-Type":
              "application/json"

          },

        body:
          JSON.stringify(
            {

              action:
                "generate",

              message:
                prompt

            }
          )

      }
    );


  let data;


  try {

    data =
      await response.json();

  }

  catch (error) {

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


// ============================================================
// AI CONVERSATION
// ============================================================

sendBtn.addEventListener(
  "click",
  async function () {

    const text =
      userText.value.trim();


    if (!text) {

      alert(
        "Please speak or type something first."
      );

      return;

    }


    sendBtn.disabled =
      true;


    status.textContent =
      "🤖 AI is thinking...";


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
        await askAI(
          prompt
        );


      const result =
        parseAIJson(
          raw
        );


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
          result.correction ||
          ""
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


      status.textContent =
        "✅ AI replied!";


      speakText(
        result.reply ||
        ""
      );

    }


    catch (error) {

      console.error(
        error
      );


      status.textContent =
        "❌ AI connection failed: " +
        error.message;


      aiReply.textContent =
        "The AI could not reply right now.";


      correction.textContent =
        "Please check the Cloudflare Worker connection.";


      question.textContent =
        "";

    }


    finally {

      sendBtn.disabled =
        false;

    }

  }
);


// ============================================================
// AI VOICE
// ============================================================

function speakText(
  text
) {

  if (
    !("speechSynthesis" in window)
  ) {

    return;

  }


  if (!text) {

    return;

  }


  window.speechSynthesis.cancel();


  const speech =
    new SpeechSynthesisUtterance(
      text
    );


  speech.lang =
    "en-US";


  speech.rate =
    0.9;


  speech.pitch =
    1;


  window.speechSynthesis.speak(
    speech
  );

}


// ============================================================
// VOCABULARY
// ============================================================

const vocabForm =
  document.getElementById(
    "vocabForm"
  );


const wordInput =
  document.getElementById(
    "wordInput"
  );


const meaningInput =
  document.getElementById(
    "meaningInput"
  );


const exampleInput =
  document.getElementById(
    "exampleInput"
  );


const vocabSearch =
  document.getElementById(
    "vocabSearch"
  );


const vocabList =
  document.getElementById(
    "vocabList"
  );


const clearVocabBtn =
  document.getElementById(
    "clearVocabBtn"
  );


// ============================================================
// ADD VOCABULARY
// ============================================================

vocabForm.addEventListener(
  "submit",
  function (event) {

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


    const newWord = {

      id:
        Date.now(),

      word:
        word,

      meaning:
        meaning,

      example:
        example

    };


    words.unshift(
      newWord
    );


    saveWords();


    vocabForm.reset();


    wordInput.focus();

  }
);


// ============================================================
// SEARCH VOCABULARY
// ============================================================

vocabSearch.addEventListener(
  "input",
  function () {

    renderVocabulary();

  }
);


// ============================================================
// DELETE ALL VOCABULARY
// ============================================================

clearVocabBtn.addEventListener(
  "click",
  function () {

    if (
      words.length === 0
    ) {

      return;

    }


    const confirmed =
      confirm(
        "Delete all saved vocabulary from this device?"
      );


    if (!confirmed) {

      return;

    }


    words =
      [];


    saveWords();

  }
);


// ============================================================
// DISPLAY VOCABULARY
// ============================================================

function renderVocabulary() {

  const search =
    vocabSearch.value
      .trim()
      .toLowerCase();


  const filtered =
    words.filter(
      function (item) {

        return (

          item.word
            .toLowerCase()
            .includes(search)

          ||

          item.meaning
            .toLowerCase()
            .includes(search)

          ||

          item.example
            .toLowerCase()
            .includes(search)

        );

      }
    );


  if (
    filtered.length === 0
  ) {

    vocabList.innerHTML =
      "<p class='muted'>" +
      "No vocabulary found. " +
      "Add your first word above." +
      "</p>";

    return;

  }


  vocabList.innerHTML =
    "";


  filtered.forEach(
    function (item) {

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
          "Example: " +
          item.example;

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
        function () {

          words =
            words.filter(
              function (wordItem) {

                return (
                  wordItem.id !==
                  item.id
                );

              }
            );


          saveWords();

        }
      );


      card.appendChild(
        word
      );


      card.appendChild(
        meaning
      );


      card.appendChild(
        example
      );


      card.appendChild(
        deleteButton
      );


      vocabList.appendChild(
        card
      );

    }
  );

}


// ============================================================
// INITIAL VOCABULARY DISPLAY
// ============================================================

renderVocabulary();


// ============================================================
// SENTENCE CHECKER
// ============================================================

const sentenceInput =
  document.getElementById(
    "sentenceInput"
  );


const checkSentenceBtn =
  document.getElementById(
    "checkSentenceBtn"
  );


const clearSentenceBtn =
  document.getElementById(
    "clearSentenceBtn"
  );


const sentenceResult =
  document.getElementById(
    "sentenceResult"
  );


// ============================================================
// CHECK SENTENCE
// ============================================================

checkSentenceBtn.addEventListener(
  "click",
  async function () {

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
        await askAI(
          prompt
        );


      const result =
        parseAIJson(
          raw
        );


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

    }


    catch (error) {

      sentenceResult.textContent =
        "❌ " +
        error.message;

    }


    finally {

      checkSentenceBtn.disabled =
        false;

    }

  }
);


// ============================================================
// CLEAR SENTENCE
// ============================================================

clearSentenceBtn.addEventListener(
  "click",
  function () {

    sentenceInput.value =
      "";


    sentenceResult.textContent =
      "Your result will appear here.";

  }
);


// ============================================================
// WEEKLY EXAM
// ============================================================
//
// VERY IMPORTANT:
//
// The exam NEVER creates random vocabulary.
//
// Every question comes from the words that the student
// personally saved in the Vocabulary section.
//
// Example:
//
// Vocabulary:
// Brave → সাহসী
// Honest → সৎ
// Improve → উন্নতি করা
//
// Exam questions are created ONLY from those words.
// ============================================================


const startEx
