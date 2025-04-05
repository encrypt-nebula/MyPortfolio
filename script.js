// ======================
// DIALOGFLOW CHATBOT (Code1 - Improved)
// ======================
let dfChatbotLoaded = false;

async function loadDFScript() {
    if (dfChatbotLoaded) return;
    
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger-cx/bootstrap.js?v=1';
        script.onload = () => {
            dfChatbotLoaded = true;
            resolve();
        };
        document.body.appendChild(script);
    });
}

function createDFMessenger() {
    const dfMessenger = document.createElement('df-messenger');
    dfMessenger.id = 'portfolioChatbot';
    dfMessenger.setAttribute('chat-title', 'PortfolioBot');
    dfMessenger.setAttribute('agent-id', 'df6e61bb-d7ea-4595-823a-9f6f45080a70');
    dfMessenger.setAttribute('language-code', 'en');
    dfMessenger.setAttribute('location', 'global');
    dfMessenger.setAttribute('expand', 'false');
    dfMessenger.style.display = 'none';
    document.body.appendChild(dfMessenger);
    return dfMessenger;
}

async function openDFChatbot() {
    try {
        await loadDFScript();
        const chatbot = createDFMessenger();
        chatbot.style.display = 'block';
        
        // Improved opening mechanism
        const maxAttempts = 30;
        let attempts = 0;
        
        const tryOpen = setInterval(() => {
            attempts++;
            try {
                const openButton = chatbot.shadowRoot.querySelector('button[aria-label="Open chat"]');
                if (openButton) {
                    openButton.click();
                    clearInterval(tryOpen);
                } else if (attempts >= maxAttempts) {
                    clearInterval(tryOpen);
                    console.warn('Max attempts reached to open chatbot');
                }
            } catch (e) {
                if (attempts >= maxAttempts) {
                    clearInterval(tryOpen);
                    console.warn('Failed to access chatbot shadow DOM');
                }
            }
        }, 100);
        
    } catch (error) {
        console.error('Dialogflow Error:', error);
        alert('Chatbot is currently unavailable. Please try again later.');
    }
}

// ======================
// EXISTING FUNCTIONALITY (Code2)
// ======================
async function loadTestimonials() {
    try {
        const response = await fetch('testimonials.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const testimonials = await response.json();
        const wrapper = document.querySelector('.wrapper');
        
        if (!wrapper) {
            console.error('Testimonials wrapper not found');
            return;
        }
        
        wrapper.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-item">
                <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
                <h2>${testimonial.name}</h2>
                <div class="rating">
                    ${'<i class="bx bxs-star"></i>'.repeat(testimonial.rating)}
                    ${testimonial.rating < 5 ? '<i class="bx bx-star"></i>'.repeat(5 - testimonial.rating) : ''}
                </div>
                <p>${testimonial.review}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Testimonials Error:', error);
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
            wrapper.innerHTML = '<p>Testimonials could not be loaded at this time.</p>';
        }
    }
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize testimonials
    loadTestimonials();
    
    // Set up chatbot button
    const chatbotButton = document.querySelector('.btnBelow');
    if (chatbotButton) {
        chatbotButton.addEventListener('click', openDFChatbot);
    }
    
    // Other initializations can go here
});