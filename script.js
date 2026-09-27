/* =========================================
   1. GEMINI API CONFIGURATION
========================================= */
const KEY_PART1 = "AQ.Ab8RN6IYLYiiBdruQpL0FKdC-RbZ";
const KEY_PART2 = "upsIzHocg-VU4qTlcGkLoQ";
const GEMINI_API_KEY = KEY_PART1 + KEY_PART2;

async function callGemini(prompt) {
  // Using Gemini 1.5 Flash Model
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  const data = await response.json();
  if (!response.ok || !data.candidates || !data.candidates[0]) {
    throw new Error(data.error?.message || "API Key বা সার্ভারে সমস্যা দেখা দিয়েছে। দয়া করে পেজটি রিফ্রেশ করুন।");
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

  container.innerHTML = `<div class="card"><b>${subject} (${chapter})</b>: 20টি সম্পূর্ণ নতুন MCQ প্রশ্ন তৈরি হচ্ছে, 10-15 সেকেন্ড অপেক্ষা করুন...</div>`;

  try {
    const randomSeed = Math.random();
    const prompt = `Act as an expert HSC Teacher in Bangladesh. Generate 20 UNIQUE and NEW multiple-choice questions (MCQs) in Bengali for Higher Secondary subject "${subject}", "${chapter}". (Random seed: ${randomSeed})
Format each question clearly in Markdown:
**১. [প্রশ্ন]**
A) [অপশন ১]
B) [অপশন ২]
C) [অপশন ৩]
D) [অপশন ৪]
**সঠিক উত্তর:** [সঠিক অপশন]
**ব্যাখ্যা:** [সংক্ষিপ্ত বাংলা ব্যাখ্যা]
---`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>ত্রুটি:</b> ${error.message}</div>`;
  }
}

/* =========================================
   4. DAILY VOCABULARY GENERATOR (15 NEW WORDS)
========================================= */
async function generateVocab() {
  const container = document.getElementById("vocabContainer");
  container.innerHTML = `<div class="card">AI থেকে একদম নতুন 15টি শব্দ লোড হচ্ছে, অপেক্ষা করুন...</div>`;

  try {
    const randomSeed = Math.random();
    const prompt = `Generate 15 completely NEW and UNIQUE daily-use English vocabulary words for HSC students learning English. (Seed: ${randomSeed})
Include: Word, Pronunciation, English Meaning, Bengali Meaning, and an Example Sentence for each. Format nicely with Markdown.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>ত্রুটি:</b> ${error.message}</div>`;
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

  container.innerHTML = `<div class="card">সাপ্তাহিক ইংরেজি এক্সাম প্রস্তুত হচ্ছে, অপেক্ষা করুন...</div>`;

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
    container.innerHTML = `<div class="card" style="color:red;"><b>ত্রুটি:</b> ${error.message}</div>`;
  }
}

/* =========================================
   6. AI ENGLISH TUTOR & GENERAL KNOWLEDGE CHAT
========================================= */
async function askAIAssistant() {
  const inputEl = document.getElementById("aiChatInput");
  const container = document.getElementById("aiChatResult");

  if (!inputEl || !inputEl.value.trim()) {
    alert("অনুগ্রহ করে একটি প্রশ্ন লিখুন!");
    return;
  }

  const userQuery = inputEl.value.trim();
  container.innerHTML = `<div class="card">উত্তর খোঁজা হচ্ছে...</div>`;

  try {
    const prompt = `You are a helpful AI Assistant & English Learning Coach for a student in Bangladesh.
User Question / Input: "${userQuery}"

Guidelines:
1. If the user asks in English, reply in clear, simple, and grammatically accurate English to encourage learning.
2. If the user asks a General Knowledge or outside subject question, answer it clearly and accurately.
3. If there are grammar mistakes in user's query, gently correct them at the end.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">
      <b>আপনার প্রশ্ন:</b> ${escapeHTML(userQuery)}<br><br>
      <b>AI উত্তর:</b><br>${formatText(response)}
    </div>`;
    inputEl.value = "";
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>ত্রুটি:</b> ${error.message}</div>`;
  }
}

/* =========================================
   7. VOICE INPUT & SENTENCE CHECKER
========================================= */
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("আপনার ব্রাউজারে ভয়েস টাইপিং সাপোর্ট করছে না। Chrome ব্রাউজার ব্যবহার করুন।");
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
    alert("কথা ঠিকমতো বোঝা যায়নি, আবার চেষ্টা করুন।");
    if (micBtn) micBtn.textContent = "🎙️ Voice";
  };
}

async function checkSentence() {
  const inputEl = document.getElementById("sentenceInput");
  const container = document.getElementById("sentenceResult");

  if (!inputEl || !inputEl.value.trim()) {
    alert("অনুগ্রহ করে আগে কোনো বাক্য লিখুন বা বলুন।");
    return;
  }

  const input = inputEl.value.trim();
  container.innerHTML = `<div class="card">বাক্যটি পর্যবেক্ষণ করা হচ্ছে...</div>`;

  try {
    const prompt = `Act as an English Grammar Teacher. Review this sentence written by a student: "${input}".
1. Is it grammatically correct? (Yes/No)
2. Show the corrected/natural version.
3. Explain mistakes clearly in Bengali so the student can learn.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;"><b>ত্রুটি:</b> ${error.message}</div>`;
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
