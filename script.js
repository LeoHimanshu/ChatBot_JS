const chatInput= document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler=document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn");

let userMessage;
const API_KEY="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";
const inputInitHeight=chatInput.scrollHeight;

const createChatLi= (message,className)=>{

    const chatLi= document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className==="outgoing" ? `<p></p>`:`<span class="material-symbols-outlined">🤖</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

const generateResponse=(incomingChatLI)=>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLI.querySelector("p");
    

    const requestOptions={
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
            messages: [{role:"user", content:userMessage}]
        })
    }

    // request to fetch data from Chat GPT
    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        messageElement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent="Oops! Something went wrong. Please try again.";
    }).finally(()=>chatbox.scrollTo(0, chatbox.scrollHeight));

}

const handleChat=()=>{
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value ="";
    chatInput.style.height=`${inputInitHeight}px`;

    //append user message
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(()=>{

        const incomingChatLI = createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLI);
    },600)
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
