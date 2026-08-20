// ======================================================
// ADDA 007 - REAL TIME LIVE CHAT
// Firebase Realtime Database
// ======================================================


// ======================================================
// FIREBASE IMPORT
// ======================================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onChildAdded
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyA-6kplwDGeSPOutALTFEegnRGB3rl-WcE",

    authDomain:
        "adda-007.firebaseapp.com",

    databaseURL:
        "https://adda-007-default-rtdb.firebaseio.com",

    projectId:
        "adda-007",

    storageBucket:
        "adda-007.firebasestorage.app",

    messagingSenderId:
        "258004128866",

    appId:
        "1:258004128866:web:a1a53d98e81b958c40ed3b",

    measurementId:
        "G-DYPWLY5NS0"
};


// ======================================================
// START FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ======================================================
// DATABASE LOCATION
// ======================================================

const messagesRef =
    ref(database, "adda007Messages");


// ======================================================
// GET HTML ELEMENTS
// ======================================================

const loginScreen =
    document.getElementById("loginScreen");

const chatApp =
    document.getElementById("chatApp");

const usernameInput =
    document.getElementById("usernameInput");

const joinBtn =
    document.getElementById("joinBtn");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const messages =
    document.getElementById("messages");

const logoutBtn =
    document.getElementById("logoutBtn");


// ======================================================
// USER DATA
// ======================================================

let username =
    localStorage.getItem("adda007Username");


// ======================================================
// PAGE START
// ======================================================

if (username) {

    showChat();

}


// ======================================================
// JOIN BUTTON
// ======================================================

joinBtn.addEventListener("click", joinChat);


// ======================================================
// ENTER TO JOIN
// ======================================================

usernameInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            joinChat();

        }

    }
);


// ======================================================
// JOIN FUNCTION
// ======================================================

function joinChat() {

    const name =
        usernameInput.value.trim();


    // Empty name

    if (!name) {

        alert("তোমার নাম লিখো 😤");

        usernameInput.focus();

        return;

    }


    // Name too short

    if (name.length < 2) {

        alert("কমপক্ষে ২ অক্ষরের নাম দাও!");

        usernameInput.focus();

        return;

    }


    // Save username

    username = name;


    localStorage.setItem(
        "adda007Username",
        username
    );


    // Open chat

    showChat();

}


// ======================================================
// SHOW CHAT
// ======================================================

function showChat() {

    loginScreen.style.display = "none";

    chatApp.style.display = "flex";

    setTimeout(function() {

        messageInput.focus();

    }, 100);

}


// ======================================================
// SEND BUTTON
// ======================================================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ======================================================
// ENTER TO SEND
// ======================================================

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ======================================================
// SEND MESSAGE
// ======================================================

function sendMessage() {

    const text =
        messageInput.value.trim();


    // Empty message

    if (!text) {

        return;

    }


    // Username check

    if (!username) {

        alert("আগে ADDA-তে Join করো!");

        return;

    }


    // Message object

    const messageData = {

        username: username,

        text: text,

        timestamp: Date.now(),

        time: new Date().toLocaleTimeString(
            "en-BD",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )

    };


    // Disable temporarily

    sendBtn.disabled = true;


    // Firebase push

    push(
        messagesRef,
        messageData
    )
    .then(function() {

        console.log(
            "ADDA 007: Message sent successfully"
        );

        messageInput.value = "";

        messageInput.focus();

    })
    .catch(function(error) {

        console.error(
            "Firebase error:",
            error
        );


        alert(
            "Message পাঠানো যায়নি!\n\n" +
            "Firebase Database Rules check করো."
        );

    })
    .finally(function() {

        sendBtn.disabled = false;

    });

}


// ======================================================
// RECEIVE REAL-TIME MESSAGES
// ======================================================

onChildAdded(
    messagesRef,
    function(snapshot) {

        const data =
            snapshot.val();


        // Invalid data protection

        if (!data) {

            return;

        }


        // Remove welcome message

        const welcome =
            document.querySelector(
                ".welcome-message"
            );


        if (welcome) {

            welcome.remove();

        }


        // Create message container

        const messageElement =
            document.createElement("div");


        // Own / Other message

        if (
            data.username === username
        ) {

            messageElement.className =
                "message me";

        } else {

            messageElement.className =
                "message other";

        }


        // ==================================================
        // USERNAME
        // ==================================================

        const nameElement =
            document.createElement("div");

        nameElement.className =
            "message-name";

        nameElement.textContent =
            data.username || "Unknown";


        // ==================================================
        // MESSAGE TEXT
        // ==================================================

        const textElement =
            document.createElement("div");

        textElement.className =
            "message-text";

        textElement.textContent =
            data.text || "";


        // ==================================================
        // TIME
        // ==================================================

        const timeElement =
            document.createElement("div");

        timeElement.className =
            "message-time";

        timeElement.textContent =
            data.time || "";


        // ==================================================
        // ADD TO MESSAGE
        // ==================================================

        messageElement.appendChild(
            nameElement
        );

        messageElement.appendChild(
            textElement
        );

        messageElement.appendChild(
            timeElement
        );


        // Add to screen

        messages.appendChild(
            messageElement
        );


        // Scroll to bottom

        messages.scrollTop =
            messages.scrollHeight;

    },

    function(error) {

        console.error(
            "Firebase read error:",
            error
        );

    }
);


// ======================================================
// LOGOUT
// ======================================================

logoutBtn.addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "adda007Username"
        );


        username = null;


        // Hide chat

        chatApp.style.display =
            "none";


        // Show login

        loginScreen.style.display =
            "flex";


        // Clear input

        usernameInput.value = "";

        messageInput.value = "";


        usernameInput.focus();

    }
);


// ======================================================
// FIREBASE CONNECTION TEST
// ======================================================

console.log(
    "🔥 ADDA 007 Firebase initialized successfully!"
);

console.log(
    "📡 Database:",
    "adda007Messages"
);
