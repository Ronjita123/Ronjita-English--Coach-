/* =========================================
   1. GEMINI API CONFIGURATION
========================================= */
const GEMINI_API_KEY = "AQ.Ab8RN6IZcFLq8MJ69-dscGlI3OlY3_0o1XMZjUOnkjEW3OmOXg";

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  const data = await response.json();
  if (!response.ok || !data.candidates || !data.candidates[0]) {
    throw new Error(data.error?.message || "Errur fl-API Key. Jekk jogħġbok iċċekkja mill-ġdid.");
  }

  return data.candidates[0].content.parts[0].text;
}

/* =========================================
   2. TAB SWITCHING
========================================= */
function switchTab(sectionId, btnElement) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) targetSection.classList.add('active');
  if (btnElement) btnElement.classList.add('active');
}

/* =========================================
   3. HSC MCQ GENERATOR (20 NEW QUESTIONS)
========================================= */
async function generateMCQs() {
  const subjectSelect = document.getElementById("subjectSelect");
  const chapterSelect = document.getElementById("chapterSelect");
  const container = document.getElementById("mcqContainer");

  const subject = subjectSelect ? subjectSelect.value : "Economics";
  const chapter = chapterSelect ? chapterSelect.value : "1st Chapter";

  container.innerHTML = `<div class="card"><b>${subject} (${chapter})</b>: Qed jiġu ġġenerati 20 mistoqsija MCQ ġodda... Jekk jogħġbok stenna ftit sekondi.</div>`;

  try {
    const randomSeed = Math.random();
    const prompt = `Act as an expert HSC Teacher in Bangladesh. Generate 20 UNIQUE and NEW multiple-choice questions (MCQs) in Bengali for Higher Secondary subject "${subject}", "${chapter}". (Random seed: ${randomSeed})
Format each question clearly in Markdown:
**১. [Mistoqsija]**
A) [Opzjoni 1]
B) [Opzjoni 2]
C) [Opzjoni 3]
D) [Opzjoni 4]
**সঠিক উত্তর:** [Opzjoni Tattika]
**ব্যাখ্যা:** [Spjegazzjoni qasira bil-Bengali]
---`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>Errur:</b> ${error.message}</div>`;
  }
}

/* =========================================
   4. DAILY VOCABULARY GENERATOR (15 NEW WORDS)
========================================= */
async function generateVocab() {
  const container = document.getElementById("vocabContainer");
  container.innerHTML = `<div class="card">Qed jitgħabbew 15-il kelma vokabolarju ġodda minn AI...</div>`;

  try {
    const randomSeed = Math.random();
    const prompt = `Generate 15 completely NEW and UNIQUE daily-use English vocabulary words for HSC students learning English. (Seed: ${randomSeed})
Include: Word, Pronunciation, English Meaning, Bengali Meaning, and an Example Sentence for each. Format nicely with Markdown.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>Errur:</b> ${error.message}</div>`;
  }
}

/* =========================================
   5. FRIDAY VOCABULARY & GRAMMAR EXAM
========================================= */
async function generateFridayExam() {
  const container = document.getElementById("examContainer");
  if (!container) return;

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

  container.innerHTML = `<div class="card">Qed jiġi ppreparat it-test tal-Ingliż tal-ġimgħa...</div>`;

  try {
    const prompt = `Act as an English Tutor. Create a Weekly Practice Exam for an HSC student in Bangladesh (Target day: Friday/Weekly Test).
Include:
1. 5 Vocabulary Quiz Questions (Fill in the blanks or Choose correct meaning).
2. 5 Sentence Translation/Correction Exercises.
3. Provide Answer Key at the bottom hidden under a clear spoiler tag or section.
Format with clean Markdown.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">
      <h3>📝 Weekly English Practice Exam (${dayName})</h3>
      ${formatText(response)}
    </div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>Errur:</b> ${error.message}</div>`;
  }
}

/* =========================================
   6. AI ENGLISH TUTOR & GENERAL KNOWLEDGE CHAT
========================================= */
async function askAIAssistant() {
  const inputEl = document.getElementById("aiChatInput");
  const container = document.getElementById("aiChatResult");

  if (!inputEl || !inputEl.value.trim()) {
    alert("Jekk jogħġbok ikteb xi ħaġa jew saqsi mistoqsija!");
    return;
  }

  const userQuery = inputEl.value.trim();
  container.innerHTML = `<div class="card">Qed nipproċessa l-mistoqsija tiegħek...</div>`;

  try {
    const prompt = `You are a helpful AI Assistant & English Learning Coach for a student in Bangladesh.
User Question / Input: "${userQuery}"

Guidelines:
1. If the user asks in English, reply in clear, simple, and grammatically accurate English to encourage learning.
2. If the user asks a General Knowledge or outside subject question, answer it clearly and accurately.
3. If there are grammar mistakes in user's query, gently correct them at the end.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">
      <b>Tiegħek:</b> ${escapeHTML(userQuery)}<br><br>
      <b>AI Assistant:</b><br>${formatText(response)}
    </div>`;
    inputEl.value = "";
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>Errur:</b> ${error.message}</div>`;
  }
}

/* =========================================
   7. VOICE INPUT & SENTENCE CHECKER
========================================= */
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Il-browser tiegħek ma jappoġġjax voice input. Jekk jogħġbok uża Google Chrome.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  const micBtn = document.getElementById("micBtn");
  if (micBtn) micBtn.textContent = "🎙️ Listening...";

  recognition.start();

  recognition.onresult = function(event) {
    const sentenceInput = document.getElementById("sentenceInput");
    if (sentenceInput) sentenceInput.value = event.results[0][0].transcript;
    if (micBtn) micBtn.textContent = "🎙️ Voice";
  };

  recognition.onerror = function() {
    alert("Ma stajtx nifhem il-vuċi, ipprova mill-ġdid.");
    if (micBtn) micBtn.textContent = "🎙️ Voice";
  };
}

async function checkSentence() {
  const inputEl = document.getElementById("sentenceInput");
  const container = document.getElementById("sentenceResult");

  if (!inputEl || !inputEl.value.trim()) {
    alert("Jekk jogħġbok ikteb jew għid sentenza l-ewwel.");
    return;
  }

  const input = inputEl.value.trim();
  container.innerHTML = `<div class="card">Qed tiġi vverifikata s-sentenza...</div>`;

  try {
    const prompt = `Act as an English Grammar Teacher. Review this sentence written by a student: "${input}".
1. Is it grammatically correct? (Yes/No)
2. Show the corrected/natural version.
3. Explain mistakes clearly in Bengali so the student can learn.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>Errur:</b> ${error.message}</div>`;
  }
}

/* =========================================
   8. HELPER FUNCTIONS
========================================= */
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function formatText(text) {
  return escapeHTML(text)
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
       }
       
