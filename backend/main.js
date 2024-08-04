const socket = io();
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");
const clientsNumber = document.getElementById("client-total");
const messageForm = document.getElementById("message-form");

let typingTimeout;

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('client-total', (data) => {
    clientsNumber.innerHTML = `Total users ${data}`;
});

function sendMessage() {
    if (messageInput.value === '') return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        date: new Date()
    };
    socket.emit('message', data);
    addMessagetoUI(true, data);
    messageInput.value = '';
    clearTimeout(typingTimeout);
    socket.emit('feedback', { feedback: '' });
}

socket.on('chat-message', (data) => {
    addMessagetoUI(false, data);
});

function addMessagetoUI(isOwnMessage, data) {
    clearFeedback();
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
                
                <span style="font-size:20px"><b>${data.message}</b></span>
            </p>
        </li>
    `;
    messageContainer.innerHTML += element;
    scrollToBottom();
}

socket.on('feedback', (data) => {
    clearFeedback();
    if (data.feedback) {
        const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>
        `;
        messageContainer.innerHTML += element;
    }
});

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
const emitTypingFeedback = () => {
    socket.emit('feedback', {
      feedback: `${nameInput.value || 'A user'} is typing...`
    });
  };
messageInput.addEventListener('input', (e) => {
    emitTypingFeedback();

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('feedback', { feedback: '' });
    }, 1000);
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element);
    });
}
