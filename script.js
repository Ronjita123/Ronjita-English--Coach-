/* =========================================
   1. VOCABULARY DATABASE (25+ WORDS)
========================================= */
const vocabularyData = [
  { word: "Achieve", meaning: "অর্জন করা", example: "I want to achieve my goals." },
  { word: "Improve", meaning: "উন্নতি করা", example: "Practice helps to improve English." },
  { word: "Confidence", meaning: "আত্মবিশ্বাস", example: "Speak with confidence." },
  { word: "Fluency", meaning: "সাবলীলতা", example: "Reading books improves fluency." },
  { word: "Patience", meaning: "ধৈর্য", example: "Patience is key to success." },
  { word: "Opportunity", meaning: "সুযোগ", example: "Grab every good opportunity." },
  { word: "Knowledge", meaning: "জ্ঞান", example: "Knowledge is power." },
  { word: "Determine", meaning: "সংকল্প করা", example: "She is determined to learn." },
  { word: "Encourage", meaning: "উৎসাহ দেওয়া", example: "Always encourage others." },
  { word: "Succeed", meaning: "সফল হওয়া", example: "Hard work helps to succeed." },
  { word: "Challenge", meaning: "চ্যালেঞ্জ / চ্যালেঞ্জ নেওয়া", example: "Accept every challenge bravely." },
  { word: "Describe", meaning: "বর্ণনা করা", example: "Describe your daily routine." },
  { word: "Express", meaning: "প্রকাশ করা", example: "Express your ideas clearly." },
  { word: "Habit", meaning: "অভ্যাস", example: "Reading is a good habit." },
  { word: "Inspire", meaning: "অনুপ্রাণিত করা", example: "Her story inspired everyone." },
  { word: "Journey", meaning: "যাত্রা", example: "Learning is a lifelong journey." },
  { word: "Mistake", meaning: "ভুল", example: "Learn from your mistakes." },
  { word: "Practice", meaning: "অনুশীলন", example: "Daily practice makes perfect." },
  { word: "Quality", meaning: "গুণমান / যোগ্যতা", example: "Focus on quality work." },
  { word: "Respect", meaning: "শ্রদ্ধা করা", example: "Respect your teachers." },
  { word: "Support", meaning: "সাহায্য / সমর্থন করা", example: "Friends always support each other." },
  { word: "Understand", meaning: "বুঝতে পারা", example: "I understand your point." },
  { word: "Value", meaning: "মূল্য দেওয়া", example: "Value your precious time." },
  { word: "Wisdom", meaning: "জ্ঞান / বুদ্ধিমত্তা", example: "Wisdom comes with experience." },
  { word: "Explore", meaning: "নতুন কিছু খোঁজা বা জানা", example: "Explore new learning methods." }
];

let points = 0;
let sentenceCount = 0;

// Load Vocabulary on Start
window.onload = function() {
  renderVocabList();
};

function renderVocabList() {
  const listContainer = document.getElementById("vocabularyList");
  listContainer.innerHTML = "";

  vocabularyData.forEach((item, index) => {
    listContainer.innerHTML += `
      <div class="vocab-item">
        <strong>${index + 1}. ${item.word}</strong> (${item.meaning})
        <p><em>Example:</em> "${item.example}"</p>
      </div>
    `;
  });
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
   3. VOICE TO TEXT INPUT
========================================= */
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Voice input is not supported in this browser. Try Chrome browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = false;

  const micBtn = document.getElementById("voiceBtn");
  micBtn.textContent = "🎙️ Listening...";

  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("sentenceInput").value = transcript;
    micBtn.textContent = "🎙️ Voice";
  };

  recognition.onerror = function() {
    alert("Could not hear properly. Please try again.");
    micBtn.textContent = "🎙️ Voice";
  };

  recognition.onend = function() {
    micBtn.textContent = "🎙️ Voice";
  };
}

/* =========================================
   4. SENTENCE CHECK & POINT SYSTEM
========================================= */
function checkAndAddSentence() {
  const input = document.getElementById("sentenceInput");
  const resultDiv = document.getElementById("feedbackResult");
  const text = input.value.trim();

  if (!text) {
    alert("Please write or speak a sentence first.");
    return;
  }

  // Simple Grammar Verification Rules
  let words = text.split(" ");
  let isCapitalized = /^[A-Z]/.test(text);
  let hasValidLength = words.length >= 3;

  if (!isCapitalized) {
    resultDiv.innerHTML = `
      <div class="feedback-error">
        ❌ <strong>Correction Needed:</strong> ইংরেজি বাক্যের প্রথম অক্ষর সবসময় Capital Letter (বড় হাতের) দিয়ে শুরু করতে হয়। <br>
        <strong>ঠিক রূপ:</strong> "${text.charAt(0).toUpperCase() + text.slice(1)}"
      </div>
    `;
    return;
  }

  if (!hasValidLength) {
    resultDiv.innerHTML = `
      <div class="feedback-error">
        ❌ <strong>Correction Needed:</strong> বাক্যটি খুব ছোট হয়ে গেছে। অন্তত ৩টি শব্দ দিয়ে একটি পূর্ণাঙ্গ বাক্য তৈরি করুন।
      </div>
    `;
    return;
  }

  // Success Logic
  points += 10;
  sentenceCount += 1;

  document.getElementById("totalPoints").textContent = points;
  document.getElementById("statPoints").textContent = points;
  document.getElementById("statSentences").textContent = sentenceCount;

  if (points >= 50) {
    document.getElementById("userLevel").textContent = "Advanced Practitioner 🌟";
  } else if (points >= 20) {
    document.getElementById("userLevel").textContent = "Intermediate Learner 🚀";
  }

  resultDiv.innerHTML = `
    <div class="feedback-success">
      ✅ <strong>Great Job!</strong> বাক্যটি সফলভাবে জমা হয়েছে। <br>
      🎉 <strong>+10 Points Added!</strong>
    </div>
  `;

  // Clear input for next sentence
  input.value = "";
   }
       
