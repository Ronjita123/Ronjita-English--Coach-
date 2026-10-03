/* =========================================================
   RONJITA ENGLISH LEARNING WEBSITE
   Gemini API works through Cloudflare Worker
   ========================================================= */


/* =========================================================
   CLOUDFLARE WORKER
   ========================================================= */

const WORKER_URL =
  "https://still-scene-e8cf.mstronjitaakter.workers.dev";


/* =========================================================
   TODAY'S VOCABULARY
   ========================================================= */

const dailyVocabularies = [

  {
    word: "Resilient",
    pronunciation: "রিজিলিয়েন্ট",
    meaning: "সহনশীল / কঠিন পরিস্থিতি সামলে উঠতে সক্ষম",
    example: "She is resilient in times of hardship."
  },

  {
    word: "Abundance",
    pronunciation: "অ্যাবানডেন্স",
    meaning: "প্রাচুর্য / প্রচুর পরিমাণ",
    example: "There is an abundance of food in the store."
  },

  {
    word: "Prudent",
    pronunciation: "প্রুডেন্ট",
    meaning: "বিচক্ষণ / ভেবেচিন্তে সিদ্ধান্ত নেওয়া",
    example: "It was a prudent decision to save money."
  },

  {
    word: "Meticulous",
    pronunciation: "মেটিকিউলাস",
    meaning: "অতি সতর্ক / খুঁটিনাটি বিষয়ে যত্নশীল",
    example: "He is meticulous about his work."
  },

  {
    word: "Diligent",
    pronunciation: "ডিলিজেন্ট",
    meaning: "পরিশ্রমী / অধ্যবসায়ী",
    example: "Diligent students always perform well."
  }

];


/* =========================================================
   PRACTICE SENTENCES
   ========================================================= */

const practiceSentences = [

  "She is resilient in times of hardship.",

  "There is an abundance of food in the store.",

  "It was a prudent decision to save money.",

  "He is meticulous about his work.",

  "Diligent students always perform well."

];


/* =========================================================
   LOAD VOCABULARY
   ========================================================= */

function loadVocabularies() {

  const container =
    document.getElementById("vocab-container");

  if (!container) return;

  container.innerHTML = "";

  dailyVocabularies.forEach((v, index) => {

    container.innerHTML += `

      <div class="vocab-card">

        <div class="vocab-word">

          ${index + 1}. ${escapeHTML(v.word)}

          <span class="pronunciation">
            /${escapeHTML(v.pronunciation)}/
          </span>

        </div>

        <p>
          <b>বাংলা অর্থ:</b>
          ${escapeHTML(v.meaning)}
        </p>

        <p class="example">
          <b>Example:</b>
          <i>${escapeHTML(v.example)}</i>
        </p>

      </div>

    `;

  });

}


/* =========================================================
   LOAD SENTENCE PRACTICE
   ========================================================= */

function loadSentencePractice() {

  const container =
    document.getElementById("sentence-container");

  if (!container) return;

  container.innerHTML = "";

  practiceSentences.forEach((sentence, index) => {

    container.innerHTML += `

      <div class="practice-card">

        <p class="practice-sentence">
          ${index + 1}. ${escapeHTML(sentence)}
        </p>

        <textarea
          id="sentence-${index}"
          placeholder="এই vocabulary ব্যবহার করে নিজের একটি sentence লিখুন..."
        ></textarea>

        <button
          onclick="checkSentence(${index})">
          Check My Sentence
        </button>

        <div
          id="result-${index}"
          class="result"
          style="display:none;">
        </div>

      </div>

    `;

  });

}


/* =========================================================
   GEMINI AI THROUGH CLOUDFLARE WORKER
   ========================================================= */

async function askGemini(prompt) {

  const response = await fetch(WORKER_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      prompt: prompt
    })

  });


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText || "Worker request failed."
    );

  }


  const data =
    await response.json();


  if (!data.success) {

    throw new Error(
      data.error || "Gemini request failed."
    );

  }


  return data.text ||
    "AI কোনো উত্তর দিতে পারেনি.";

}


/* =========================================================
   SENTENCE CHECK
   ========================================================= */

async function checkSentence(index) {

  const textarea =
    document.getElementById(`sentence-${index}`);

  const result =
    document.getElementById(`result-${index}`);


  if (!textarea || !result) return;


  const userSentence =
    textarea.value.trim();


  if (!userSentence) {

    alert("আগে নিজের sentence লিখুন.");

    return;

  }


  result.style.display = "block";

  result.innerHTML =
    "⏳ AI আপনার sentence পরীক্ষা করছে...";


  const prompt = `

You are Ronjita's personal English teacher.

The student is a Bangla-speaking beginner/intermediate English learner.

The student wrote this sentence:

"${userSentence}"

Analyze the sentence carefully.

Answer in simple Bangla.

You MUST provide:

1. Correct or incorrect.
2. Exactly where the grammar mistake is, if there is one.
3. A simple explanation of the mistake.
4. The corrected English sentence.
5. The Bangla meaning of the student's ORIGINAL sentence.
6. The Bangla meaning of the CORRECTED sentence.
7. If the sentence is already correct, clearly say that it is correct and explain briefly why.

Do not give unnecessary information.

`;


  try {

    const answer =
      await askGemini(prompt);


    result.innerHTML =
      `<b>🤖 AI Teacher:</b><br><br>
       ${formatAIText(answer)}`;

  }

  catch (error) {

    console.error(
      "Sentence check error:",
      error
    );


    result.innerHTML =
      `❌ AI-এর সঙ্গে সংযোগ করা যাচ্ছে না।<br>
       <small>${escapeHTML(error.message)}</small>`;

  }

}


/* =========================================================
   FORMAT AI TEXT
   ========================================================= */

function formatAIText(text) {

  let safeText =
    escapeHTML(text);


  safeText =
    safeText.replace(
      /\*\*(.*?)\*\*/g,
      "<b>$1</b>"
    );


  safeText =
    safeText.replace(
      /\n/g,
      "<br>"
    );


  return safeText;

}


/* =========================================================
   VOICE RECOGNITION
   ========================================================= */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


let recognition = null;

let isListening = false;


/* =========================================================
   VOICE CONVERSATION HISTORY
   ========================================================= */

let conversationHistory = [];


/* =========================================================
   START VOICE CHAT
   ========================================================= */

function startVoiceChat() {

  if (!SpeechRecognition) {

    alert(
      "আপনার browser Speech Recognition support করছে না। Android Chrome ব্যবহার করে চেষ্টা করুন."
    );

    return;

  }


  if (isListening) {

    return;

  }


  recognition =
    new SpeechRecognition();


  recognition.lang =
    "en-US";


  recognition.interimResults =
    false;


  recognition.continuous =
    false;


  const status =
    document.getElementById(
      "voice-status"
    );


  const micButton =
    document.getElementById(
      "mic-btn"
    );


  if (!status || !micButton) {

    return;

  }


  isListening = true;


  micButton.disabled =
    true;


  micButton.innerText =
    "🎧 শুনছি...";


  status.innerText =
    "ইংরেজিতে বলুন...";


  recognition.start();


  recognition.onresult =
    async function(event) {

      const userText =
        event.results[0][0].transcript;


      appendMessage(
        "User",
        userText
      );


      conversationHistory.push({

        role: "user",

        text: userText

      });


      status.innerText =
        "🤖 AI ভাবছে...";


      try {

        const reply =
          await generateSpeakingResponse(
            userText
          );


        appendMessage(
          "AI",
          reply
        );


        conversationHistory.push({

          role: "assistant",

          text: reply

        });


        speakText(reply);

      }


      catch (error) {

        console.error(
          "Voice AI error:",
          error
        );


        appendMessage(
          "AI",
          "Sorry, I couldn't connect right now. Please try again."
        );

      }


      isListening =
        false;


      micButton.disabled =
        false;


      micButton.innerText =
        "🎤 আবার কথা বলুন";


      status.innerText =
        "আবার microphone চাপুন এবং ইংরেজিতে কথা বলুন.";

    };


  recognition.onerror =
    function(error) {

      console.error(
        "Speech recognition error:",
        error
      );


      isListening =
        false;


      micButton.disabled =
        false;


      micButton.innerText =
        "🎤 আবার কথা বলুন";


      status.innerText =
        "কথা বোঝা যায়নি। আবার চেষ্টা করুন.";

    };


  recognition.onend =
    function() {

      isListening =
        false;


      micButton.disabled =
        false;


      if (
        micButton.innerText ===
        "🎧 শুনছি..."
      ) {

        micButton.innerText =
          "🎤 আবার কথা বলুন";

      }

    };

}


/* =========================================================
   GENERATE NATURAL SPEAKING RESPONSE
   ========================================================= */

async function generateSpeakingResponse(userText) {

  let previousConversation = "";


  conversationHistory
    .slice(-8)
    .forEach(message => {

      previousConversation +=
        `${message.role}: ${message.text}\n`;

    });


  const prompt = `

You are Ronjita's personal English speaking teacher and natural conversation partner.

The student is a Bangla-speaking beginner/intermediate English learner.

Your goal is to help her become comfortable speaking English.

Previous conversation:

${previousConversation}

Student's latest message:

"${userText}"

Follow these rules:

1. Reply naturally in simple English.
2. Keep the response suitable for a beginner/intermediate learner.
3. Do not give a long grammar lecture.
4. If there is an important English mistake, gently correct it.
5. After responding, ALWAYS ask exactly ONE new question.
6. The new question should naturally continue the conversation.
7. Use information from the student's previous answers when useful.
8. Do not repeatedly ask the same question.
9. Encourage the student to speak more.
10. Use the name Ronjita naturally, but do not repeat it unnecessarily.
11. Keep the response short enough for a voice conversation.
12. Do not use complicated vocabulary unless teaching it.
13. Return ONLY the words that should be spoken aloud.
14. Do not write labels such as "AI:", "Correction:", or "Question:".

Example:

Student:
"I study English today."

Good response:
"Nice! A more natural way to say that is, 'I studied English today.' What English topic did you practice?"

Student:
"I like watching dramas."

Good response:
"That sounds fun! What kind of dramas do you usually watch?"

`;


  return await askGemini(prompt);

}


/* =========================================================
   SHOW CHAT MESSAGE
   ========================================================= */

function appendMessage(
  sender,
  text
) {

  const chatBox =
    document.getElementById(
      "chat-history"
    );


  if (!chatBox) return;


  const div =
    document.createElement(
      "div"
    );


  if (sender === "User") {

    div.className =
      "user-msg";


    div.innerHTML =
      `<b>You:</b> ${escapeHTML(text)}`;

  }

  else {

    div.className =
      "bot-msg";


    div.innerHTML =
      `<b>AI:</b> ${escapeHTML(text)}`;

  }


  chatBox.appendChild(
    div
  );


  chatBox.scrollTop =
    chatBox.scrollHeight;

}


/* =========================================================
   TEXT TO SPEECH
   ========================================================= */

function speakText(text) {

  if (
    !window.speechSynthesis
  ) {

    return;

  }


  window.speechSynthesis.cancel();


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    "en-US";


  utterance.rate =
    0.9;


  utterance.pitch =
    1;


  window.speechSynthesis.speak(
    utterance
  );

}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(text) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    text;


  return div.innerHTML;

}


/* =========================================================
   CLEAR VOICE CHAT
   ========================================================= */

function clearVoiceChat() {

  conversationHistory = [];


  const chatBox =
    document.getElementById(
      "chat-history"
    );


  if (chatBox) {

    chatBox.innerHTML = "";

  }


  const status =
    document.getElementById(
      "voice-status"
    );


  if (status) {

    status.innerText =
      "AI-এর সঙ্গে কথা বলতে microphone চাপুন.";

  }

}


/* =========================================================
   START WEBSITE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadVocabularies();

    loadSentencePractice();

  }
);
