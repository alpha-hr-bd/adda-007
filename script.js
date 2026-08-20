// ==========================================
// ADDA 007 — FIREBASE LIVE CHAT
// ==========================================

// Firebase App
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


// Firebase Realtime Database
import {
    getDatabase,
    ref,
    push,
    onChildAdded
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyA-6kplwDGeSPOutALTFEegnRGB3rl-WcE",

    authDomain: "adda-007.firebaseapp.com",

    databaseURL:
        "https://adda-007-default-rtdb.firebaseio.com",

    projectId: "adda-007",

    storageBucket:
        "adda-007.firebasestorage.app",

    messagingSenderId: "258004128866",

    appId:
        "1:258004128866:web:a1a53d98e81b958c40ed3b",

    measurementId: "G-DYPWLY5NS0"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// Connect Realtime Database

const database = getDatabase(app);


// ADDA 007 messages database

const messagesRef =
    ref(database, "adda007Messages");


// ==========================================
// HTML ELEMENTS
// ==========================================

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


// ==========================================
// USERNAME
// ==========================================

let username =
    localStorage.getItem("adda007Username");


// যদি আগে নাম দেওয়া থাকে

if (username) {

    startChat();

}


// ==========================================
// JOIN ADDA 007
// ==========================================

joinBtn.addEventListener("click", () => {

    const name =
        usernameInput.value.trim();


    if (!name) {

        alert("আগে তোমার নাম লিখো 😤");

        return;

    }


    username = name;


    localStorage.setItem(
        "adda007Username",
        username
    );


    startChat();

});


// Enter দিয়ে Join

usernameInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            joinBtn.click();

        }

    }
);


// ==========================================
// START CHAT
// ==========================================

function startChat() {

    loginScreen.style.display = "none";

    chatApp.style.display = "flex";

    messageInput.focus();

}


// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) return;


    const messageData = {

        username: username,

        text: text,

        time: new Date().toLocaleTimeString(
            "en-BD",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ),

        timestamp: Date.now()

    };


    // Firebase database-এ message পাঠানো

    push(
        messagesRef,
        messageData
    )
    .then(() => {

        console.log("Message sent!");

    })
    .catch((error) => {

        console.error(
            "Message send error:",
            error
        );

        alert(
            "Message পাঠানো যাচ্ছে না! Firebase Database Rules check করো."
        );

    });


    messageInput.value = "";

}


// Send button

sendBtn.addEventListener(
    "click",
    sendMessage
);


// Enter দিয়ে message send

messageInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ==========================================
// RECEIVE LIVE MESSAGES
// ==========================================

onChildAdded(
    messagesRef,
    (snapshot) => {

        const data =
            snapshot.val();


        // Welcome message remove

        const welcome =
            document.querySelector(
                ".welcome-message"
            );


        if (welcome) {

            welcome.remove();

        }


        // Message container

        const messageDiv =
            document.createElement("div");


        // নিজের message

        if (
            data.username === username
        ) {

            messageDiv.classList.add(
                "message",
                "me"
            );

        }

        // অন্যের message

        else {

            messageDiv.classList.add(
                "message",
                "other"
            );

        }


        // Username

        const nameDiv =
            document.createElement("div");

        nameDiv.className =
            "message-name";

        nameDiv.textContent =
            data.username;


        // Message

        const textDiv =
            document.createElement("div");

        textDiv.className =
            "message-text";

        textDiv.textContent =
            data.text;


        // Time

        const timeDiv =
            document.createElement("div");

        timeDiv.className =
            "message-time";

        timeDiv.textContent =
            data.time;


        // Add everything

        messageDiv.appendChild(
            nameDiv
        );

        messageDiv.appendChild(
            textDiv
        );

        messageDiv.appendChild(
            timeDiv
        );


        messages.appendChild(
            messageDiv
        );


        // নিচে scroll

        messages.scrollTop =
            messages.scrollHeight;

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "adda007Username"
        );


        username = null;


        chatApp.style.display =
            "none";


        loginScreen.style.display =
            "flex";


        usernameInput.value = "";

    }
);
