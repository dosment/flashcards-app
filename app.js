// Flashcard App - Study-Only Version with Pre-loaded Vocabulary
// This app helps kids study pre-made flashcards organized by subject and chapter

class FlashcardApp {
    constructor() {
        this.currentUser = 'vance'; // Default user
        this.userData = {
            vance: {
                subjects: [],
                settings: {
                    darkMode: false,
                    shuffle: true
                }
            },
            tucker: {
                subjects: [],
                settings: {
                    darkMode: false,
                    shuffle: true
                }
            }
        };
        
        this.currentScreen = 'home';
        this.currentSubject = null;
        this.currentChapter = null;
        this.currentDeck = null;
        this.studyCards = [];
        this.currentCardIndex = 0;
        this.isCardFlipped = false;
        this.mode = 'study'; // Always study mode
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.applyTheme();
        this.showScreen('home');
        
        // Create vocabulary data if no data exists for each user
        if (this.userData.vance.subjects.length === 0) {
            this.createVocabularyData('vance');
        }
        if (this.userData.tucker.subjects.length === 0) {
            this.createVocabularyData('tucker');
        }
        
        this.updateTitle();
    }
    
    // Data Management
    loadData() {
        // Load data for both users
        for (const user of ['vance', 'tucker']) {
            const savedData = localStorage.getItem(`flashcardData_${user}`);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    if (parsedData.subjects) {
                        this.userData[user] = parsedData;
                    }
                    
                    // Ensure settings exist
                    if (!this.userData[user].settings) {
                        this.userData[user].settings = { darkMode: false, shuffle: true };
                    }
                } catch (e) {
                    console.error(`Error loading data for ${user}:`, e);
                }
            }
        }
        
        // Load last selected user
        const lastUser = localStorage.getItem('lastSelectedUser');
        if (lastUser && ['vance', 'tucker'].includes(lastUser)) {
            this.currentUser = lastUser;
        }
        
        // Update UI
        document.getElementById('user-select').value = this.currentUser;
    }
    
    saveData() {
        try {
            localStorage.setItem(`flashcardData_${this.currentUser}`, JSON.stringify(this.getCurrentUserData()));
            localStorage.setItem('lastSelectedUser', this.currentUser);
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }
    
    getCurrentUserData() {
        return this.userData[this.currentUser];
    }
    
    switchUser(newUser) {
        if (!['vance', 'tucker'].includes(newUser)) return;
        
        this.currentUser = newUser;
        this.currentSubject = null;
        this.currentChapter = null;
        this.currentDeck = null;
        
        // Save the user preference
        localStorage.setItem('lastSelectedUser', this.currentUser);
        
        // Apply theme for current user
        this.applyTheme();
        
        // Go back to home screen
        this.showScreen('home');
        
        // Update title to show current user
        this.updateTitle();
    }
    
    updateTitle() {
        const userName = this.currentUser.charAt(0).toUpperCase() + this.currentUser.slice(1);
        document.querySelector('.app-title').textContent = `${userName}'s Flashcards`;
    }
    
    createVocabularyData(user) {
        const userData = this.userData[user];
        
        const scienceSubject = {
            id: this.generateId(),
            name: '6th Grade Texas Science',
            color: '#4CAF50',
            chapters: [
                {
                    id: this.generateId(),
                    name: 'Chapter 1 Vocabulary',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Scientific Method Terms',
                            color: '#2196F3',
                            cards: [
                                {
                                    id: this.generateId(),
                                    front: 'observation',
                                    back: 'the act of using one or more of your senses to gather information and take note of what occurs.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'inference',
                                    back: 'a logical explanation of an observation that is drawn from prior knowledge or experience.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'hypothesis',
                                    back: 'a possible explanation for an observation that can be tested by scientific investigations.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'independent variable',
                                    back: 'the factor that is changed by the investigator to observe how it affects a dependent variable'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'dependent variable',
                                    back: 'the factor measured or observed during an experiment'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'constants',
                                    back: 'the factors in an experiment that remain the same'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'control group',
                                    back: 'the part of an experiment that contains the same factors as the experimental group, but the independent variable is not changed.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'model',
                                    back: 'a representation of a phenomenon, a system, a process, or a solution to an engineering problem that helps people visualize or understand the concept.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'scientific theory',
                                    back: 'an explanation of observations or events based on knowledge gained from many observations and investigations.'
                                },
                                {
                                    id: this.generateId(),
                                    front: 'scientific law',
                                    back: 'a rule that describes a pattern in nature.'
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        
        userData.subjects.push(scienceSubject);
        
        // Save data for this specific user
        try {
            localStorage.setItem(`flashcardData_${user}`, JSON.stringify(userData));
        } catch (e) {
            console.error(`Error saving vocabulary data for ${user}:`, e);
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Home screen button - only study now
        document.getElementById('study-cards-btn').addEventListener('click', () => {
            this.showSubjectList();
        });
        
        // User switcher
        document.getElementById('user-select').addEventListener('change', (e) => {
            this.switchUser(e.target.value);
        });
        
        // Header controls
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Navigation
        document.getElementById('back-to-home-subjects').addEventListener('click', () => {
            this.showScreen('home');
        });
        
        document.getElementById('back-to-subjects').addEventListener('click', () => {
            this.showSubjectList();
        });
        
        document.getElementById('back-to-chapters').addEventListener('click', () => {
            this.showChapterList();
        });
        
        document.getElementById('back-from-study').addEventListener('click', () => {
            this.showDeckList();
        });
        
        // Study controls
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipCard();
        });
        
        document.getElementById('got-it').addEventListener('click', () => {
            this.answerCard(true);
        });
        
        document.getElementById('try-again').addEventListener('click', () => {
            this.answerCard(false);
        });
        
        document.getElementById('shuffle-checkbox').addEventListener('change', (e) => {
            this.getCurrentUserData().settings.shuffle = e.target.checked;
            this.saveData();
            if (this.studyCards.length > 0) {
                this.setupStudySession();
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts in study mode
            if (this.currentScreen !== 'study') return;
            
            switch(e.key) {
                case ' ': // Spacebar to flip card
                    e.preventDefault();
                    this.flipCard();
                    break;
                case 'ArrowRight': // Right arrow for "Got it"
                    e.preventDefault();
                    if (this.isCardFlipped) {
                        this.answerCard(true);
                    }
                    break;
                case 'ArrowLeft': // Left arrow for "Try again"
                    e.preventDefault();
                    if (this.isCardFlipped) {
                        this.answerCard(false);
                    }
                    break;
            }
        });
    }
    
    // Screen Management
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show selected screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
    }
    
    showSubjectList() {
        document.getElementById('subject-list-title').textContent = 'Choose a Subject to Study';
        this.showScreen('subject-list');
        this.updateSubjectList();
    }
    
    showChapterList() {
        if (!this.currentSubject) return;
        
        document.getElementById('chapter-list-title').textContent = 
            `${this.currentSubject.name} - Study a Chapter`;
        this.showScreen('chapter-list');
        this.updateChapterList();
    }
    
    showDeckList() {
        if (!this.currentChapter) return;
        
        document.getElementById('deck-list-title').textContent = 
            `${this.currentSubject.name} > ${this.currentChapter.name}`;
        this.showScreen('deck-list');
        this.updateDeckList();
    }
    
    updateSubjectList() {
        const subjectList = document.getElementById('subject-list');
        const subjects = this.getCurrentUserData().subjects;
        
        if (subjects.length === 0) {
            subjectList.innerHTML = `
                <div class="empty-state">
                    <h3>No subjects available!</h3>
                    <p>Vocabulary will be added soon.</p>
                </div>
            `;
            return;
        }
        
        subjectList.innerHTML = subjects.map(subject => {
            const totalCards = subject.chapters.reduce((total, chapter) => {
                return total + chapter.decks.reduce((chapterTotal, deck) => {
                    return chapterTotal + deck.cards.length;
                }, 0);
            }, 0);
            
            return `
                <div class="deck-card subject-card" data-subject-id="${subject.id}" tabindex="0">
                    <div class="deck-color" style="background-color: ${subject.color}"></div>
                    <div class="deck-header">
                        <h3 class="deck-name">${this.escapeHtml(subject.name)}</h3>
                    </div>
                    <div class="deck-info">
                        ${subject.chapters.length} chapter${subject.chapters.length !== 1 ? 's' : ''} • 
                        ${totalCards} vocabulary word${totalCards !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for subject cards
        subjectList.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const subjectId = card.dataset.subjectId;
                this.selectSubject(subjectId);
            });
        });
    }
    
    updateChapterList() {
        const chapterList = document.getElementById('chapter-list');
        
        if (this.currentSubject.chapters.length === 0) {
            chapterList.innerHTML = `
                <div class="empty-state">
                    <h3>No chapters available!</h3>
                    <p>Vocabulary chapters will be added soon.</p>
                </div>
            `;
            return;
        }
        
        chapterList.innerHTML = this.currentSubject.chapters.map(chapter => {
            const totalCards = chapter.decks.reduce((total, deck) => {
                return total + deck.cards.length;
            }, 0);
            
            return `
                <div class="deck-card chapter-card" data-chapter-id="${chapter.id}" tabindex="0">
                    <div class="deck-color" style="background-color: ${this.currentSubject.color}; opacity: 0.7;"></div>
                    <div class="deck-header">
                        <h3 class="deck-name">${this.escapeHtml(chapter.name)}</h3>
                    </div>
                    <div class="deck-info">
                        ${chapter.decks.length} deck${chapter.decks.length !== 1 ? 's' : ''} • 
                        ${totalCards} vocabulary word${totalCards !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for chapter cards
        chapterList.querySelectorAll('.chapter-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const chapterId = card.dataset.chapterId;
                this.selectChapter(chapterId);
            });
        });
    }
    
    updateDeckList() {
        const deckList = document.getElementById('deck-list');
        
        if (this.currentChapter.decks.length === 0) {
            deckList.innerHTML = `
                <div class="empty-state">
                    <h3>No vocabulary decks available!</h3>
                    <p>Vocabulary will be added soon.</p>
                </div>
            `;
            return;
        }
        
        deckList.innerHTML = this.currentChapter.decks.map(deck => `
            <div class="deck-card" data-deck-id="${deck.id}" tabindex="0">
                <div class="deck-color" style="background-color: ${deck.color}"></div>
                <div class="deck-header">
                    <h3 class="deck-name">${this.escapeHtml(deck.name)}</h3>
                </div>
                <div class="deck-info">
                    ${deck.cards.length} vocabulary word${deck.cards.length !== 1 ? 's' : ''}
                </div>
            </div>
        `).join('');
        
        // Add event listeners for deck cards
        deckList.querySelectorAll('.deck-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const deckId = card.dataset.deckId;
                this.selectDeck(deckId);
            });
        });
    }
    
    updateStudyScreen() {
        if (!this.currentDeck) return;
        
        document.getElementById('study-deck-name').textContent = 
            `${this.currentSubject.name} > ${this.currentChapter.name} > ${this.currentDeck.name}`;
        document.getElementById('shuffle-checkbox').checked = this.getCurrentUserData().settings.shuffle;
        
        this.setupStudySession();
        this.showCurrentCard();
    }
    
    // Navigation Methods
    selectSubject(subjectId) {
        this.currentSubject = this.getCurrentUserData().subjects.find(subject => subject.id === subjectId);
        if (!this.currentSubject) return;
        
        this.showChapterList();
    }
    
    selectChapter(chapterId) {
        this.currentChapter = this.currentSubject.chapters.find(chapter => chapter.id === chapterId);
        if (!this.currentChapter) return;
        
        this.showDeckList();
    }
    
    selectDeck(deckId) {
        this.currentDeck = this.currentChapter.decks.find(deck => deck.id === deckId);
        if (!this.currentDeck) return;
        
        if (this.currentDeck.cards.length === 0) {
            alert('This deck has no vocabulary words yet!');
            return;
        }
        this.showScreen('study');
        this.updateStudyScreen();
    }
    
    // Study Mode
    setupStudySession() {
        this.studyCards = [...this.currentDeck.cards];
        
        if (this.getCurrentUserData().settings.shuffle) {
            this.shuffleArray(this.studyCards);
        }
        
        this.currentCardIndex = 0;
        this.isCardFlipped = false;
        
        if (this.studyCards.length === 0) {
            alert('This deck has no vocabulary words!');
            return;
        }
    }
    
    showCurrentCard() {
        if (this.currentCardIndex >= this.studyCards.length) {
            this.finishStudySession();
            return;
        }
        
        const card = this.studyCards[this.currentCardIndex];
        
        // Update progress
        const progress = ((this.currentCardIndex + 1) / this.studyCards.length) * 100;
        document.getElementById('progress-text').textContent = 
            `${this.currentCardIndex + 1} of ${this.studyCards.length}`;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Show card content
        document.getElementById('card-front-text').textContent = card.front;
        document.getElementById('card-back-text').textContent = card.back;
        
        // Reset card state
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('flip-card').style.display = 'block';
        document.getElementById('answer-buttons').classList.add('hidden');
        this.isCardFlipped = false;
    }
    
    flipCard() {
        if (this.isCardFlipped) return;
        
        document.getElementById('flashcard').classList.add('flipped');
        document.getElementById('flip-card').style.display = 'none';
        document.getElementById('answer-buttons').classList.remove('hidden');
        this.isCardFlipped = true;
    }
    
    answerCard(gotIt) {
        if (!this.isCardFlipped) return;
        
        // If they didn't get it, add the card back to the end of the study session
        if (!gotIt) {
            this.studyCards.push(this.studyCards[this.currentCardIndex]);
        }
        
        this.currentCardIndex++;
        this.showCurrentCard();
    }
    
    finishStudySession() {
        const totalCards = this.currentDeck.cards.length;
        alert(`Great job! You studied all ${totalCards} vocabulary words in "${this.currentDeck.name}".`);
        this.showDeckList();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Theme Management
    toggleTheme() {
        this.getCurrentUserData().settings.darkMode = !this.getCurrentUserData().settings.darkMode;
        this.saveData();
        this.applyTheme();
    }
    
    applyTheme() {
        if (this.getCurrentUserData().settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('theme-toggle').textContent = '☀️';
        } else {
            document.body.removeAttribute('data-theme');
            document.getElementById('theme-toggle').textContent = '🌙';
        }
    }
    
    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});