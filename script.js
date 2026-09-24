// =====================================================
// RANJITA'S AI ENGLISH COACH
// Secure Gemini API via Cloudflare Worker
// =====================================================


// =====================================================
// 1. CLOUDFLARE WORKER URL
// =====================================================
//
// Cloudflare Worker তৈরি করার পরে এখানে Worker URL বসাবে.
//
// Example:
// const AI_API_URL = "https://ronjita-english-ai.username.workers.dev";
//

const AI_API_URL = "https://still-scene-e8cf.mstronjitaakter.workers.dev";

// =====================================================
// 2. DAILY SCORE
// =====================================================

let dailyScore =
  Number(localStorage.getItem("daily_score")) || 0;

document.getElementById("daily-score").innerText =
  dailyScore;


function increaseScore(points) {

  dailyScore += points;

  localStorage.setItem(
    "daily_score",
    dailyScore
  );

  document.getElementById("daily-score").innerText =
    dailyScore;
}


// =====================================================
// 3. CHECK AI CONNECTION
// =====================================================

async function checkAIConnection() {

  const status =
    document.getElementById("ai-status");

  if (
    !AI_API_URL ||
    AI_API_URL === "PASTE_YOUR_WORKER_URL_HERE"
  ) {

    status.innerText =
      "⚠️ AI Worker URL এখনো সেট করা হয়নি।";

    return;

  }

  status.innerText =
    "🔄 Connecting to AI...";

  try {

    const response =
      await fetch(AI_API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          action: "health",
          message: "Hello"
        })

      });


    const data =
      await response.json();


    if (response.ok && data.success) {

      status.innerText =
        "🟢 AI Coach is ready!";

    } else {

      status.innerText =
        "🔴 AI connection problem.";

    }

  } catch (error) {

    status.innerText =
      "🔴 Cannot connect to AI Worker.";

  }
}


// =====================================================
// 4. VOCABULARY
// =====================================================

const vocabSets = [

  [
    {
      word: "Improve",
      pronounce: "ইমপ্রুভ",
      meaning: "উন্নতি করা"
    },
    {
      word: "Fluency",
      pronounce: "ফ্লুয়েন্সি",
      meaning: "সাবলীলতা"
    }
  ],

  [
    {
      word: "Achieve",
      pronounce: "অ্যাচিভ",
      meaning: "অর্জন করা"
    },
    {
      word: "Confident",
      pronounce: "কনফিডেন্ট",
      meaning: "আত্মবিশ্বাসী"
    }
  ],

  [
    {
      word: "Practice",
      pronounce: "প্র্যাকটিস",
      meaning: "অনুশীলন"
    },
    {
      word: "Vocabulary",
      pronounce: "ভোকাভিউলারি",
      meaning: "শব্দভান্ডার"
    }
  ]

];


const todayVocabs =
  vocabSets[
    new Date().getDate() % vocabSets.length
  ];


document.getElementById(
  "vocab-container"
).innerHTML = todayVocabs.map(v => `

  <div class="vocab-card">

    <span class="vocab-word">
      ${v.word}
    </span>

    <span class="vocab-pronounce">
      (${v.pronounce})
    </span>

    -

    <span>
      ${v.meaning}
    </span>

  </div>

`).join("");


// =====================================================
// 5. SECURE AI REQUEST FUNCTION
// =====================================================

async function askAI(prompt) {

  if (
    !AI_API_URL ||
    AI_API_URL === "PASTE_YOUR_WORKER_URL_HERE"
  ) {

    throw new Error(
      "AI Worker URL is not configured."
    );

  }


  const response =
    await fetch(AI_API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        action: "generate",

        message: prompt

      })

    });


  let data;

  try {

    data = await response.json();

  } catch {

    throw new Error(
      "Invalid response from AI server."
    );

  }


  if (!response.ok || !data.success) {

    throw new Error(
      data.error ||
      "AI request failed."
    );

  }


  return data.text;

}


// =====================================================
// 6. SENTENCE CHECKER
// =====================================================

async function checkSentence() {

  const input =
    document
      .getElementById("user-sentence")
      .value
      .trim();


  const feedback =
    document.getElementById(
      "sentence-feedback"
    );


  const grammar =
    document.getElementById(
      "feedback-grammar"
    );


  const bangla =
    document.getElementById(
      "feedback-bangla"
    );


  if (!input) {

    alert(
      "Write a sentence first!"
    );

    return;

  }


  feedback.classList.remove(
    "hidden"
  );


  grammar.innerText =
    "🤖 AI is checking your sentence...";


  bangla.innerText = "";


  const prompt = `

You are a friendly English teacher.

Student sentence:
"${input}"

Do these tasks:

1. Check the grammar.
2. If incorrect, show the corrected sentence.
3. Explain the mistake simply.
4. Give the Bangla translation.
5. Keep the answer short and beginner-friendly.

Use exactly this format:

GRAMMAR:
...

CORRECT:
...

EXPLANATION:
...

BANGLA:
...

`;


  try {

    const reply =
      await askAI(prompt);


    const banglaMatch =
      reply.match(
        /BANGLA:\\s*([\\s\\S]*)/i
      );


    if (banglaMatch) {

      bangla.innerText =
        banglaMatch[1].trim();

      grammar.innerText =
        reply
          .replace(
            banglaMatch[0],
            ""
          )
          .trim();

    } else {

      grammar.innerText =
        reply;

    }


    feedback.className =
      "feedback-box success";


    increaseScore(1);


  } catch (error) {

    grammar.innerText =
      "❌ AI Error: " +
      error.message;

    bangla.innerText = "";

  }

}


// =====================================================
// 7. SPEECH RECOGNITION
// =====================================================

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


  recognition.onstart = function () {

    document.getElementById(
      "mic-btn"
    ).innerText =
      "🎙️ Listening... Speak now";


    document.getElementById(
      "mic-btn"
    ).disabled = true;

  };


  recognition.onend = function () {

    document.getElementById(
      "mic-btn"
    ).innerText =
      "🎤 Start Speaking";


    document.getElementById(
      "mic-btn"
    ).disabled = false;

  };


  recognition.onerror =
    function(event) {

      document.getElementById(
        "speech-result"
      ).innerText =
        "Microphone/Speech error: " +
        event.error;

    };


  recognition.onresult =
    function(event) {

      const transcript =
        event.results[0][0].transcript;


      document.getElementById(
        "speech-result"
      ).innerText =
        `"${transcript}"`;


      talkToAI(transcript);

    };

}


// =====================================================
// 8. START / STOP SPEAKING
// =====================================================

function toggleListening() {

  if (!recognition) {

    alert(
      "এই browser-এ Speech Recognition support নেই। Chrome ব্যবহার করে চেষ্টা করুন।"
    );

    return;

  }


  try {

    recognition.start();

  } catch (error) {

    console.log(error);

  }

}


// =====================================================
// 9. AI CONVERSATION
// =====================================================

async function talkToAI(userText) {

  const aiReply =
    document.getElementById(
      "ai-reply"
    );


  const banglaReply =
    document.getElementById(
      "ai-reply-bangla"
    );


  aiReply.innerText =
    "🤖 AI is thinking...";


  banglaReply.innerText =
    "প্রসেস হচ্ছে...";


  const prompt = `

You are Ranjita's friendly English speaking coach.

The student said:
"${userText}"

Do the following:

1. Correct any important grammar mistake gently.
2. Reply naturally to the student.
3. Ask one simple follow-up question.
4. Keep the English suitable for a beginner.
5. Then provide the Bangla meaning.

Use exactly this format:

ENGLISH:
...

BANGLA:
...

`;


  try {

    const fullReply =
      await askAI(prompt);


    const englishMatch =
      fullReply.match(
        /ENGLISH:\\s*([\\s\\S]*?)(?=BANGLA:|$)/i
      );


    const banglaMatch =
      fullReply.match(
        /BANGLA:\\s*([\\s\\S]*)/i
      );


    const english =
      englishMatch
        ? englishMatch[1].trim()
        : fullReply;


    const bangla =
      banglaMatch
        ? banglaMatch[1].trim()
        : "বাংলা অর্থ পাওয়া যায়নি।";


    aiReply.innerText =
      english;


    banglaReply.innerText =
      bangla;


    speakText(english);


    increaseScore(1);


  } catch (error) {

    aiReply.innerText =
      "❌ AI Error: " +
      error.message;

    banglaReply.innerText =
      "AI-এর সাথে সংযোগ করা যাচ্ছে না।";

  }

}


// =====================================================
// 10. TEXT TO SPEECH
// =====================================================

function speakText(text) {

  if (
    "speechSynthesis" in window
  ) {

    window.speechSynthesis.cancel();


    const utterance =
      new SpeechSynthesisUtterance(
        text
      );


    utterance.lang =
      "en-US";


    utterance.rate =
      0.9;


    window.speechSynthesis.speak(
      utterance
    );

  }

}


function speakAIReply() {

  const text =
    document.getElementById(
      "ai-reply"
    ).innerText;


  if (
    text &&
    text !==
    "AI response will appear here..."
  ) {

    speakText(text);

  }

}


// =====================================================
// 11. FRIDAY EXAM STATUS
// =====================================================

const today =
  new Date();


const isFriday =
  today.getDay() === 5;


if (isFriday) {

  document.getElementById(
    "exam-status"
  ).innerText =
    "🎉 Today is Friday! Weekly Exam Day.";

} else {

  document.getElementById(
    "exam-status"
  ).innerText =
    "Every Friday you can take your weekly AI English exam.";

}


// =====================================================
// 12. START EXAM
// =====================================================

async function startFridayExam() {

  const examBox =
    document.getElementById(
      "exam-box"
    );


  const question =
    document.getElementById(
      "exam-question"
    );


  examBox.classList.remove(
    "hidden"
  );


  question.innerText =
    "🤖 AI is preparing your exam question...";


  const prompt = `

You are an English teacher.

Create ONE beginner-level English exam question.

It can be:

- translation
OR
- sentence making
OR
- basic grammar.

Return only the question.

`;


  try {

    const reply =
      await askAI(prompt);


    question.innerText =
      "Exam Question: " +
      reply.trim();


  } catch (error) {

    question.innerText =
      "❌ Exam Error: " +
      error.message;

  }

}


// =====================================================
// 13. SUBMIT EXAM ANSWER
// =====================================================

async function submitExamAnswer() {

  const answer =
    document
      .getElementById(
        "exam-answer"
      )
      .value
      .trim();


  const question =
    document.getElementById(
      "exam-question"
    ).innerText;


  const feedback =
    document.getElementById(
      "exam-feedback"
    );


  if (!answer) {

    alert(
      "Write your answer first!"
    );

    return;

  }


  feedback.innerText =
    "🤖 AI is checking your answer...";


  const prompt = `

You are an English teacher.

Exam question:
"${question}"

Student answer:
"${answer}"

Evaluate the answer.

Give:

1. Score out of 10.
2. Whether it is correct.
3. Correct answer if necessary.
4. Short English feedback.
5. Bangla explanation.

Keep it simple.

`;


  try {

    const reply =
      await askAI(prompt);


    feedback.innerText =
      reply;


    increaseScore(2);


  } catch (error) {

    feedback.innerText =
      "❌ Exam Error: " +
      error.message;

  }

}


// =====================================================
// 14. START AI STATUS CHECK
// =====================================================

checkAIConnection();
