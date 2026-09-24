const speakBtn =
  document.getElementById("speakBtn");

const sendBtn =
  document.getElementById("sendBtn");

const userText =
  document.getElementById("userText");

const status =
  document.getElementById("status");

const aiReply =
  document.getElementById("aiReply");

const correction =
  document.getElementById("correction");

const question =
  document.getElementById("question");

const conversationCount =
  document.getElementById("conversationCount");

const correctionCount =
  document.getElementById("correctionCount");


// ==========================================
// CLOUDFLARE WORKER URL
// ==========================================

const AI_API_URL =
  "https://still-scene-e8cf.mstronjitaakter.workers.dev";


let conversations = 0;
let corrections = 0;


// ==========================================
// SPEECH RECOGNITION
// ==========================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {

  recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.interimResults = false;

  recognition.continuous = false;


  recognition.onstart = function () {

    status.innerText =
      "🎤 Listening... Speak now.";

  };


  recognition.onresult =
    function (event) {

      const text =
        event.results[0][0].transcript;

      userText.value = text;

      status.innerText =
        "✅ I heard you!";

    };


  recognition.onerror =
    function (event) {

      status.innerText =
        "❌ Microphone error: " +
        event.error;

    };


  recognition.onend =
    function () {

      console.log(
        "Speech recognition ended"
      );

    };

}

else {

  speakBtn.disabled = true;

  status.innerText =
    "Speech recognition is not supported.";

}


// ==========================================
// START SPEAKING
// ==========================================

speakBtn.onclick = function () {

  if (!recognition) {

    return;

  }

  try {

    recognition.start();

  }

  catch (error) {

    console.log(error);

  }

};


// ==========================================
// SEND TO AI
// ==========================================

sendBtn.onclick =
  async function () {

    const text =
      userText.value.trim();


    if (!text) {

      alert(
        "Please speak or type something first."
      );

      return;

    }


    status.innerText =
      "🤖 AI is thinking...";


    try {

      const prompt = `
You are Ronjita's English learning AI coach.

The student said:
"${text}"

Reply ONLY as valid JSON in exactly this format:

{
  "reply": "A natural English response to the student.",
  "correction": "If there is a grammar mistake, explain the correction briefly. If there is no mistake, say the sentence is correct.",
  "question": "Ask one simple follow-up question in English."
}

Do not use Markdown.
Do not put the JSON inside code fences.
`;


      const response =
        await fetch(
          AI_API_URL,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({

                action: "generate",

                message: prompt

              })

            }

          );


      const data =
        await response.json();


      if (!response.ok ||
          !data.success) {

        throw new Error(
          data.error ||
          "AI request failed."
        );

      }


      // ==================================
      // READ GEMINI RESPONSE
      // ==================================

      let aiData;


      try {

        aiData =
          JSON.parse(data.text);

      }

      catch {

        // Try removing accidental code fences

        const cleaned =
          data.text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        aiData =
          JSON.parse(cleaned);

      }


      // ==================================
      // SHOW RESULTS
      // ==================================

      aiReply.innerText =
        aiData.reply ||
        "No reply received.";


      correction.innerText =
        aiData.correction ||
        "No correction available.";


      question.innerText =
        aiData.question ||
        "Can you tell me more?";


      conversations++;

      conversationCount.innerText =
        conversations;


      if (
        aiData.correction &&
        !aiData.correction
          .toLowerCase()
          .includes("correct")
      ) {

        corrections++;

        correctionCount.innerText =
          corrections;

      }


      status.innerText =
        "✅ AI replied!";


      // ==================================
      // AI VOICE
      // ==================================

      speakText(
        aiData.reply
      );


    }

    catch (error) {

      console.error(error);

      status.innerText =
        "❌ AI connection failed.";

      aiReply.innerText =
        "Sorry, I couldn't connect to the AI.";

      correction.innerText =
        "";

      question.innerText =
        "";

    }

  };


// ==========================================
// AI VOICE
// ==========================================

function speakText(text) {

  if (
    !("speechSynthesis" in window)
  ) {

    return;

  }


  const speech =
    new SpeechSynthesisUtterance(
      text
    );


  speech.lang =
    "en-US";

  speech.rate =
    0.9;

  speech.pitch =
    1;


  window.speechSynthesis.speak(
    speech
  );

}
