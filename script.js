// ১. নেভিগেশন কন্ট্রোল (সেকশন পরিবর্তন করার জন্য)
function showSection(sectionId) {
  document.querySelectorAll('.card').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// ২. অধ্যায়ের লিস্ট (এখানে নতুন বিষয় বা অধ্যায় যোগ করতে পারবেন)
const chapters = {
  economics: ["১ম অধ্যায়: মৌলিক অর্থনৈতিক সমস্যা", "২য় অধ্যায়: ভোক্তা ও উৎপাদকের আচরণ"],
  geography: ["১ম অধ্যায়: প্রাকৃতিক ভূগোল", "২য় অধ্যায়: পৃথিবীর গঠন"],
  bangla: ["১ম অধ্যায়: অপরিচিতা", "২য় অধ্যায়: আমার পথ"],
  islamic_history: ["১ম অধ্যায়: প্রাক-ইসলামী আরব", "২য় অধ্যায়: হযরত মুহাম্মদ (সা:)"],
  psychology: ["১ম অধ্যায়: মনোবিজ্ঞান পরিচিতি", "২য় অধ্যায়: আচরণ ও আচরণের বিকাশ"]
};

// ৩. কুইজ প্রশ্ন ব্যাংক (ans: ০ মানে ১ম অপশন, ১ মানে ২য় অপশন)
const questionBank = {
  "economics_0": [
    { q: "অর্থনীতির জনক কে?", options: ["অ্যাডাম স্মিথ", "আলফ্রেড মার্শাল", "জে এম কেইন্স", "এল রবিন্স"], ans: 0 },
    { q: "অভাব অসীম কিন্তু সম্পদ কেমন?", options: ["অসীম", "সীমিত", "প্রচুর", "অনন্ত"], ans: 1 },
    { q: "সুযোগ ব্যয় ধারণাটি কিসের সাথে সম্পর্কিত?", options: ["সম্পদের দুষ্প্রাপ্যতা", "অর্থের যোগান", "ব্যাংক ঋণ", "বাজার ব্যবস্থা"], ans: 0 },
    { q: "ব্যাষ্টিক অর্থনীতিতে আলোচনা করা হয়-", options: ["একক অংশ", "সমগ্র অর্থনীতি", "জাতীয় আয়", "মোট বেকারত্ব"], ans: 0 },
    { q: "PPC এর পূর্ণরূপ কী?", options: ["Production Possibility Curve", "Price Power Curve", "Public Policy Center", "Product Price Card"], ans: 0 }
  ],
  "bangla_0": [
    { q: "অপরিচিতা গল্পের মূল চরিত্র কে?", options: ["অনুপম", "শম্ভুনাথ", "হরিশ", "বিনু দাদা"], ans: 0 },
    { q: "অনুপমের আসল বয়স কত ছিল?", options: ["২৭ বছর", "২০ বছর", "২৫ বছর", "৩০ বছর"], ans: 0 }
  ]
};

// ড্রপডাউনে অধ্যায় লোড করার ফাংশন
function loadChapters() {
  const sub = document.getElementById('subject-select').value;
  const chapSelect = document.getElementById('chapter-select');
  chapSelect.innerHTML = '<option value="">অধ্যায় নির্বাচন করুন</option>';

  if (sub && chapters[sub]) {
    chapters[sub].forEach((chap, idx) => {
      chapSelect.innerHTML += `<option value="${idx}">${chap}</option>`;
    });
  }
}

let currentQuestions = [];
let currentQIndex = 0;
let score = 0;

// পরীক্ষা শুরু করার ফাংশন
function startQuiz() {
  const sub = document.getElementById('subject-select').value;
  const chap = document.getElementById('chapter-select').value;

  if (!sub || chap === "") {
    alert("অনুগ্রহ করে বিষয় এবং অধ্যায় নির্বাচন করুন!");
    return;
  }

  const key = `${sub}_${chap}`;
  let rawQuestions = questionBank[key] || [];

  if (rawQuestions.length === 0) {
    alert("এই অধ্যায়ের প্রশ্ন দ্রুত যুক্ত করা হবে!");
    return;
  }

  // প্রশ্ন র‍্যান্ডমাইজেশন (প্রতিবার পরীক্ষা দিলে প্রশ্ন উলটপালট হয়ে নতুনভাবে আসবে)
  currentQuestions = [...rawQuestions].sort(() => Math.random() - 0.5);
  currentQIndex = 0;
  score = 0;

  document.getElementById('quiz-box').classList.remove('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
  
  showQuestion();
}

// স্ক্রিনে প্রশ্ন দেখানোর ফাংশন
function showQuestion() {
  const qObj = currentQuestions[currentQIndex];
  document.getElementById('question-text').innerText = `${currentQIndex + 1}. ${qObj.q}`;
  
  const optionsDiv = document.getElementById('options-container');
  optionsDiv.innerHTML = '';

  qObj.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(idx, qObj.ans);
    optionsDiv.appendChild(btn);
  });
}

// সঠিক বা ভুল উত্তর যাচাই
function selectAnswer(selected, correct) {
  const btns = document.querySelectorAll('#options-container button');
  btns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correct) btn.style.backgroundColor = '#2ecc71'; // সঠিক হলে সবুজ
    else if (idx === selected) btn.style.backgroundColor = '#e74c3c'; // ভুল হলে লাল
  });

  if (selected === correct) score++;
  document.getElementById('next-btn').classList.remove('hidden');
}

// পরবর্তী প্রশ্ন বা রেজাল্ট
function nextQuestion() {
  currentQIndex++;
  if (currentQIndex < currentQuestions.length) {
    showQuestion();
    document.getElementById('next-btn').classList.add('hidden');
  } else {
    document.getElementById('question-text').innerText = "🎉 পরীক্ষা সম্পন্ন হয়েছে!";
    document.getElementById('options-container').innerHTML = '';
    document.getElementById('next-btn').classList.add('hidden');
    
    const resDiv = document.getElementById('quiz-result');
    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `<h3>আপনার অর্জিত নম্বর: ${score} / ${currentQuestions.length}</h3>`;
  }
}

// ৪. ভোকাবুলারি ডাটাবেস
const vocabularies = [
  { word: "Resilient", meaning: "সহনশীল / স্থিতিস্থাপক", sentence: "She is resilient in the face of hardship.", translation: "কষ্টের মুখেও সে সহনশীল।" },
  { word: "Abundance", meaning: "প্রাচুর্য", sentence: "There is an abundance of natural resources.", translation: "প্রাকৃতিক সম্পদের প্রাচুর্য রয়েছে।" },
  { word: "Prudent", meaning: "বিচক্ষণ", sentence: "It was a prudent decision.", translation: "এটি একটি বিচক্ষণ সিদ্ধান্ত ছিল।" }
];

function loadVocab() {
  const container = document.getElementById('vocab-list');
  if(!container) return;
  container.innerHTML = '';
  vocabularies.forEach(v => {
    container.innerHTML += `
      <div class="vocab-card">
        <h3>${v.word}</h3>
        <p><b>অর্থ:</b> ${v.meaning}</p>
        <p><b>বাক্য:</b> ${v.sentence}</p>
        <p><b>অনুবাদ:</b> ${v.translation}</p>
      </div>
    `;
  });
}
loadVocab();

// ৫. রঞ্জিতার স্টাডি প্ল্যান ও টাইমার
let timerInterval;
let seconds = 0;

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    seconds++;
    let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('study-timer').innerText = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  document.getElementById('study-timer').innerText = "00:00:00";
}

// পরীক্ষার কাউন্টডাউন টাইমার (৩০ দিনের হিসাব)
const examDate = new Date();
examDate.setDate(examDate.getDate() + 30);

setInterval(() => {
  const now = new Date();
  const diff = examDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const countdownElem = document.getElementById('countdown');
  if(countdownElem) {
    countdownElem.innerText = `পরীক্ষার আর বাকি: ${days} দিন`;
  }
}, 1000);
  
