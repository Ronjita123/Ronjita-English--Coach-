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

  if (!input) return alert("Write a sentence first!");
  if (!apiKey) return alert("Please save your Gemini API Key first!");

  feedback.classList.remove('hidden');
  document.getElementById('feedback-grammar').innerText = "Analyzing with AI...";
  document.getElementById('feedback-bangla').innerText = "";

  const promptText = `Act as an English Teacher. Check grammar for: "${input}". Provide feedback in simple English, correct errors if any, and give Bangla translation. Output plain text.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await res.json();
    
    if (data.error) {
      document.getElementById('feedback-grammar').innerText = "API Key Error: " + data.error.message;
      return;
    }

    const reply = data.candidates[0].content.parts[0].text;
    document.getElementById('feedback-grammar').innerText = reply;
    feedback.className = "feedback-box success";
  } catch (e) {
    document.getElementById('feedback-grammar').innerText = "Connection error. Check your API key.";
  }
}

// ৪. ভয়েস স্পিকিং ও AI উত্তর
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
  if (!apiKey) return alert("Please enter Gemini API Key at the top!");

  document.getElementById('ai-reply').innerText = "AI is thinking...";
  document.getElementById('ai-reply-bangla').innerText = "প্রসেস হচ্ছে...";

  const promptText = `You are an English coach speaking to student Ranjita. 
  User said: "${userText}". 
  1. If there is a grammar error, correct it gently (e.g. You said X, correct way is Y).
  2. Answer her and ask an engaging follow-up question to keep the English conversation going!
  3. At the end, write "[BANGLA]" and provide the Bengali translation of your reply.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await res.json();

    if (data.error) {
      document.getElementById('ai-reply').innerText = "API Key Invalid or Expired. Please check key.";
      document.getElementById('ai-reply-bangla').innerText = "এপিআই কিতে সমস্যা আছে।";
      return;
    }

    const fullReply = data.candidates[0].content.parts[0].text;
    const parts = fullReply.split('[BANGLA]');

    const englishReply = parts[0].trim();
    const banglaReply = parts[1] ? parts[1].trim() : "অনুবাদ পাওয়া যায়নি।";

    document.getElementById('ai-reply').innerText = englishReply;
    document.getElementById('ai-reply-bangla').innerText = banglaReply;

    speakText(englishReply);
  } catch (e) {
    document.getElementById('ai-reply').innerText = "Error connecting to AI. Please verify API key.";
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

// ৫. ফ্রাইডে এক্সাম সেকশন
const today = new Date();
const isFriday = today.getDay() === 5;

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

  const promptText = `Generate 1 simple English translation or sentence-making question for a beginner. Provide plain text.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await res.json();
    document.getElementById('exam-question').innerText = "Exam Question: " + data.candidates[0].content.parts[0].text;
  } catch (e) {
    document.getElementById('exam-question').innerText = "Failed to load exam. Check API Key.";
  }
}

async function submitExamAnswer() {
  const answer = document.getElementById('exam-answer').value.trim();
  const question = document.getElementById('exam-question').innerText;
  const apiKey = localStorage.getItem('gemini_api_key');

  if (!answer) return alert("Write your answer first!");

  document.getElementById('exam-feedback').innerText = "Evaluating your answer...";

  const promptText = `Question: "${question}". Student Answer: "${answer}". Evaluate answer out of 10 with feedback in English and Bangla.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await res.json();
    document.getElementById('exam-feedback').innerText = data.candidates[0].content.parts[0].text;
  } catch (e) {
    document.getElementById('exam-feedback').innerText = "Error evaluating exam.";
  }
}
  
