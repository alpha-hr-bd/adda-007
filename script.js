// ======================================================
// ADDA 007
// WhatsApp-inspired Firebase Real-Time Chat
// ======================================================


// ======================================================
// FIREBASE IMPORTS
// ======================================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    query,
    limitToLast,
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
// FIREBASE INITIALIZE
// ======================================================

const app =
    initializeApp(firebaseConfig);

const database =
    getDatabase(app);


// ======================================================
// DATABASE
// ======================================================

const messagesRef =
    ref(
        database,
        "adda007Messages"
    );


// Only load latest 50 messages.
// This keeps the chat faster.

const latestMessagesQuery =
    query(
        messagesRef,
        limitToLast(50)
    );


// ======================================================
// ELEMENTS
// ======================================================

const loginScreen =
    document.getElementById(
        "loginScreen"
    );

const chatApp =
    document.getElementById(
        "chatApp"
    );

const usernameInput =
    document.getElementById(
        "usernameInput"
    );

const joinBtn =
    document.getElementById(
        "joinBtn"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const sendBtn =
    document.getElementById(
        "sendBtn"
    );

const messages =
    document.getElementById(
        "messages"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const searchBox =
    document.getElementById(
        "searchBox"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const emojiBtn =
    document.getElementById(
        "emojiBtn"
    );

const emojiPanel =
    document.getElementById(
        "emojiPanel"
    );


// ======================================================
// USERNAME
// ======================================================

let username =
    localStorage.getItem(
        "adda007Username"
    );


// ======================================================
// LOGIN
// ======================================================

if (username) {

    openChat();

}


// Join

joinBtn.addEventListener(
    "click",
    joinChat
);


// Enter

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
// JOIN CHAT
// ======================================================

function joinChat() {

    const name =
        usernameInput.value.trim();


    if (!name) {

        alert(
            "Enter your name first."
        );

        return;

    }


    if (name.length < 2) {

        alert(
            "Name must be at least 2 characters."
        );

        return;

    }


    username =
        name.substring(0, 20);


    localStorage.setItem(
        "adda007Username",
        username
    );


    openChat();

}


// ======================================================
// OPEN CHAT
// ======================================================

function openChat() {

    loginScreen.style.display =
        "none";

    chatApp.style.display =
        "flex";

    setTimeout(
        function() {

            messageInput.focus();

        },
        100
    );

}


// ======================================================
// SEND MESSAGE
// ======================================================

sendBtn.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ======================================================
// SEND FUNCTION
// ======================================================

async function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    if (!username) {

        alert(
            "Please join ADDA 007 first."
        );

        return;

    }


    // Prevent double clicks

    if (sendBtn.disabled) {

        return;

    }


    sendBtn.disabled = true;


    const messageData = {

        username:
            username,

        text:
            text.substring(0, 500),

        timestamp:
            Date.now(),

        time:
            new Date().toLocaleTimeString(
                "en-BD",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )

    };


    try {

        await push(
            messagesRef,
            messageData
        );


        messageInput.value = "";

        messageInput.focus();

    }

    catch (error) {

        console.error(
            "Firebase send error:",
            error
        );

        alert(
            "Message send failed. Check Firebase Database Rules."
        );

    }

    finally {

        sendBtn.disabled = false;

    }

}


// ======================================================
// RECEIVE MESSAGES
// ======================================================

onChildAdded(
    latestMessagesQuery,
    function(snapshot) {

        const data =
            snapshot.val();


        if (!data) {

            return;

        }


        // Remove welcome

        const welcome =
            document.querySelector(
                ".welcome-card"
            );


        if (welcome) {

            welcome.remove();

        }


        createMessage(
            data
        );

    },

    function(error) {

        console.error(
            "Firebase read error:",
            error
        );

    }
);


// ======================================================
// CREATE MESSAGE
// ======================================================

function createMessage(data) {

    const message =
        document.createElement(
            "div"
        );


    if (
        data.username === username
    ) {

        message.className =
            "message me";

    }

    else {

        message.className =
            "message other";

    }


    // Username

    const name =
        document.createElement(
            "div"
        );

    name.className =
        "message-name";

    name.textContent =
        data.username || "Unknown";


    // Text

    const text =
        document.createElement(
            "div"
        );

    text.className =
        "message-text";

    text.textContent =
        data.text || "";


    // Time

    const time =
        document.createElement(
            "span"
        );

    time.className =
        "message-time";

    time.textContent =
        data.time || "";


    // Build

    message.appendChild(
        name
    );

    message.appendChild(
        text
    );

    message.appendChild(
        time
    );


    messages.appendChild(
        message
    );


    // Scroll

    messages.scrollTop =
        messages.scrollHeight;

}


// ======================================================
// SEARCH
// ======================================================

searchBtn.addEventListener(
    "click",
    function() {

        searchBox.classList.toggle(
            "hidden"
        );


        if (
            !searchBox.classList.contains(
                "hidden"
            )
        ) {

            searchInput.focus();

        }

    }
);


searchInput.addEventListener(
    "input",
    function() {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();


        const allMessages =
            document.querySelectorAll(
                ".message"
            );


        allMessages.forEach(
            function(message) {

                const text =
                    message.textContent
                        .toLowerCase();


                if (
                    keyword &&
                    text.includes(keyword)
                ) {

                    message.classList.add(
                        "message-highlight"
                    );

                }

                else {

                    message.classList.remove(
                        "message-highlight"
                    );

                }

            }
        );

    }
);


// ======================================================
// EMOJI PANEL
// ======================================================

emojiBtn.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        emojiPanel.classList.toggle(
            "hidden"
        );

    }
);


// Emoji buttons

const emojiButtons =
    emojiPanel.querySelectorAll(
        "button"
    );


emojiButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const emoji =
                    button.textContent;


                messageInput.value +=
                    emoji;


                messageInput.focus();

            }
        );

    }
);


// Close emoji panel

document.addEventListener(
    "click",
    function(event) {

        if (
            !emojiPanel.contains(
                event.target
            ) &&
            event.target !== emojiBtn
        ) {

            emojiPanel.classList.add(
                "hidden"
            );

        }

    }
);


// ======================================================
// LOGOUT
// ======================================================

logoutBtn.addEventListener(
    "click",
    function() {

        const confirmLogout =
            confirm(
                "Leave ADDA 007?"
            );


        if (!confirmLogout) {

            return;

        }


        localStorage.removeItem(
            "adda007Username"
        );


        username = null;


        chatApp.style.display =
            "none";


        loginScreen.style.display =
            "flex";


        usernameInput.value =
            "";

        messageInput.value =
            "";

        usernameInput.focus();

    }
);


// ======================================================
// DEBUG
// ======================================================

console.log(
    "ADDA 007 initialized successfully."
);
