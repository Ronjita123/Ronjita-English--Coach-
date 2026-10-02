// ১. প্রতিদিনের ৫টি ভোকাবুলারি, উচ্চারণ, অর্থ ও উদাহরণ
const dailyVocabularies = [
  {
    word: "Resilient",
    pronunciation: "/রিজিলিয়েন্ট/",
    meaning: "সহনশীল / স্থিতিস্থাপক",
    example: "She is resilient in times of hardship."
  },
  {
    word: "Abundance",
    pronunciation: "/অ্যাবানডেন্স/",
    meaning: "প্রাচুর্য / প্রচুর পরিমাণ",
    example: "There is an abundance of food in the store."
  },
  {
    word: "Prudent",
    pronunciation: "/প্রুডেন্ট/",
    meaning: "বিচক্ষণ / চিন্তাশীল",
    example: "It was a prudent decision to save money."
  },
  {
    word: "Meticulous",
    pronunciation: "/মেটিকিউলাস/",
    meaning: "অতি সতর্ক / খুঁতখুঁতে",
    example: "He is meticulous about his work."
  },
  {
    word: "Diligent",
    pronunciation: "/ডিলিজেন্ট/",
    meaning: "পরিশ্রমী",
    example: "Diligent students always perform well."
  }
];

// ভোকাবুলারি লোড করা
function loadVocabularies() {
  const container = document.getElementById('vocab-container');
  container.innerHTML = '';

  dailyVocabularies.forEach((v, idx) => {
    container.innerHTML += `
      <div class="vocab-card">
        <div class="vocab-word">${idx + 1}. ${v.word} <span style="font-size: 14px; color: #7f8c8d; font-weight: normal;">${v.pronunciation}</span></div>
        <p><b>বাংলা অর্থ:</b> ${v.meaning}</p>
        <p><b>উদাহরণ সেন্টেন্স:</b> <i>"${v.example}"</i></p>
      </div>
    `;
  });
}
document.addEventListener('DOMContentLoaded', loadVocabularies);

// ২. বাক্য যাচাই (Grammar Check) এবং অনুবাদ তৈরি
async function processSentence() {
  const text = document.getElementById('user-sentence').value.trim();
  const resultBox = document.getElementById('result-box');
  const grammarDiv = document.getElementById('grammar-feedback');
  const transDiv = document.getElementById('translation-feedback');
  const checkBtn = document.getElementById('check-btn');

  if (!text) {
    alert("অনুগ্রহ করে একটি বাক্য লিখুন!");
    return;
  }

  checkBtn.innerText = "যাচাই করা হচ্ছে...";
  checkBtn.disabled = true;

  try {
    // LanguageTool API দিয়ে গ্রামার ভুল ধরা
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'text': text, 'language': 'en-US' })
    });
    const data = await response.json();

    resultBox.classList.remove('hidden');

    if (data.matches.length === 0) {
      grammarDiv.innerHTML = `<p style="color: #27ae60; font-weight: bold;">✅ চমৎকার! আপনার বাক্যে কোনো গ্রামার ভুল নেই।</p>`;
    } else {
      let errorsHtml = `<p style="color: #e74c3c; font-weight: bold;">⚠️ বাক্যে কিছু সংশোধন প্রয়োজন:</p><ul>`;
      data.matches.forEach(m => {
        const replacements = m.replacements.map(r => r.value).slice(0, 2).join(" / ");
        errorsHtml += `<li><b>ভুল:</b> ${m.message} (সঠিক রূপ হতে পারে: <b>${replacements}</b>)</li>`;
      });
      errorsHtml += `</ul>`;
      grammarDiv.innerHTML = errorsHtml;
    }

    // বাক্যের আনুমানিক অনুবাদ দেখানো
    transDiv.innerHTML = `<p style="margin-top: 10px; color: #2c3e50;"><b>আপনার বাক্যের বাংলা অর্থ:</b> (প্রসেস করা হচ্ছে...)</p>`;
    
  } catch (err) {
    alert("নেটওয়ার্কে সংযোগ সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
  }

  checkBtn.innerText = "Check & Translate (ভুল ও অর্থ দেখুন)";
  checkBtn.disabled = false;
}

// ৩. AI Voice Partner (Speech Recognition & Voice Synthesis)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startVoiceChat() {
  if (!SpeechRecognition) {
    alert("আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই। Google Chrome ব্রাউজার ব্যবহার করুন।");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  const status = document.getElementById('voice-status');

  status.innerText = "🎧 শুনছি... বলুন!";
  recognition.start();

  recognition.onresult = function(event) {
    const userText = event.results[0][0].transcript;
    appendMessage('User', userText);
    status.innerText = "চিন্তা করছি...";

    // AI Response Simulation (কথা শুনে উত্তর ও নতুন প্রশ্ন করা)
    setTimeout(() => {
      generateAIResponse(userText);
    }, 1000);
  };

  recognition.onerror = function() {
    status.innerText = "কথা বোঝা যায়নি, আবার চেষ্টা করুন।";
  };
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById('chat-history');
  const msgDiv = document.createElement('div');
  msgDiv.className = sender === 'User' ? 'user-msg' : 'bot-msg';
  msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// AI এর রেসপন্স এবং পাল্টা প্রশ্ন করার লজিক
function generateAIResponse(userText) {
  let reply = "";
  const lower = userText.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi")) {
    reply = "Hello Ranjita! Great to hear your voice. What did you learn from today's vocabulary list?";
  } else if (lower.includes("fine") || lower.includes("good")) {
    reply = "I am glad to hear that! Can you tell me what your plans are for the rest of the day?";
  } else {
    reply = "That is interesting! Speaking every day will improve your fluency. What other topics would you like to discuss with me today?";
  }

  appendMessage('AI', reply);
  speakText(reply);
  document.getElementById('voice-status').innerText = "বাটনে চাপ দিয়ে আবার বলুন...";
}

// AI এর মুখে কথা বলানোর ফাংশন (Text to Speech)
function speakText(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  synth.speak(utterance);
                                 }
      
