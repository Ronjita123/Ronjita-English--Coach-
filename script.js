const startButton = document.getElementById("startButton");
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chat = document.getElementById("chat");

startButton.addEventListener("click", function () {
  alert("Great! Let's start practicing English. 🎤");
});

sendButton.addEventListener("click", function () {
  const message = messageInput.value.trim();

  if (message === "") {
    return;
  }

  const userMessage = document.createElement("p");
  userMessage.textContent = "You: " + message;
  chat.appendChild(userMessage);

  const aiMessage = document.createElement("p");
  aiMessage.textContent =
    "AI Coach: Good job! Let's continue practicing. 😊";
  aiMessage.className = "ai-message";

  chat.appendChild(aiMessage);

  messageInput.value = "";
});
