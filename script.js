/* =========================================
   1. GEMINI API CONFIGURATION
========================================= */
const GEMINI_API_KEY = "AQ.Ab8RN6JSXiEHgXBDyIgY8J6z_WzThMb9yLKCd6TmHdmWOF66bw";

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  const data = await response.json();
  if (!response.ok || !data.candidates || !data.candidates[0]) {
    throw new Error(data.error?.message || "API Connect করা যাচ্ছে না। API Key যাচাই করুন।");
  }

  return data.candidates[0].content.parts[0].text;
}

/* =========================================
   2. TAB SWITCHING
========================================= */
function switchTab(sectionId, btnElement) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  document.getElementById(sectionId).classList.add('active');
  btnElement.classList.add('active');
}

/* =========================================
   3. HSC MCQ GENERATOR
========================================= */
async function generateMCQs() {
  const subject = document.getElementById("subjectSelect").value;
  const chapter = document.getElementById("chapterSelect").value;
  const container = document.getElementById("mcqContainer");

  container.innerHTML = `<div class="card"><strong>${subject} (${chapter})</strong> থেকে ১৫টি গুরুত্বপূর্ণ MCQ তৈরি হচ্ছে, অপেক্ষা করুন...</div>`;

  try {
    const prompt = `Act as an expert HSC Teacher in Bangladesh. Generate 15 multiple-choice questions (MCQs) in Bengali for Higher Secondary subject "${subject}", "${chapter}".
Format each question clearly in Markdown:
Question Number. Question
A) Option 1
B) Option 2
C) Option 3
D) Option 4
**সঠিক উত্তর:** [Correct Option]
**ব্যাখ্যা:** [Short Bengali Explanation]`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;">ত্রুটি: ${error.message}</div>`;
  }
}

/* =========================================
   4. DAILY VOCABULARY GENERATOR
========================================= */
async function generateVocab() {
  const container = document.getElementById("vocabContainer");
  container.innerHTML = `<div class="card">নতুন ১০টি শব্দ তৈরি করা হচ্ছে...</div>`;

  try {
    const prompt = `Generate 10 fresh, daily-use English vocabulary words for learners. Include Word, Pronunciation, English Meaning, Bengali Meaning, and an Example Sentence for each. Format nicely with Markdown.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;">ত্রুটি: ${error.message}</div>`;
  }
}

/* =========================================
   5. VOICE INPUT & SMART SENTENCE CHECKER
========================================= */
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("আপনার ব্রাউজারে ভয়েস টাইপিং সাপোর্ট করছে না। Chrome ব্রাউজার ব্যবহার করুন।");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  const micBtn = document.getElementById("micBtn");
  micBtn.textContent = "🎙️ Listening...";

  recognition.start();

  recognition.onresult = function(event) {
    document.getElementById("sentenceInput").value = event.results[0][0].transcript;
    micBtn.textContent = "🎙️ Voice";
  };

  recognition.onerror = function() {
    alert("কথা ঠিকমতো বোঝা যায়নি, আবার চেষ্টা করুন।");
    micBtn.textContent = "🎙️ Voice";
  };
}

async function checkSentence() {
  const input = document.getElementById("sentenceInput").value.trim();
  const container = document.getElementById("sentenceResult");

  if (!input) {
    alert("অনুগ্রহ করে আগে কোনো বাক্য লিখুন বা বলুন।");
    return;
  }

  container.innerHTML = `<div class="card">আপনার বাক্যটি পরীক্ষা করা হচ্ছে...</div>`;

  try {
    const prompt = `Act as an English Grammar Teacher. Review this sentence written by a student: "${input}".
1. Is it grammatically correct? (Yes/No)
2. Show the corrected/natural version.
3. Explain mistakes clearly in Bengali so the student can learn.`;

    const response = await callGemini(prompt);
    container.innerHTML = `<div class="card">${formatText(response)}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="card" style="color:red;">ত্রুটি: ${error.message}</div>`;
  }
}

/* =========================================
   6. HELPER FUNCTIONS
========================================= */
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function formatText(text) {
  return escapeHTML(text)
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
}
