// js/script.js

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("message");
const chatHistory = document.getElementById("chat-history");
const responseElement = document.getElementById("response");

// Load chat history from localStorage on page load
loadChatHistory();

messageForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const userMessage = messageInput.value;

  // Display user message in chat history
  appendMessage("User", userMessage);

  // Process the message and get the bot reply
  sendMessage(); // Call the sendMessage function without passing userMessage as a parameter

  // Clear the input field
  messageInput.value = "";
});

function clearChatHistory() {
  chatHistory.innerHTML = "";
  localStorage.removeItem("chatHistory");
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('p');

        if (sender === 'User') {
            messageElement.className = 'user-message';
        } else if (sender === 'Bot') {
            messageElement.className = 'bot-message';
        }
        else if (sender === "Err"){
            sender = 'Error Bot';
            messageElement.className = 'err-message';
        }

        messageElement.innerHTML = `<strong>${sender} : </strong> ${message}`;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        // const isUserAtBottom = chatHistory.scrollHeight - chatHistory.scrollTop <= chatHistory.clientHeight + 1;
        // console.log(isUserAtBottom);
        // // Scroll to the last message only if the user is at the bottom or if overflow-y is hidden
        // if (!(isUserAtBottom || chatHistory.style.overflowY === 'hidden')) {
        //     chatHistory.scrollTop = chatHistory.scrollHeight;
        // }
}

function saveChatHistory() {
  // Save chat history to localStorage
  localStorage.setItem("chatHistory", chatHistory.innerHTML);
}

function loadChatHistory() {
  // Load chat history from localStorage
  const storedHistory = localStorage.getItem("chatHistory");
  if (storedHistory) {
    chatHistory.innerHTML = storedHistory;
  }
}

function getUserMessage() {
  return messageInput.value;
}

// Define the sendMessage function
function sendMessage() {
  const message = getUserMessage();
  fetch("/get_reply/", {
    // Adjust the URL to match your backend endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display bot reply in chat history
      appendMessage("Bot", data.reply);

      // Save the updated chat history to localStorage
      saveChatHistory();
    })
    .catch((error) => {
        console.log(error);
        appendMessage("Err", "Error!! Maybe You didnt put a ASCII letter.");
    });
}

function getCSRFToken() {
  // Retrieve CSRF token from the cookie
  const csrfCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrftoken="));
  return csrfCookie ? csrfCookie.split("=")[1] : "";
}
