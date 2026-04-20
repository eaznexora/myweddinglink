document.addEventListener('DOMContentLoaded', () => {
    // Generate stable glitter particles immediately inside the container.
    const glitterContainer = document.getElementById('glitterContainer');
    if (glitterContainer) {
        for (let i = 0; i < 60; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            // Variable duration between 1.5s and 3s for a natural twinkling effect
            sparkle.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
            glitterContainer.appendChild(sparkle);
        }
    }
});

function openInvitation() {
    const introScreen = document.getElementById('introScreen');
    const mainInvitation = document.querySelector('.main-invitation');
    
    // Add open class to start the curtain animation
    introScreen.classList.add('open');
    
    // Set a timeout to fade in the main invitation content smoothly afterwards
    setTimeout(() => {
        mainInvitation.classList.add('ready');
        
        // Optionally, completely hide the intro wrapper after the transition is fully done.
        // Assuming 1.2s for curtain + 0.3s delay = 1.5s total animated duration.
        setTimeout(() => {
            introScreen.style.display = 'none';
            // Enable scrolling if main content requires it
            document.body.style.overflow = 'auto'; 
        }, 1600);
        
    }, 100); 
}
