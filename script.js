/* =========================================
   1. GEMINI API CONFIGURATION
========================================= */
const GEMINI_API_KEY = "AQ.Ab8RN6JSXiEHgXBDyIgY8J6z_WzThMb9yLKCd6TmHdmWOF66bw";

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();

  if (!response.ok || !data.candidates || !data.candidates[0]) {
    throw new Error(data.error?.message || "Gemini API-তে সংযোগ করা যাচ্ছে না। API Key ঠিক আছে কিনা চেক করুন।");
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
   3. AUTOMATIC VOCABULARY GENERATOR
========================================= */
async function generateVocabulary() {
  const btn = document.getElementById("getVocabBtn");
  const list = document.getElementById("vocabularyList");

  btn.disabled = true;
  btn.textContent = "Creating 10 new words...";
  list.innerHTML = `<div class="result">Generating 10 useful English vocabulary words for you... Please wait.</div>`;

  try {
    const prompt = `Provide 10 useful daily-life English vocabulary words for an English learner.
Format the output as clear Markdown text. For each word include:
1. Word (with pronunciation hint)
2. Simple English Meaning
3. Bengali Meaning (বাংলা অর্থ)
4. Example Sentence`;

    const result = await callGemini(prompt);
    list.innerHTML = `<div class="card">${formatText(result)}</div>`;

  } catch (error) {
    list.innerHTML = `<div class="result" style="color:red;">Error: ${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate 10 New Words";
  }
}

/* =========================================
   4. SENTENCE CHECKER
========================================= */
async function checkSentence() {
  const input = document.getElementById("sentenceInput");
  const btn = document.getElementById("checkSentenceBtn");
  const resultDiv = document.getElementById("sentenceResult");

  const sentence = input.value.trim();
  if (!sentence) {
    alert("Please write a sentence first.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Checking...";
  resultDiv.innerHTML = `<div class="result">Checking your sentence...</div>`;

  try {
    const prompt = `Act as an English Teacher. Review this sentence written by a student: "${sentence}".
Explain:
1. Is it grammatically correct?
2. Better or natural way to say it (if any).
3. Short Bengali explanation.`;

    const response = await callGemini(prompt);
    resultDiv.innerHTML = `<div class="card">${formatText(response)}</div>`;

  } catch (error) {
    resultDiv.innerHTML = `<div class="result" style="color:red;">Error: ${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Check My Sentence";
  }
}

/* =========================================
   5. AI COACH CHAT
========================================= */
async function sendChat() {
  const input = document.getElementById("chatInput");
  const btn = document.getElementById("sendChatBtn");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div class="user-message"><b>You:</b> ${escapeHTML(message)}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  btn.disabled = true;
  btn.textContent = "Thinking...";

  try {
    const prompt = `You are an encouraging English learning AI Coach named 'Ronjita English Coach'. Reply naturally and concisely to the student's message: "${message}"`;
    const response = await callGemini(prompt);

    chatBox.innerHTML += `<div class="ai-message"><b>Coach:</b> ${formatText(response)}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    chatBox.innerHTML += `<div class="ai-message" style="color:red;">Sorry, error occurred: ${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Send";
  }
}

/* =========================================
   6. WEEKLY EXAM GENERATOR
========================================= */
async function generateExam() {
  const btn = document.getElementById("startExamBtn");
  const area = document.getElementById("examArea");

  btn.disabled = true;
  btn.textContent = "Creating exam...";
  area.innerHTML = `<div class="result">Generating a quick 3-question English test...</div>`;

  try {
    const prompt = `Create a short 3-question English quiz (Fill in the blanks or Sentence Correction) with answers at the bottom. Format neatly in simple English with Bengali translations for questions.`;
    const response = await callGemini(prompt);

    area.innerHTML = `<div class="card">${formatText(response)}</div>`;

  } catch (error) {
    area.innerHTML = `<div class="result" style="color:red;">Error: ${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Generate Weekly Exam";
  }
}

/* =========================================
   7. HELPER FUNCTIONS
========================================= */
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function formatText(text) {
  return escapeHTML(text)
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
       }
       
