// ============================================
// GLOBALASSIST CHATBOT
// ============================================

const chatWindow = document.getElementById("chatWindow");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const typing = document.getElementById("typing");


// ============================================
// OPEN CHAT
// ============================================

function openChat() {
  chatWindow.classList.add("active");

  setTimeout(() => {
    chatInput.focus();
  }, 200);
}


// ============================================
// CLOSE CHAT
// ============================================

function closeChat() {
  chatWindow.classList.remove("active");
}


// ============================================
// MINIMIZE CHAT
// ============================================

function minimizeChat() {
  chatWindow.classList.remove("active");
}


// ============================================
// SEND MESSAGE
// ============================================

function sendMessage() {

  const message = chatInput.value.trim();

  if (message === "") {
    return;
  }

  // Show user message
  addMessage(message, "user");

  // Clear input
  chatInput.value = "";

  // Show typing animation
  showTyping();

  // Generate bot reply
  setTimeout(() => {

    hideTyping();

    const reply = getBotReply(message);

    addMessage(reply, "bot");

  }, 900);
}


// ============================================
// ENTER KEY
// ============================================

chatInput.addEventListener("keydown", function(event) {

  if (event.key === "Enter") {

    event.preventDefault();

    sendMessage();

  }

});


// ============================================
// ADD MESSAGE
// ============================================

function addMessage(message, sender) {

  const messageWrapper = document.createElement("div");

  messageWrapper.className =
    sender === "user"
      ? "message user-message"
      : "message bot-message";


  const avatar = document.createElement("div");

  avatar.className = "message-avatar";

  avatar.textContent =
    sender === "user"
      ? "You"
      : "G";


  const content = document.createElement("div");

  content.className = "message-content";


  const bubble = document.createElement("div");

  bubble.className = "message-bubble";

  // Allow line breaks
  bubble.innerHTML = message.replace(/\n/g, "<br>");


  const time = document.createElement("small");

  time.textContent = getCurrentTime();


  content.appendChild(bubble);
  content.appendChild(time);


  if (sender === "bot") {

    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(content);

  } else {

    messageWrapper.appendChild(content);
    messageWrapper.appendChild(avatar);

  }


  chatBody.appendChild(messageWrapper);

  scrollChatToBottom();
}


// ============================================
// BOT REPLY SYSTEM
// ============================================

function getBotReply(message) {

  const text = message.toLowerCase();


  // Greeting
  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {

    return `
      👋 Hello! Welcome to GlobalAssist.
      <br><br>
      I'm here to help you with our communication
      and customer-support solutions.
    `;
  }


  // Services
  if (
    text.includes("service") ||
    text.includes("what do you provide") ||
    text.includes("what do you offer")
  ) {

    return `
      We provide several business communication solutions:
      <br><br>
      • AI Chatbot<br>
      • WhatsApp Business<br>
      • Google RCS<br>
      • Customer Support<br>
      • Communication Automation
      <br><br>
      Which service would you like to know about?
    `;
  }


  // WhatsApp
  if (
    text.includes("whatsapp")
  ) {

    return `
      📱 <strong>WhatsApp Business</strong>
      <br><br>
      Businesses can use WhatsApp to communicate
      with customers, send updates and provide support.
      <br><br>
      Our platform is designed to bring this communication
      into a centralized business workflow.
    `;
  }


  // RCS
  if (
    text.includes("rcs") ||
    text.includes("google")
  ) {

    return `
      🔵 <strong>Google RCS Business Messaging</strong>
      <br><br>
      RCS allows businesses to create richer messaging
      experiences with features such as branded messages,
      buttons and interactive communication.
    `;
  }


  // AI Chatbot
  if (
    text.includes("chatbot") ||
    text.includes("ai")
  ) {

    return `
      🤖 <strong>AI Chatbot</strong>
      <br><br>
      Our chatbot can answer common customer questions,
      provide information and help route customers
      to the right support channel.
      <br><br>
      It can also be connected to a backend system
      for more advanced automation.
    `;
  }


  // Automation
  if (
    text.includes("automation") ||
    text.includes("automate")
  ) {

    return `
      ⚡ <strong>Business Automation</strong>
      <br><br>
      Automation can reduce repetitive communication
      tasks and help businesses respond to customers
      more efficiently.
    `;
  }


  // Pricing
  if (
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost")
  ) {

    return `
      💰 Pricing depends on the communication services,
      message volume and integrations required.
      <br><br>
      For an exact quotation, you can contact our team.
    `;
  }


  // Contact
  if (
    text.includes("contact") ||
    text.includes("team") ||
    text.includes("support")
  ) {

    return `
      👨‍💼 <strong>Contact Team</strong>
      <br><br>
      Please share your name and requirement.
      Our team can then review your request
      and help you with the next steps.
    `;
  }


  // Thanks
  if (
    text.includes("thank") ||
    text.includes("thanks")
  ) {

    return `
      You're welcome! 😊
      <br><br>
      If you need anything else, just send me a message.
    `;
  }


  // Bye
  if (
    text.includes("bye") ||
    text.includes("goodbye")
  ) {

    return `
      👋 Goodbye!
      <br><br>
      Thanks for visiting GlobalAssist.
    `;
  }


  // Default
  return `
    Thanks for your message! 😊
    <br><br>
    I can help you with:
    <br>
    • AI Chatbot<br>
    • WhatsApp Business<br>
    • Google RCS<br>
    • Automation<br>
    • Customer Support
    <br><br>
    Try asking me about any of these.
  `;
}


// ============================================
// QUICK MESSAGE
// ============================================

function quickMessage(message) {

  openChat();

  chatInput.value = message;

  sendMessage();
}


// ============================================
// EMOJI
// ============================================

function addEmoji() {

  chatInput.value += " 😊";

  chatInput.focus();
}


// ============================================
// TYPING ANIMATION
// ============================================

function showTyping() {

  typing.classList.add("active");

  scrollChatToBottom();
}


function hideTyping() {

  typing.classList.remove("active");
}


// ============================================
// SCROLL CHAT
// ============================================

function scrollChatToBottom() {

  setTimeout(() => {

    chatBody.scrollTop =
      chatBody.scrollHeight;

  }, 50);
}


// ============================================
// CURRENT TIME
// ============================================

function getCurrentTime() {

  const now = new Date();

  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}