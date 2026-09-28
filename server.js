// ============================================
// GLOBALASSIST BACKEND SERVER
// ============================================

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 3000;


// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());

app.use(express.static(
  path.join(__dirname, "public")
));


// ============================================
// DATA FOLDER
// ============================================

const dataFolder = path.join(
  __dirname,
  "data"
);

const databaseFile = path.join(
  dataFolder,
  "database.json"
);


// Create data folder if it doesn't exist

if (!fs.existsSync(dataFolder)) {

  fs.mkdirSync(
    dataFolder,
    { recursive: true }
  );

}


// Create database file if it doesn't exist

if (!fs.existsSync(databaseFile)) {

  const initialDatabase = {

    customers: [],

    conversations: [],

    messages: []

  };

  fs.writeFileSync(
    databaseFile,
    JSON.stringify(
      initialDatabase,
      null,
      2
    )
  );

}


// ============================================
// DATABASE FUNCTIONS
// ============================================

function readDatabase() {

  try {

    const data =
      fs.readFileSync(
        databaseFile,
        "utf8"
      );

    return JSON.parse(data);

  } catch (error) {

    console.log(
      "Database read error:",
      error
    );

    return {
      customers: [],
      conversations: [],
      messages: []
    };

  }

}


function saveDatabase(database) {

  fs.writeFileSync(
    databaseFile,
    JSON.stringify(
      database,
      null,
      2
    )
  );

}


// ============================================
// CREATE ID
// ============================================

function createId(prefix) {

  return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );

}


// ============================================
// LOCAL CHATBOT
// ============================================

function getBotReply(message) {

  const text =
    message.toLowerCase();


  // Greeting

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {

    return `
Hello! 👋

Welcome to GlobalAssist.

How can I help you today?

You can ask me about:
• AI Chatbot
• WhatsApp Business
• Google RCS
• Automation
• Customer Support
`;

  }


  // Services

  if (
    text.includes("service") ||
    text.includes("services")
  ) {

    return `
GlobalAssist provides business communication solutions including:

• AI Chatbot
• WhatsApp Business
• Google RCS Business Messaging
• Customer Support
• Communication Automation

Which service would you like to know more about?
`;

  }


  // WhatsApp

  if (
    text.includes("whatsapp")
  ) {

    return `
WhatsApp Business helps businesses communicate with customers through WhatsApp.

It can be used for:

• Customer support
• Business notifications
• Customer communication
• Automated conversations

For a real WhatsApp Business integration, approved business credentials and a supported provider/API are required.
`;

  }


  // RCS

  if (
    text.includes("rcs") ||
    text.includes("google rcs")
  ) {

    return `
Google RCS Business Messaging enables richer business conversations.

It can support features such as:

• Rich messages
• Buttons
• Branded communication
• Interactive customer experiences

A real RCS integration requires an approved RCS/business messaging setup.
`;

  }


  // Chatbot

  if (
    text.includes("chatbot") ||
    text.includes("ai")
  ) {

    return `
Our AI chatbot can help businesses:

• Answer customer questions
• Provide information
• Automate common conversations
• Route customers to support
• Collect customer requirements

The current demo uses a local response system.
`;

  }


  // Automation

  if (
    text.includes("automation") ||
    text.includes("automate")
  ) {

    return `
Business automation can help reduce repetitive communication work.

For example:

Customer message
        ↓
Chatbot
        ↓
Automatic response
        ↓
Human support when required
`;

  }


  // Pricing

  if (
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost")
  ) {

    return `
Pricing depends on the services, integrations and message volume required.

For an exact quotation, please contact the business team.
`;

  }


  // Contact

  if (
    text.includes("contact") ||
    text.includes("team")
  ) {

    return `
Sure! 👨‍💼

Please provide:

1. Your name
2. Your email
3. Your business requirement

The team can then review your request.
`;

  }


  // Thanks

  if (
    text.includes("thank") ||
    text.includes("thanks")
  ) {

    return `
You're welcome! 😊

Feel free to ask me anything about GlobalAssist.
`;

  }


  // Default

  return `
Thanks for your message! 😊

I can help you with:

• AI Chatbot
• WhatsApp Business
• Google RCS
• Automation
• Customer Support

Try asking me about one of these services.
`;

}


// ============================================
// CHAT API
// ============================================

app.post(
  "/api/chat",
  (req, res) => {

    try {

      const {
        customerName,
        customerEmail,
        message,
        conversationId
      } = req.body;


      if (!message) {

        return res.status(400).json({

          success: false,

          error: "Message is required."

        });

      }


      const database =
        readDatabase();


      // ----------------------------------------
      // FIND OR CREATE CUSTOMER
      // ----------------------------------------

      let customer =
        database.customers.find(
          c =>
            customerEmail &&
            c.email === customerEmail
        );


      if (!customer) {

        customer = {

          id: createId("customer"),

          name:
            customerName ||
            "Website Visitor",

          email:
            customerEmail ||
            "",

          createdAt:
            new Date().toISOString()

        };


        database.customers.push(
          customer
        );

      }


      // ----------------------------------------
      // FIND OR CREATE CONVERSATION
      // ----------------------------------------

      let conversation =
        database.conversations.find(
          c =>
            c.id === conversationId
        );


      if (!conversation) {

        conversation = {

          id:
            createId("conversation"),

          customerId:
            customer.id,

          status:
            "open",

          createdAt:
            new Date().toISOString(),

          updatedAt:
            new Date().toISOString()

        };


        database.conversations.push(
          conversation
        );

      }


      // ----------------------------------------
      // CUSTOMER MESSAGE
      // ----------------------------------------

      const userMessage = {

        id:
          createId("message"),

        conversationId:
          conversation.id,

        sender:
          "customer",

        message:
          message,

        createdAt:
          new Date().toISOString()

      };


      database.messages.push(
        userMessage
      );


      // ----------------------------------------
      // BOT RESPONSE
      // ----------------------------------------

      const reply =
        getBotReply(message);


      const botMessage = {

        id:
          createId("message"),

        conversationId:
          conversation.id,

        sender:
          "bot",

        message:
          reply,

        createdAt:
          new Date().toISOString()

      };


      database.messages.push(
        botMessage
      );


      // Update conversation

      conversation.updatedAt =
        new Date().toISOString();


      saveDatabase(
        database
      );


      // ----------------------------------------
      // RESPONSE
      // ----------------------------------------

      res.json({

        success: true,

        conversationId:
          conversation.id,

        reply:
          reply

      });

    } catch (error) {

      console.error(
        "Chat API error:",
        error
      );

      res.status(500).json({

        success: false,

        error:
          "Something went wrong."

      });

    }

  }
);


// ============================================
// HEALTH CHECK
// ============================================

app.get(
  "/api/health",
  (req, res) => {

    res.json({

      success: true,

      message:
        "GlobalAssist server is running.",

      time:
        new Date().toISOString()

    });

  }
);


// ============================================
// START SERVER
// ============================================

app.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "================================"
    );

    console.log(
      "  GlobalAssist Server Started"
    );

    console.log(
      "  http://localhost:" + PORT
    );

    console.log(
      "================================"
    );

    console.log("");

  }
);