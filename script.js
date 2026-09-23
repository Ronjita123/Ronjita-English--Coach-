/* =========================================================
   RONJITA ENGLISH COACH
   Daily English Learning System
   ========================================================= */


/* =========================================================
   DAILY VOCABULARY
   প্রতিদিনের জন্য আলাদা vocabulary
   ========================================================= */

const dailyVocabulary = [

  [
    {
      word: "Improve",
      meaning: "উন্নতি করা",
      example: "I want to improve my English."
    },
    {
      word: "Confident",
      meaning: "আত্মবিশ্বাসী",
      example: "I want to become more confident."
    },
    {
      word: "Practice",
      meaning: "অনুশীলন করা",
      example: "I practice English every day."
    },
    {
      word: "Learn",
      meaning: "শেখা",
      example: "I learn new words every day."
    },
    {
      word: "Goal",
      meaning: "লক্ষ্য",
      example: "My goal is to speak English fluently."
    }
  ],

  [
    {
      word: "Brave",
      meaning: "সাহসী",
      example: "Be brave when you speak English."
    },
    {
      word: "Progress",
      meaning: "অগ্রগতি",
      example: "I can see my progress."
    },
    {
      word: "Habit",
      meaning: "অভ্যাস",
      example: "Practice can become a good habit."
    },
    {
      word: "Effort",
      meaning: "চেষ্টা",
      example: "Your effort will help you improve."
    },
    {
      word: "Success",
      meaning: "সাফল্য",
      example: "Hard work can lead to success."
    }
  ],

  [
    {
      word: "Journey",
      meaning: "যাত্রা",
      example: "Learning English is a journey."
    },
    {
      word: "Useful",
      meaning: "উপকারী",
      example: "English is useful in many situations."
    },
    {
      word: "Simple",
      meaning: "সহজ",
      example: "Let's start with simple English."
    },
    {
      word: "Understand",
      meaning: "বোঝা",
      example: "I understand this sentence."
    },
    {
      word: "Remember",
      meaning: "মনে রাখা",
      example: "I remember new vocabulary."
    }
  ],

  [
    {
      word: "Opportunity",
      meaning: "সুযোগ",
      example: "Every day is a new opportunity."
    },
    {
      word: "Challenge",
      meaning: "চ্যালেঞ্জ",
      example: "Learning English is a challenge."
    },
    {
      word: "Communicate",
      meaning: "যোগাযোগ করা",
      example: "English helps us communicate."
    },
    {
      word: "Express",
      meaning: "প্রকাশ করা",
      example: "I can express my ideas in English."
    },
    {
      word: "Fluent",
      meaning: "সাবলীল",
      example: "I want to become fluent in English."
    }
  ],

  [
    {
      word: "Achieve",
      meaning: "অর্জন করা",
      example: "I will achieve my English goal."
    },
    {
      word: "Focus",
      meaning: "মনোযোগ দেওয়া",
      example: "I need to focus on my practice."
    },
    {
      word: "Develop",
      meaning: "উন্নত করা",
      example: "I want to develop my speaking skills."
    },
    {
      word: "Mistake",
      meaning: "ভুল",
      example: "Making mistakes is part of learning."
    },
    {
      word: "Patient",
      meaning: "ধৈর্যশীল",
      example: "Be patient with yourself."
    }
  ],

  [
    {
      word: "Motivate",
      meaning: "উৎসাহিত করা",
      example: "My progress motivates me."
    },
    {
      word: "Positive",
      meaning: "ইতিবাচক",
      example: "Keep a positive attitude."
    },
    {
      word: "Knowledge",
      meaning: "জ্ঞান",
      example: "Reading gives us knowledge."
    },
    {
      word: "Improve",
      meaning: "উন্নতি করা",
      example: "Practice helps me improve."
    },
    {
      word: "Believe",
      meaning: "বিশ্বাস করা",
      example: "Believe in yourself."
    }
  ],

  [
    {
      word: "Opportunity",
      meaning: "সুযোগ",
      example: "I look for every opportunity to speak English."
    },
    {
      word: "Prepare",
      meaning: "প্রস্তুত করা",
      example: "I prepare for my English practice."
    },
    {
      word: "Discover",
      meaning: "আবিষ্কার করা",
      example: "I discover new words every day."
    },
    {
      word: "Useful",
      meaning: "উপকারী",
      example: "This word is very useful."
    },
    {
      word: "Achieve",
      meaning: "অর্জন করা",
      example: "I can achieve my goal."
    }
  ]

];


/* =========================================================
   PROGRESS SYSTEM
   ========================================================= */

let progress = JSON.parse(
  localStorage.getItem("ronjitaEnglishProgress")
) || {
  currentDay: 1,
  completedDays: 0,
  lastCompletedDate: null
};


/* =========================================================
   ELEMENTS
   ========================================================= */

const dayBadge =
  document.getElementById("dayBadge");

const dayTitle =
  document.getElementById("dayTitle");

const completeDayNumber =
  document.getElementById("completeDayNumber");

const currentDayStat =
  document.getElementById("currentDayStat");

const completedDaysStat =
  document.getElementById("completedDaysStat");

const vocabularyCountStat =
  document.getElementById("vocabularyCountStat");

const vocabularyList =
  document.getElementById("vocabularyList");

const selectedWord =
  document.getElementById("selectedWord");

const sentenceInput =
  document.getElementById("sentenceInput");

const checkSentenceButton =
  document.getElementById("checkSentenceButton");

const sentenceResult =
  document.getElementById("sentenceResult");

const messageInput =
  document.getElementById("messageInput");

const sendButton =
  document.getElementById("sendButton");

const chat =
  document.getElementById("chat");

const startSpeakingButton =
  document.getElementById("startSpeakingButton");

const speakingStatus =
  document.getElementById("speakingStatus");

const speechText =
  document.getElementById("speechText");

const speakSentenceButton =
  document.getElementById("speakSentenceButton");

const completeDayButton =
  document.getElementById("completeDayButton");

const completionMessage =
  document.getElementById("completionMessage");

const progressText =
  document.getElementById("progressText");

const goalVocabulary =
  document.getElementById("goalVocabulary");

const goalSentence =
  document.getElementById("goalSentence");

const goalSpeaking =
  document.getElementById("goalSpeaking");


/* =========================================================
   SAVE PROGRESS
   ========================================================= */

function saveProgress() {

  localStorage.setItem(
    "ronjitaEnglishProgress",
    JSON.stringify(progress)
  );

}


/* =========================================================
   LOAD DAILY VOCABULARY
   ========================================================= */

function getTodayVocabulary() {

  const index =
    (progress.currentDay - 1) %
    dailyVocabulary.length;

  return dailyVocabulary[index];

}


/* =========================================================
   DISPLAY DAY
   ========================================================= */

function displayDay() {

  dayBadge.textContent =
    "DAY " + progress.currentDay;

  dayTitle.textContent =
    "Day " + progress.currentDay;

  completeDayNumber.textContent =
    progress.currentDay;

  currentDayStat.textContent =
    progress.currentDay;

  completedDaysStat.textContent =
    progress.completedDays;

  progressText.textContent =
    "You have completed " +
    progress.completedDays +
    " day(s) of your English journey. 🌱";

}


/* =========================================================
   DISPLAY VOCABULARY
   ========================================================= */

function displayVocabulary() {

  const words = getTodayVocabulary();

  vocabularyList.innerHTML = "";

  words.forEach(function(item, index) {

    const vocabulary = document.createElement("div");

    vocabulary.className =
      "vocabulary-item";

    vocabulary.innerHTML = `

      <div class="word-top">

        <div>

          <div class="word">
            ${item.word}
          </div>

          <div class="meaning">
            বাংলা অর্থ: ${item.meaning}
          </div>

        </div>

        <button
          class="use-word-button"
          data-word="${item.word}"
        >
          Use This Word
        </button>

      </div>

      <div class="example">

        <strong>Example:</strong>
        ${item.example}

      </div>

    `;

    vocabularyList.appendChild(vocabulary);

  });

  vocabularyCountStat.textContent =
    words.length;

}


/* =========================================================
   SELECT VOCABULARY WORD
   ========================================================= */

vocabularyList.addEventListener(
  "click",
  function(event) {

    if (
      event.target.classList.contains(
        "use-word-button"
      )
    ) {

      const word =
        event.target.getAttribute("data-word");

      selectedWord.textContent =
        word;

      sentenceInput.focus();

      sentenceResult.innerHTML =
        "";

    }

  }
);


/* =========================================================
   CHECK SENTENCE
   ========================================================= */

checkSentenceButton.addEventListener(
  "click",
  function() {

    const sentence =
      sentenceInput.value.trim();

    const word =
      selectedWord.textContent.trim();

    if (word === "Select a vocabulary word") {

      sentenceResult.innerHTML =
        '<p class="error">Please select a vocabulary word first.</p>';

      return;

    }

    if (sentence === "") {

      sentenceResult.innerHTML =
        '<p class="error">Please write a sentence first.</p>';

      return;

    }

    const wordLower =
      word.toLowerCase();

    const sentenceLower =
      sentence.toLowerCase();

    if (sentenceLower.includes(wordLower)) {

      sentenceResult.innerHTML =
        '<p class="success">✓ Great! You used the vocabulary word correctly.</p>';

      goalSentence.textContent =
        "☑ Make a sentence";

    } else {

      sentenceResult.innerHTML =
        '<p class="error">Try to use the word "' +
        word +
        '" in your sentence.</p>';

    }

  }
);


/* =========================================================
   TEXT CONVERSATION
   ========================================================= */

sendButton.addEventListener(
  "click",
  sendMessage
);


messageInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      sendMessage();

    }

  }
);


function sendMessage() {

  const message =
    messageInput.value.trim();

  if (message === "") {

    return;

  }


  const userMessage =
    document.createElement("div");

  userMessage.className =
    "user-message";

  userMessage.innerHTML =
    "<strong>You:</strong> " +
    escapeHTML(message);

  chat.appendChild(userMessage);


  const coachMessage =
    document.createElement("div");

  coachMessage.className =
    "coach-message";

  const response =
    getCoachResponse(message);

  coachMessage.innerHTML =
    "<strong>AI Coach:</strong> " +
    response;

  chat.appendChild(coachMessage);


  messageInput.value = "";

  chat.scrollTop =
    chat.scrollHeight;

}


/* =========================================================
   SIMPLE COACH RESPONSE
   ========================================================= */

function getCoachResponse(message) {

  const text =
    message.toLowerCase();

  if (
    text.includes("hello") ||
    text.includes("hi")
  ) {

    return "Hello! 😊 Nice to practice English with you. How are you today?";

  }

  if (
    text.includes("how are you")
  ) {

    return "I'm doing great! Thank you. Now tell me about your day.";

  }

  if (
    text.includes("my name")
  ) {

    return "Nice to meet you! Keep practicing and tell me something about yourself.";

  }

  if (
    text.includes("thank")
  ) {

    return "You're welcome! Keep going. You're doing well. 🌱";

  }

  if (
    text.includes("good")
  ) {

    return "That's great! Can you make a longer sentence using today's vocabulary?";

  }

  return "Good attempt! 😊 Try to make your sentence a little longer. Keep practicing English every day.";

}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text;

  return div.innerHTML;

}


/* =========================================================
   SPEECH RECOGNITION
   ========================================================= */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;


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
    function() {

      startSpeakingButton.classList.add(
        "listening"
      );

      startSpeakingButton.textContent =
        "🔴 Listening...";

      speakingStatus.textContent =
        "I'm listening. Speak in English...";

    };


  recognition.onresult =
    function(event) {

      const transcript =
        event.results[0][0].transcript;

      speechText.textContent =
        transcript;

      speakingStatus.textContent =
        "Great! I heard you. 🎉";

      goalSpeaking.textContent =
        "☑ Practice speaking";

      startSpeakingButton.classList.remove(
        "listening"
      );

      startSpeakingButton.textContent =
        "🎤 Start Speaking";

    };


  recognition.onerror =
    function() {

      speakingStatus.textContent =
        "I couldn't hear you. Please try again.";

      startSpeakingButton.classList.remove(
        "listening"
      );

      startSpeakingButton.textContent =
        "🎤 Start Speaking";

    };


  recognition.onend =
    function() {

      startSpeakingButton.classList.remove(
        "listening"
      );

      startSpeakingButton.textContent =
        "🎤 Start Speaking";

    };


  startSpeakingButton.addEventListener(
    "click",
    function() {

      try {

        recognition.start();

      } catch (error) {

        console.log(error);

      }

    }
  );


} else {

  startSpeakingButton.disabled =
    true;

  startSpeakingButton.textContent =
    "🎤 Speech Not Supported";

  speakingStatus.textContent =
    "Your browser does not support speech recognition.";

}


/* =========================================================
   TEXT TO SPEECH
   ========================================================= */

speakSentenceButton.addEventListener(
  "click",
  function() {

    const text =
      speechText.textContent;

    if (
      !text ||
      text ===
      "Your spoken English will appear here."
    ) {

      speakText(
        "Hello! Let's practice English together."
      );

      return;

    }

    speakText(text);

  }
);


function speakText(text) {

  if (
    !("speechSynthesis" in window)
  ) {

    alert(
      "Your browser does not support voice playback."
    );

    return;

  }

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang =
    "en-US";

  speech.rate =
    0.9;

  window.speechSynthesis.cancel();

  window.speechSynthesis.speak(
    speech
  );

}


/* =========================================================
   COMPLETE DAY
   ========================================================= */

completeDayButton.addEventListener(
  "click",
  function() {

    if (
      progress.lastCompletedDate ===
      getDateKey()
    ) {

      completionMessage.innerHTML =
        '<p class="error">You have already completed today\'s lesson.</p>';

      return;

    }


    progress.completedDays++;

    progress.lastCompletedDate =
      getDateKey();

    progress.currentDay++;

    saveProgress();


    completionMessage.innerHTML =
      '<p class="success">🎉 Day completed! Your next lesson is Day ' +
      progress.currentDay +
      '.</p>';


    displayDay();

    displayVocabulary();


    goalVocabulary.textContent =
      "☐ Learn today's vocabulary";

    goalSentence.textContent =
      "☐ Make a sentence";

    goalSpeaking.textContent =
      "☐ Practice speaking";


    selectedWord.textContent =
      "Select a vocabulary word";

    sentenceInput.value =
      "";

    sentenceResult.innerHTML =
      "";


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================================================
   DATE KEY
   ========================================================= */

function getDateKey() {

  const date =
    new Date();

  return (
    date.getFullYear() +
    "-" +
    String(
      date.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
      date.getDate()
    ).padStart(2, "0")
  );

}


/* =========================================================
   START
   ========================================================= */

displayDay();

displayVocabulary();
