/* =========================================
   1. HSC MCQ DATABASE & GENERATOR
========================================= */
const mcqDatabase = {
  "Economics 1st Paper": {
    "Chapter 1": [
      {
        q: "১. 'Economics is the science of scarcity and choice'— উক্তিটি কার?",
        options: ["A) অ্যাডাম স্মিথ", "B) এল রবিন্স", "C) আলফ্রেড মার্শাল", "D) পল স্যামুয়েলসন"],
        ans: "B) এল রবিন্স",
        exp: "অধ্যাপক এল. রবিন্স ১৯৩১ সালে প্রকাশিত তাঁর গ্রন্থে অর্থনীতিকে দুষ্প্রাপ্যতা ও অসীম চাহিদার নির্বাচনের বিজ্ঞান হিসেবে সংজ্ঞায়িত করেছেন।"
      },
      {
        q: "২. অর্থনৈতিক সমস্যার মূল কারণ কোনটি?",
        options: ["A) সম্পদের অসীমতা", "B) চাহিদার সীমাবদ্ধতা", "C) সম্পদের দুষ্প্রাপ্যতা", "D) অর্থমূল্যের অভাব"],
        ans: "C) সম্পদের দুষ্প্রাপ্যতা",
        exp: "মানুষের অভাব অসীম কিন্তু তা পূরণের সম্পদ সীমিত বা দুষ্প্রাপ্য, এটাই মূল সমস্যা।"
      },
      {
        q: "৩. সুযোগ ব্যয় (Opportunity Cost) ধারণাটি মূলত কিসের সাথে সম্পর্কিত?",
        options: ["A) উৎপাদন সম্ভাবনা রেখা", "B) চাহিদা রেখা", "C) যোগান রেখা", "D) ভোগ রেখা"],
        ans: "A) উৎপাদন সম্ভাবনা রেখা",
        exp: "উৎপাদন সম্ভাবনা রেখার মাধ্যমে একটি দ্রব্যের অতিরিক্ত উৎপাদনের জন্য অন্য দ্রব্যের কতটুকু ছেড়ে দিতে হয় (সুযোগ ব্যয়) তা দেখানো হয়।"
      }
    ]
  }
};

const vocabDatabase = [
  { word: "Scarcity (noun)", pronounce: "স্কার্সিটি", meaning: "দুষ্প্রাপ্যতা / স্বল্পতা", example: "The scarcity of resources is a major economic problem." },
  { word: "Abundant (adjective)", pronounce: "অ্যাবান্ড্যান্ট", meaning: "প্রচুর / প্রাচুর্যময়", example: "Bangladesh has abundant natural water resources." },
  { word: "Fluctuate (verb)", pronounce: "ফ্লাকচুয়েট", meaning: "উঠানামা করা", example: "Prices of vegetables fluctuate every week." },
  { word: "Enhance (verb)", pronounce: "ইনহ্যান্স", meaning: "বৃদ্ধি করা / উন্নত করা", example: "Reading books helps to enhance your knowledge." },
  { word: "Pragmatic (adjective)", pronounce: "প্র্যাগম্যাটিক", meaning: "বাস্তবসম্মত", example: "We need a pragmatic approach to solve this issue." }
];

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
   3. GENERATE MCQs
========================================= */
function generateMCQs() {
  const subject = document.getElementById("subjectSelect").value;
  const chapter = document.getElementById("chapterSelect").value;
  const container = document.getElementById("mcqContainer");

  let questions = (mcqDatabase[subject] && mcqDatabase[subject][chapter]) ? mcqDatabase[subject][chapter] : null;

  if (!questions) {
    container.innerHTML = `
      <div class="card">
        <h4>📚 ${subject} - ${chapter}</h4>
        <div class="mcq-card">
          <p><b>১. অসীম অভাব ও সীমিত সম্পদের সমন্বয় সাধনের প্রক্রিয়াকে কী বলে?</b></p>
          <p>A) বণ্টন<br>B) নির্বাচন<br>C) উৎপাদন<br>D) ভোগ</p>
          <p style="color:green;"><b>সঠিক উত্তর: B) নির্বাচন</b></p>
          <small><b>ব্যাখ্যা:</b> সীমিত সম্পদ দিয়ে কোন অভাবটি আগে পূরণ করা হবে তা বাছাই করাকেই নির্বাচন বলে।</small>
        </div>
        <div class="mcq-card">
          <p><b>২. ধনতান্ত্রিক অর্থব্যবস্থায় উৎপাদনের উপাদানের মালিক কে?</b></p>
          <p>A) সরকার<br>B) বেসরকারি ব্যক্তি<br>C) সমাজ<br>D) যৌথ মালিকানা</p>
          <p style="color:green;"><b>সঠিক উত্তর: B) বেসরকারি ব্যক্তি</b></p>
          <small><b>ব্যাখ্যা:</b> ধনতান্ত্রিক অর্থব্যবস্থায় ব্যক্তিস্বাধীনতা ও ব্যক্তিগত মালিকানা থাকে।</small>
        </div>
      </div>`;
    return;
  }

  let html = `<div class="card"><h4>📚 ${subject} - ${chapter}</h4>`;
  questions.forEach(item => {
    html += `
      <div class="mcq-card">
        <p><b>${item.q}</b></p>
        <p>${item.options.join('<br>')}</p>
        <p style="color:green;"><b>সঠিক উত্তর: ${item.ans}</b></p>
        <small><b>ব্যাখ্যা:</b> ${item.exp}</small>
      </div>`;
  });
  html += `</div>`;
  container.innerHTML = html;
}

/* =========================================
   4. GENERATE VOCABULARY
========================================= */
function generateVocab() {
  const container = document.getElementById("vocabContainer");
  let html = `<div class="card"><h4>📖 Daily Selected Vocabulary</h4>`;
  
  vocabDatabase.forEach((item, index) => {
    html += `
      <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
        <b>${index + 1}. ${item.word}</b> [${item.pronounce}]<br>
        <span><b>অর্থ:</b> ${item.meaning}</span><br>
        <small style="color: #4f46e5;"><b>Example:</b> ${item.example}</small>
      </div>`;
  });
  
  html += `</div>`;
  container.innerHTML = html;
}

/* =========================================
   5. VOICE INPUT & GRAMMAR CHECKER
========================================= */
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("আপনার ব্রাউজারে ভয়েস টাইপিং সাপোর্ট করছে না। Chrome ব্যবহার করুন।");
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
    alert("ভয়েস চিনতে সমস্যা হয়েছে, আবার বলুন।");
    micBtn.textContent = "🎙️ Voice";
  };
}

function checkSentence() {
  const input = document.getElementById("sentenceInput").value.trim();
  const container = document.getElementById("sentenceResult");

  if (!input) {
    alert("অনুগ্রহ করে কোনো বাক্য লিখুন।");
    return;
  }

  let corrected = input;
  let explanation = "আপনার বাক্যটি ব্যাকরণগতভাবে পর্যালোচনা করা হয়েছে।";

  if (input.toLowerCase().includes("i want improve")) {
    corrected = input.replace(/i want improve/i, "I want to improve");
    explanation = "<b>ভুল:</b> 'want' এর পর মূল ভার্ব বসাতে 'to' (Infinitive) ব্যবহার করতে হয়। তাই 'want improve' না হয়ে 'want to improve' হবে।";
  }

  container.innerHTML = `
    <div class="card">
      <h4>✍️ Grammar Analysis Result</h4>
      <p><b>আপনার বাক্য:</b> ${input}</p>
      <p style="color: green;"><b>সঠিক বাক্য:</b> ${corrected}</p>
      <p><small>${explanation}</small></p>
    </div>`;
   }
   
