import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onChildAdded
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ===============================
// FIREBASE CONFIG
// নিজের Firebase Config বসাও
// ===============================

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    databaseURL:
        "https://YOUR_PROJECT-default-rtdb.firebaseio.com",

    projectId: "YOUR_PROJECT",

    storageBucket:
        "YOUR_PROJECT.appspot.com",

    messagingSenderId:
        "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"

};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ADDA 007 DATABASE

const messagesRef =
    ref(database, "adda007Messages");


// ===============================
// ELEMENTS
// ===============================

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


// ===============================
// USERNAME
// ===============================

let username =
    localStorage.getItem("adda007Username");


// আগে login করা থাকলে

if (username) {

    startChat();

}


// ===============================
// JOIN ADDA 007
// ===============================

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


usernameInput.addEventListener(
    "keypress",
    (event) => {

        if (event.key === "Enter") {

            joinBtn.click();

        }

    }
);


// ===============================
// START CHAT
// ===============================

function startChat() {

    loginScreen.style.display =
        "none";

    chatApp.style.display =
        "flex";

}


// ===============================
// SEND MESSAGE
// ===============================

function sendMessage() {

    const text =
        messageInput.value.trim();

    if (!text) return;


    const messageData = {

        username: username,

        text: text,

        time: new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ),

        timestamp: Date.now()

    };


    push(
        messagesRef,
        messageData
    );


    messageInput.value = "";

}


// SEND BUTTON

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ENTER TO SEND

messageInput.addEventListener(
    "keypress",
    (event) => {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);


// ===============================
// RECEIVE LIVE MESSAGE
// ===============================

onChildAdded(

    messagesRef,

    (snapshot) => {

        const data =
            snapshot.val();


        const welcome =
            document.querySelector(
                ".welcome-message"
            );


        // প্রথম message আসলে welcome remove

        if (welcome) {

            welcome.remove();

        }


        const messageDiv =
            document.createElement("div");


        if (
            data.username === username
        ) {

            messageDiv.classList.add(
                "message",
                "me"
            );

        } else {

            messageDiv.classList.add(
                "message",
                "other"
            );

        }


        const nameDiv =
            document.createElement("div");

        nameDiv.className =
            "message-name";

        nameDiv.textContent =
            data.username;


        const textDiv =
            document.createElement("div");

        textDiv.className =
            "message-text";

        textDiv.textContent =
            data.text;


        const timeDiv =
            document.createElement("div");

        timeDiv.className =
            "message-time";

        timeDiv.textContent =
            data.time;


        messageDiv.appendChild(nameDiv);

        messageDiv.appendChild(textDiv);

        messageDiv.appendChild(timeDiv);


        messages.appendChild(messageDiv);


        messages.scrollTop =
            messages.scrollHeight;

    }

);


// ===============================
// LOGOUT
// ===============================

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
