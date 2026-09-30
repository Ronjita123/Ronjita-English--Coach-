// ৪. ৩৬৫ দিনের বিশাল ভোকাবুলারি ডাটাবেস (নমুনা হিসেবে শব্দ যুক্ত করা আছে)
const 365Vocabularies = [
  { word: "Resilient", meaning: "সহনশীল / স্থিতিস্থাপক", sentence: "She is resilient in hardship.", translation: "কষ্টের মুখেও সে সহনশীল।" },
  { word: "Abundance", meaning: "প্রাচুর্য", sentence: "There is an abundance of resources.", translation: "সম্পদের প্রাচুর্য রয়েছে।" },
  { word: "Prudent", meaning: "বিচক্ষণ", sentence: "It was a prudent decision.", translation: "এটি একটি বিচক্ষণ সিদ্ধান্ত ছিল।" },
  { word: "Meticulous", meaning: "অতি সতর্ক", sentence: "He is meticulous in his work.", translation: "সে তার কাজে অত্যন্ত সতর্ক।" },
  { word: "Diligent", meaning: "পরিশ্রমী", sentence: "Diligent students succeed.", translation: "পরিশ্রমী শিক্ষার্থীরা সফল হয়।" },
  { word: "Aspirations", meaning: "উচ্চাকাঙ্ক্ষা", sentence: "Her aspirations keep her moving.", translation: "তার উচ্চাকাঙ্ক্ষা তাকে এগিয়ে নিয়ে যায়।" },
  { word: "Eloquence", meaning: "বাকপটুতা", sentence: "His eloquence impressed everyone.", translation: "তার বাগ্মীতা সবাইকে মুগ্ধ করেছে।" },
  { word: "Integrity", meaning: "সততা", sentence: "Always maintain your integrity.", translation: "সর্বদা নিজের সততা বজায় রাখুন।" },
  { word: "Optimistic", meaning: "আশাবাদী", sentence: "Be optimistic about future.", translation: "ভবিষ্যৎ নিয়ে আশাবাদী হন।" },
  { word: "Perseverance", meaning: "একনিষ্ঠতা", sentence: "Perseverance brings success.", translation: "একনিষ্ঠতা সাফল্য আনে।" }
];

// প্রতিদিন ৫টি করে নতুন ভোকাবুলারি লোড করার ফাংশন
function loadDailyVocab() {
  const container = document.getElementById('vocab-list');
  if(!container) return;
  container.innerHTML = '';

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const dailyCount = 5; // প্রতিদিন ৫টি শব্দ
  const startIndex = (dayOfYear * dailyCount) % 365Vocabularies.length;

  for (let i = 0; i < dailyCount; i++) {
    const v = 365Vocabularies[(startIndex + i) % 365Vocabularies.length];
    container.innerHTML += `
      <div class="vocab-card">
        <h3 style="color: #e67e22;">${i + 1}. ${v.word}</h3>
        <p><b>অর্থ:</b> ${v.meaning}</p>
        <p><b>উদাহরণ:</b> ${v.sentence}</p>
        <p><b>অনুবাদ:</b> ${v.translation}</p>
      </div>
    `;
  }
}
loadDailyVocab();

// ৫. ফ্রি API দিয়ে গ্রামার ও ভুল বাক্য সংশোধন ফাংশন (LanguageTool API)
async function checkGrammar() {
  const text = document.getElementById('user-sentence').value.trim();
  const resultDiv = document.getElementById('grammar-result');
  const checkBtn = document.getElementById('check-btn');

  if (!text) {
    alert("অনুগ্রহ করে একটি বাক্য লিখুন!");
    return;
  }

  checkBtn.innerText = "যাচাই করা হচ্ছে...";
  checkBtn.disabled = true;

  try {
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'text': text,
        'language': 'en-US'
      })
    });

    const data = await response.json();
    resultDiv.classList.remove('hidden');

    if (data.matches.length === 0) {
      resultDiv.innerHTML = `<div style="color: #27ae60; font-weight: bold;">🎉 চমৎকার! আপনার বাক্যটিতে কোনো গ্রামার বা বানানের ভুল নেই।</div>`;
    } else {
      let html = `<h4 style="color: #e74c3c; margin-bottom: 8px;">⚠️ বাক্যে কিছু ভুল পাওয়া গেছে:</h4><ul>`;
      
      data.matches.forEach(match => {
        const replacements = match.replacements.map(r => `<b>${r.value}</b>`).slice(0, 3).join(" অথবা ");
        html += `<li style="margin-bottom: 6px;">
          <b>সমস্যা:</b> ${match.message}<br>
          <b>সঠিক রূপ হতে পারে:</b> ${replacements ? replacements : 'বানান টি চেক করুন'}
        </li>`;
      });
      
      html += `</ul>`;
      resultDiv.innerHTML = html;
    }
  } catch (error) {
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `<p style="color: red;">দুঃখিত, ইন্টারনেট বা সার্ভারে সমস্যা হচ্ছে। আবার চেষ্টা করুন।</p>`;
  }

  checkBtn.innerText = "Check Sentence (ভুল যাচাই করুন)";
  checkBtn.disabled = false;
    }
  
