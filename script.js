// ১. API Key সেভ
function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (key) {
    localStorage.setItem('gemini_api_key', key);
    alert('API Key Saved Successfully!');
  }
}
document.getElementById('api-key-input').value = localStorage.getItem('gemini_api_key') || '';

// ২. ভোকাবুলারি লিস্ট
const vocabSets = [
  [{ word: "Improve", pronounce: "ইমপ্রুভ", meaning: "উন্নতি করা" }, { word: "Fluency", pronounce: "ফ্লুয়েন্সি", meaning: "সাবলীলতা" }],
  [{ word: "Achieve", pronounce: "অ্যাচিভ", meaning: "অর্জন করা" }, { word: "Confident", pronounce: "কনফিডেন্ট", meaning: "আত্মবিশ্বাসী" }],
  [{ word: "Practice", pronounce: "প্র্যাকটিস", meaning: "অনুশীলন" }, { word: "Vocabulary", pronounce: "ভোকাভিউলারি", meaning: "শব্দভান্ডার" }]
];

const todayVocabs = vocabSets[new Date().getDate() % vocabSets.length];
document.getElementById('vocab-container').innerHTML = todayVocabs.map(v => `
  <div class="vocab-card">
    <span class="vocab-word">${v.word} (${v.pronounce})</span> - <span>${v.meaning}</span>
  </div>
`).join('');

// ৩. Gemini API দিয়ে সেন্টেন্স চেক ও বাংলা অনুবাদ
async function checkSentence() {
  const input = document.getElementById('user-sentence').value.trim();
  const feedback = document.getElementById('sentence-feedback');
  const apiKey = localStorage.getItem('gemini_api_key');

  if (!input || !apiKey) {
    alert("Please enter API Key and write a sentence!");
    return;
  }

  feedback.classList.remove('hidden');
  document.getElementById('feedback-grammar').innerText = "Analyzing with AI...";

  const prompt = `Act as an English Teacher. Check grammar for: "${input}". 
  Provide response in JSON format: 
  {"isCorrect": true/false, "correction": "Grammar feedback here", "banglaTranslation": "Bangla translation"}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    const cleanJson = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, ''));

    document.getElementById('feedback-grammar').innerText = cleanJson.correction;
    document.getElementById('feedback-bangla').innerText = "বাংলা অর্থ: " + cleanJson.banglaTranslation;
    feedback.className = "feedback-box success";
  } catch (e) {
    document.getElementById('feedback-grammar').innerText = "Error checking sentence. Check API key.";
  }
}

// ৪. ভয়েস স্পিকিং
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('speech-result').innerText = `"${transcript}"`;
    talkToAI(transcript);
  };
}

function toggleListening() {
  if (recognition) recognition.start();
}

async function talkToAI(userText) {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) return alert("Please enter Gemini API Key!");

  const prompt = `You are an English coach for Ranjita. User said: "${userText}". 
  Correct grammar errors if any, reply nicely, and ask a follow-up question. 
  Output JSON format: {"englishReply": "Reply and question", "banglaTranslation": "Bangla translation"}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    const cleanJson = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, ''));

    document.getElementById('ai-reply').innerText = cleanJson.englishReply;
    document.getElementById('ai-reply-bangla').innerText = cleanJson.banglaTranslation;
    speakText(cleanJson.englishReply);
  } catch (e) {
    document.getElementById('ai-reply').innerText = "API Error. Check Key.";
  }
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
}

function speakAIReply() {
  speakText(document.getElementById('ai-reply').innerText);
}

// -------------------------------------------------------------
// ৫. FRIDAY EXAM SYSTEM (শুক্রবার এক্সাম নেওয়ার বিশেষ লজিক)
// -------------------------------------------------------------
const today = new Date();
const isFriday = today.getDay() === 5; // 5 মানে শুক্রবার

if (isFriday) {
  document.getElementById('exam-status').innerText = "🎉 Today is Friday! It's Weekly Exam Day. Click below to start.";
} else {
  document.getElementById('exam-status').innerText = "Note: Every Friday, AI will generate a test based on your weekly study!";
}

async function startFridayExam() {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) return alert("Please save your API Key first!");

  document.getElementById('exam-box').classList.remove('hidden');
  document.getElementById('exam-question').innerText = "AI is generating your Exam Question...";

  const prompt = `Create 1 English translation or sentence-making question for a student using basic vocabulary words like (Improve, Fluency, Confident, Achieve). Keep it simple and clear.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    document.getElementById('exam-question').innerText = "Exam Question: " + data.candidates[0].content.parts[0].text;
  } catch (e) {
    document.getElementById('exam-question').innerText = "Failed to load exam. Try again.";
  }
}

async function submitExamAnswer() {
  const answer = document.getElementById('exam-answer').value.trim();
  const question = document.getElementById('exam-question').innerText;
  const apiKey = localStorage.getItem('gemini_api_key');

  if (!answer) return alert("Write your answer first!");

  document.getElementById('exam-feedback').innerText = "Evaluating your answer...";

  const prompt = `Question was: "${question}". Student Answer: "${answer}". 
  Evaluate answer, give marks out of 10, and provide friendly feedback in simple English and Bangla.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    document.getElementById('exam-feedback').innerText = data.candidates[0].content.parts[0].text;
  } catch (e) {
    document.getElementById('exam-feedback').innerText = "Error evaluating exam.";
  }
      }
  
