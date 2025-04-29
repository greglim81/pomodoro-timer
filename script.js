class PomodoroTimer {
    constructor() {
        this.timeDisplay = document.querySelector('.time-display');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.status = document.querySelector('.status');
        
        // Fixed durations in minutes
        this.workDuration = 25;
        this.breakDuration = 5;
        
        this.timeLeft = 0;
        this.timerId = null;
        this.isWorkTime = true;
        this.isRunning = false;
        
        this.initializeEventListeners();
        this.reset();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.status.textContent = this.isWorkTime ? 'Work time!' : 'Break time!';
            
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.playNotification();
                    this.switchMode();
                }
            }, 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.status.textContent = 'Paused';
            clearInterval(this.timerId);
        }
    }
    
    reset() {
        this.pause();
        this.isWorkTime = true;
        this.timeLeft = this.workDuration * 60;
        this.updateDisplay();
        this.status.textContent = 'Ready to start!';
    }
    
    switchMode() {
        this.isWorkTime = !this.isWorkTime;
        this.timeLeft = (this.isWorkTime ? this.workDuration : this.breakDuration) * 60;
        this.status.textContent = this.isWorkTime ? 'Work time!' : 'Break time!';
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    playNotification() {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            return;
        }
        
        // Request permission if needed
        if (Notification.permission === "granted") {
            new Notification(this.isWorkTime ? "Time for a break!" : "Back to work!");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(this.isWorkTime ? "Time for a break!" : "Back to work!");
                }
            });
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 