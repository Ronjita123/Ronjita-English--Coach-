// ১. ডেলি শব্দ ভান্ডার (বাংলা উচ্চারণসহ)
const vocabSets = [
  [
    { word: "Fluency", pronounce: "ফ্লুয়েন্সি", meaning: "ভাষার সাবলীলতা", example: "I want fluency in English." },
    { word: "Improve", pronounce: "ইমপ্রুভ", meaning: "উন্নতি করা", example: "Practice helps to improve skills." },
    { word: "Confident", pronounce: "কনফিডেন্ট", meaning: "আত্মবিশ্বাসী", example: "Be confident while speaking." }
  ],
  [
    { word: "Achieve", pronounce: "অ্যাচিভ", meaning: "অর্জন করা", example: "Work hard to achieve goals." },
    { word: "Vocabulary", pronounce: "ভোকাভিউলারি", meaning: "শব্দভান্ডার", example: "Learn new vocabulary daily." },
    { word: "Practice", pronounce: "প্র্যাকটিস", meaning: "অনুশীলন", example: "Daily practice brings success." }
  ]
];

// পয়েন্ট সিস্টেম লোড করা
let score = parseInt(localStorage.getItem('userScore')) || 0;
let checkedCount = parseInt(localStorage.getItem('checkedCount')) || 0;

document.getElementById('daily-score').innerText = score;
document.getElementById('checked-count').innerText = checkedCount;

// দিনের ওপর ভিত্তি করে শব্দ লোড করা
const todayIndex = new Date().getDate() % vocabSets.length;
const todayVocabs = vocabSets[todayIndex];

const vocabContainer = document.getElementById('vocab-container');
vocabContainer.innerHTML = todayVocabs.map(v => `
  <div class="vocab-card">
    <div class="vocab-word">${v.word} <span class="vocab-pronounce">(${v.pronounce})</span></div>
    <div class="vocab-meaning">অর্থ: ${v.meaning}</div>
  </div>
`).join('');

// ২. সেন্টেন্স চেক ও পয়েন্ট যোগ লজিক
function checkSentence() {
  const input = document.getElementById('user-sentence').value.trim();
  const feedback = document.getElementById('sentence-feedback');
  feedback.classList.remove('hidden', 'success', 'error');

  if (!input) {
    feedback.classList.add('error');
    feedback.innerText = "⚠️ Please write a sentence first!";
    return;
  }

  const textLower = input.toLowerCase();
  
  // গ্রামার ভুল সনাক্তকরণ
  let grammarError = "";
  if (textLower.includes("want improve") || textLower.includes("want learn")) {
    grammarError = "Missing 'to' after 'want'. Correct: 'want TO improve'";
  } else if (textLower.includes("i am agree")) {
    grammarError = "Say 'I agree' instead of 'I am agree'.";
  }

  if (grammarError) {
    feedback.classList.add('error');
    feedback.innerText = "❌ Grammar Error: " + grammarError;
  } else {
    // পয়েন্ট হিসাব
    score += 10;
    checkedCount += 1;
    localStorage.setItem('userScore', score);
    localStorage.setItem('checkedCount', checkedCount);
    
    document.getElementById('daily-score').innerText = score;
    document.getElementById('checked-count').innerText = checkedCount;

    feedback.classList.add('success');
    feedback.innerText = "✓ Excellent sentence! You earned +10 points. 🎉";
    document.getElementById('user-sentence').value = ""; // বক্স ক্লিয়ার করা
  }
}

// ৩. ভয়েস স্পিকিং এবং ডাইনামিক AI চ্যাটিং
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('speech-result').innerText = `"${transcript}"`;
    processAIConversation(transcript);
  };
}

function toggleListening() {
  if (recognition) {
    recognition.start();
    document.getElementById('mic-btn').innerText = "🎙️ Listening... Speak now!";
  } else {
    alert("Speech recognition is not supported in this browser.");
  }
}

function processAIConversation(userText) {
  document.getElementById('mic-btn').innerText = "🎤 Start Speaking";
  
  const textLower = userText.toLowerCase();
  let correction = "✓ Grammar looks good!";
  let aiReply = "";

  // ডাইনামিক কনভারসেশন লজিক
  if (textLower.includes("hello") || textLower.includes("hi")) {
    aiReply = "Hello Ranjita! How are you doing today? What do you want to practice?";
  } else if (textLower.includes("how are you")) {
    aiReply = "I am doing great, thank you! How has your English practice been going?";
  } else if (textLower.includes("want improve")) {
    correction = "❌ Correction: Say 'I want TO improve' instead of 'want improve'.";
    aiReply = "That's a good goal! Daily speaking practice will surely improve your fluency.";
  } else if (textLower.includes("help me")) {
    aiReply = "Sure! Ask me any question or practice speaking sentences with me.";
  } else {
    aiReply = `That sounds interesting! Tell me more about "${userText}".`;
  }

  document.getElementById('ai-correction').innerText = correction;
  document.getElementById('ai-reply').innerText = aiReply;

  speakText(aiReply);
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

function speakAIReply() {
  const replyText = document.getElementById('ai-reply').innerText;
  if (replyText && replyText !== "AI response will appear here...") {
    speakText(replyText);
  }
  }
