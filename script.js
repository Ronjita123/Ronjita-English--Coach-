// ১. Motivational Quotes (Random)
const quotes = [
  '"Practice makes progress, not perfection!"',
  '"Every day is a new chance to improve your English."',
  '"Small steps every day lead to big achievements."',
  '"Don\'t be afraid of making mistakes; learn from them!"'
];
document.getElementById('motivational-quote').innerText = quotes[Math.floor(Math.random() * quotes.length)];

// ২. অটোমেটিক দৈনিক ভোকাবুলারি লিস্ট
const vocabularies = [
  { word: "Improve", meaning: "উন্নতি করা / সুন্দর করা", example: "I want to improve my English speaking skill." },
  { word: "Achieve", meaning: "অর্জিত করা / অর্জন করা", example: "You can achieve your goals with hard work." },
  { word: "Confident", meaning: "আত্মবিশ্বাসী", example: "Practice makes you more confident." },
  { word: "Practice", meaning: "অনুশীলন করা", example: "I practice English every single day." },
  { word: "Fluency", meaning: "ভাষার সাবলীলতা", example: "Listening daily increases your fluency." }
];

// আজকের তারিখ অনুযায়ী অটোমেটিক ওয়ার্ড নেওয়া
const dayIndex = new Date().getDate() % vocabularies.length;
const todayVocab = vocabularies[dayIndex];

document.getElementById('word-display').innerText = `Word: ${todayVocab.word}`;
document.getElementById('meaning-display').innerText = `Meaning: ${todayVocab.meaning}`;
document.getElementById('example-display').innerText = `Example: ${todayVocab.example}`;

// ৩. বাক্য তৈরি ও ব্যাকরণ ভুল সনাক্তকরণ লজিক
function checkSentence() {
  const userInput = document.getElementById('user-sentence').value.trim();
  const feedbackBox = document.getElementById('sentence-feedback');
  feedbackBox.classList.remove('hidden', 'success', 'error');

  if (!userInput) {
    feedbackBox.classList.add('error');
    feedbackBox.innerText = "⚠️ Please write an English sentence first!";
    return;
  }

  const textLower = userInput.toLowerCase();
  const wordLower = todayVocab.word.toLowerCase();

  // ব্যাকরণ চেকিং সিস্টেম
  let errorFound = false;
  let correctionText = "";

  if (!textLower.includes(wordLower)) {
    errorFound = true;
    correctionText = `❌ Please use today's word "${todayVocab.word}" in your sentence.`;
  } else if (textLower.includes("want improve") || textLower.includes("want learn")) {
    errorFound = true;
    correctionText = `❌ Grammar Error! You missed 'to'. Correct: "I want TO ${todayVocab.word.toLowerCase()}..."`;
  } else if (textLower.includes("how much time i practice")) {
    errorFound = true;
    correctionText = `❌ Grammar Error! Correct format: "How much time should I practice every day?"`;
  } else if (textLower.includes("i am agree")) {
    errorFound = true;
    correctionText = `❌ Grammar Error! Say "I agree" instead of "I am agree".`;
  }

  if (errorFound) {
    feedbackBox.classList.add('error');
    feedbackBox.innerText = correctionText;
  } else {
    feedbackBox.classList.add('success');
    feedbackBox.innerText = `✓ Excellent! Your sentence is grammatically correct and uses the word "${todayVocab.word}" properly.`;
  }
}

// ৪. ভয়েস স্পিকিং এবং AI উত্তর দেওয়া (Text-to-Speech & Speech Recognition)
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

  recognition.onerror = function() {
    alert("Speech recognition error. Please make sure microphone permission is allowed.");
    document.getElementById('mic-btn').innerText = "🎤 Start Speaking";
  };
} else {
  alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
}

function toggleListening() {
  if (recognition) {
    recognition.start();
    document.getElementById('mic-btn').innerText = "🎙️ Listening... Speak now!";
  }
}

function processAIConversation(userText) {
  document.getElementById('mic-btn').innerText = "🎤 Start Speaking";
  
  const textLower = userText.toLowerCase();
  let correction = "✓ Your grammar looks good!";
  let aiReply = "That's great! Keep practicing your English every day.";

  // লাইভ ভুল ধরা ও উপযুক্ত কথা বলা
  if (textLower.includes("want improve") || textLower.includes("want learn")) {
    correction = "❌ Grammar Tip: You said 'want improve'. It should be 'want TO improve'.";
    aiReply = "Yes! You can definitely improve your English if you practice daily with me.";
  } else if (textLower.includes("how are you")) {
    correction = "✓ Your sentence is 100% correct!";
    aiReply = "I am doing great! How are you doing today?";
  } else if (textLower.includes("what is your name")) {
    correction = "✓ Your sentence is correct!";
    aiReply = "I am your AI English Coach! I am here to help you practice English.";
  } else if (textLower.includes("how much time")) {
    correction = "💡 Suggestion: Say 'How much time should I practice?'";
    aiReply = "Practicing just 15 to 30 minutes every day is enough to become fluent.";
  }

  document.getElementById('ai-correction').innerText = correction;
  document.getElementById('ai-reply').innerText = aiReply;

  // AI মুখে উত্তর দেবে (Audio Response)
  speakText(aiReply);
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // আগের ভয়েস অফ করা
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // ক্লিয়ার ও নরমাল স্পিড
    window.speechSynthesis.speak(utterance);
  }
}

function speakAIReply() {
  const replyText = document.getElementById('ai-reply').innerText;
  if (replyText && replyText !== "AI coach response will appear here...") {
    speakText(replyText);
  }
       }
