// Flashcard App - Kid-Friendly Design with Subject and Chapter Organization
// This app helps kids create and study flashcards organized by subject and chapter

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
        this.selectedColor = '#FF9800';
        this.selectedItemId = null;
        this.selectedItemType = null;
        this.mode = null; // 'create' or 'study'
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.applyTheme();
        this.showScreen('home');
        
        // Create sample data if no data exists for each user
        if (this.userData.vance.subjects.length === 0) {
            this.createSampleDataForUser('vance');
        }
        if (this.userData.tucker.subjects.length === 0) {
            this.createSampleDataForUser('tucker');
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
                    
                    // Migration: Convert old deck structure to new subject/chapter structure
                    if (parsedData.decks && !parsedData.subjects) {
                        this.userData[user] = this.migrateOldDataStructure(parsedData);
                    } else if (parsedData.subjects) {
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
    
    migrateOldDataStructure(oldData) {
        // Create a default subject for old decks
        const defaultSubject = {
            id: this.generateId(),
            name: 'My Flashcards',
            color: '#4CAF50',
            chapters: [{
                id: this.generateId(),
                name: 'All Cards',
                decks: oldData.decks || []
            }]
        };
        
        return {
            subjects: [defaultSubject],
            settings: oldData.settings || { darkMode: false, shuffle: true }
        };
    }
    
    saveData() {
        try {
            localStorage.setItem(`flashcardData_${this.currentUser}`, JSON.stringify(this.getCurrentUserData()));
            localStorage.setItem('lastSelectedUser', this.currentUser);
        } catch (e) {
            console.error('Error saving data:', e);
            alert('Error saving your cards. Please try again.');
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
    
    createSampleDataForUser(user) {
        const userData = this.userData[user];
        const mathSubject = {
            id: this.generateId(),
            name: 'Math',
            color: '#2196F3',
            chapters: [
                {
                    id: this.generateId(),
                    name: 'Addition',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Basic Addition',
                            color: '#4CAF50',
                            cards: [
                                { id: this.generateId(), front: '2 + 2', back: '4' },
                                { id: this.generateId(), front: '5 + 3', back: '8' },
                                { id: this.generateId(), front: '7 + 6', back: '13' }
                            ]
                        }
                    ]
                }
            ]
        };
        
        const scienceSubject = {
            id: this.generateId(),
            name: 'Science',
            color: '#4CAF50',
            chapters: [
                {
                    id: this.generateId(),
                    name: 'Animals',
                    decks: [
                        {
                            id: this.generateId(),
                            name: 'Animal Facts',
                            color: '#FF9800',
                            cards: [
                                { id: this.generateId(), front: 'Largest land animal?', back: 'Elephant' },
                                { id: this.generateId(), front: 'Fastest land animal?', back: 'Cheetah' },
                                { id: this.generateId(), front: 'Tallest animal?', back: 'Giraffe' }
                            ]
                        }
                    ]
                }
            ]
        };
        
        userData.subjects.push(mathSubject, scienceSubject);
        
        // Save data for this specific user
        try {
            localStorage.setItem(`flashcardData_${user}`, JSON.stringify(userData));
        } catch (e) {
            console.error(`Error saving sample data for ${user}:`, e);
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Home screen buttons
        document.getElementById('create-cards-btn').addEventListener('click', () => {
            this.mode = 'create';
            this.showSubjectList();
        });
        
        document.getElementById('study-cards-btn').addEventListener('click', () => {
            this.mode = 'study';
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
        
        document.getElementById('info-button').addEventListener('click', () => {
            this.showInfoModal();
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
        
        document.getElementById('back-from-create').addEventListener('click', () => {
            this.showDeckList();
        });
        
        document.getElementById('back-from-study').addEventListener('click', () => {
            this.showDeckList();
        });
        
        // Add buttons
        document.getElementById('add-subject-btn').addEventListener('click', () => {
            this.showAddSubjectModal();
        });
        
        document.getElementById('add-chapter-btn').addEventListener('click', () => {
            this.showAddChapterModal();
        });
        
        document.getElementById('add-deck-btn').addEventListener('click', () => {
            this.showAddDeckModal();
        });
        
        document.getElementById('done-creating').addEventListener('click', () => {
            this.showDeckList();
        });
        
        // Card creation
        document.getElementById('add-card-btn').addEventListener('click', () => {
            this.addCard();
        });
        
        document.getElementById('quick-add-btn').addEventListener('click', () => {
            this.quickAddCards();
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
        
        // Modal controls
        this.setupModalListeners();
        
        // Enter key for adding cards
        document.getElementById('card-front').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('card-back').focus();
            }
        });
        
        document.getElementById('card-back').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCard();
            }
        });
        
        // Info modal
        document.getElementById('close-info').addEventListener('click', () => {
            this.hideModal('info-modal');
        });
    }
    
    setupModalListeners() {
        // Add Subject Modal
        document.getElementById('save-subject').addEventListener('click', () => {
            this.saveSubject();
        });
        
        document.getElementById('cancel-subject').addEventListener('click', () => {
            this.hideModal('add-subject-modal');
        });
        
        // Add Chapter Modal
        document.getElementById('save-chapter').addEventListener('click', () => {
            this.saveChapter();
        });
        
        document.getElementById('cancel-chapter').addEventListener('click', () => {
            this.hideModal('add-chapter-modal');
        });
        
        // Add Deck Modal
        document.getElementById('save-deck').addEventListener('click', () => {
            this.saveDeck();
        });
        
        document.getElementById('cancel-deck').addEventListener('click', () => {
            this.hideModal('add-deck-modal');
        });
        
        // Options Modal
        document.getElementById('rename-item').addEventListener('click', () => {
            this.renameItem();
        });
        
        document.getElementById('delete-item').addEventListener('click', () => {
            this.deleteItem();
        });
        
        document.getElementById('cancel-options').addEventListener('click', () => {
            this.hideModal('options-modal');
        });
        
        // Color picker for subjects
        document.querySelectorAll('.subject-colors .color-option').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.subject-colors .color-option').forEach(b => b.classList.remove('selected'));
                button.classList.add('selected');
                this.selectedColor = button.dataset.color;
            });
        });
        
        // Color picker for decks
        document.querySelectorAll('.deck-colors .color-option').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.deck-colors .color-option').forEach(b => b.classList.remove('selected'));
                button.classList.add('selected');
                this.selectedColor = button.dataset.color;
            });
        });
        
        // Modal backdrop clicks
        document.getElementById('add-subject-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('add-subject-modal');
            }
        });
        
        document.getElementById('add-chapter-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('add-chapter-modal');
            }
        });
        
        document.getElementById('add-deck-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('add-deck-modal');
            }
        });
        
        document.getElementById('options-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('options-modal');
            }
        });
        
        document.getElementById('info-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('info-modal');
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
        document.getElementById('subject-list-title').textContent = 
            this.mode === 'create' ? 'Choose a Subject to Edit' : 'Choose a Subject to Study';
        this.showScreen('subject-list');
        this.updateSubjectList();
    }
    
    showChapterList() {
        if (!this.currentSubject) return;
        
        document.getElementById('chapter-list-title').textContent = 
            `${this.currentSubject.name} - ${this.mode === 'create' ? 'Choose a Chapter' : 'Study a Chapter'}`;
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
                    <h3>No subjects yet!</h3>
                    <p>Click "Add Subject" to create your first subject.</p>
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
                        <button class="deck-options" data-subject-id="${subject.id}">⚙️</button>
                    </div>
                    <div class="deck-info">
                        ${subject.chapters.length} chapter${subject.chapters.length !== 1 ? 's' : ''} • 
                        ${totalCards} total card${totalCards !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for subject cards
        subjectList.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('deck-options')) return;
                const subjectId = card.dataset.subjectId;
                this.selectSubject(subjectId);
            });
        });
        
        // Add event listeners for subject options
        subjectList.querySelectorAll('.deck-options').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedItemId = button.dataset.subjectId;
                this.selectedItemType = 'subject';
                document.getElementById('options-modal-title').textContent = 'Subject Options';
                this.showModal('options-modal');
            });
        });
    }
    
    updateChapterList() {
        const chapterList = document.getElementById('chapter-list');
        
        if (this.currentSubject.chapters.length === 0) {
            chapterList.innerHTML = `
                <div class="empty-state">
                    <h3>No chapters yet!</h3>
                    <p>Click "Add Chapter" to organize your cards.</p>
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
                        <button class="deck-options" data-chapter-id="${chapter.id}">⚙️</button>
                    </div>
                    <div class="deck-info">
                        ${chapter.decks.length} deck${chapter.decks.length !== 1 ? 's' : ''} • 
                        ${totalCards} card${totalCards !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for chapter cards
        chapterList.querySelectorAll('.chapter-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('deck-options')) return;
                const chapterId = card.dataset.chapterId;
                this.selectChapter(chapterId);
            });
        });
        
        // Add event listeners for chapter options
        chapterList.querySelectorAll('.deck-options').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedItemId = button.dataset.chapterId;
                this.selectedItemType = 'chapter';
                document.getElementById('options-modal-title').textContent = 'Chapter Options';
                this.showModal('options-modal');
            });
        });
    }
    
    updateDeckList() {
        const deckList = document.getElementById('deck-list');
        
        if (this.currentChapter.decks.length === 0) {
            deckList.innerHTML = `
                <div class="empty-state">
                    <h3>No decks yet!</h3>
                    <p>Click "Add Deck" to create your first set of flashcards.</p>
                </div>
            `;
            return;
        }
        
        deckList.innerHTML = this.currentChapter.decks.map(deck => `
            <div class="deck-card" data-deck-id="${deck.id}" tabindex="0">
                <div class="deck-color" style="background-color: ${deck.color}"></div>
                <div class="deck-header">
                    <h3 class="deck-name">${this.escapeHtml(deck.name)}</h3>
                    <button class="deck-options" data-deck-id="${deck.id}">⚙️</button>
                </div>
                <div class="deck-info">
                    ${deck.cards.length} card${deck.cards.length !== 1 ? 's' : ''}
                </div>
            </div>
        `).join('');
        
        // Add event listeners for deck cards
        deckList.querySelectorAll('.deck-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('deck-options')) return;
                const deckId = card.dataset.deckId;
                this.selectDeck(deckId);
            });
        });
        
        // Add event listeners for deck options
        deckList.querySelectorAll('.deck-options').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedItemId = button.dataset.deckId;
                this.selectedItemType = 'deck';
                document.getElementById('options-modal-title').textContent = 'Deck Options';
                this.showModal('options-modal');
            });
        });
    }
    
    updateCreateCardsScreen() {
        if (!this.currentDeck) return;
        
        document.getElementById('create-cards-title').textContent = 
            `${this.currentSubject.name} > ${this.currentChapter.name} > ${this.currentDeck.name}`;
        
        this.updateCardsList();
        this.clearCardInputs();
    }
    
    updateCardsList() {
        const cardsList = document.getElementById('cards-list');
        
        if (this.currentDeck.cards.length === 0) {
            cardsList.innerHTML = `
                <h3>Cards in This Deck</h3>
                <div class="empty-state">
                    <p>No cards yet! Add some cards above.</p>
                </div>
            `;
            return;
        }
        
        cardsList.innerHTML = `
            <h3>Cards in This Deck (${this.currentDeck.cards.length})</h3>
            ${this.currentDeck.cards.map(card => `
                <div class="card-item">
                    <div class="card-content">
                        <div class="card-side">
                            <div class="card-side-label">Front</div>
                            <div class="card-side-text">${this.escapeHtml(card.front)}</div>
                        </div>
                        <div class="card-side">
                            <div class="card-side-label">Back</div>
                            <div class="card-side-text">${this.escapeHtml(card.back)}</div>
                        </div>
                    </div>
                    <button class="delete-card" data-card-id="${card.id}" title="Delete card">×</button>
                </div>
            `).join('')}
        `;
        
        // Add delete event listeners
        cardsList.querySelectorAll('.delete-card').forEach(button => {
            button.addEventListener('click', () => {
                const cardId = button.dataset.cardId;
                this.deleteCard(cardId);
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
        
        if (this.mode === 'create') {
            this.showScreen('create-cards');
            this.updateCreateCardsScreen();
        } else {
            if (this.currentDeck.cards.length === 0) {
                alert('This deck has no cards yet! Add some cards first.');
                return;
            }
            this.showScreen('study');
            this.updateStudyScreen();
        }
    }
    
    // Add Methods
    showAddSubjectModal() {
        document.getElementById('subject-name-input').value = '';
        this.selectedColor = '#FF9800';
        document.querySelectorAll('.subject-colors .color-option').forEach(b => b.classList.remove('selected'));
        document.querySelector('.subject-colors [data-color="#FF9800"]').classList.add('selected');
        this.showModal('add-subject-modal');
        document.getElementById('subject-name-input').focus();
    }
    
    showAddChapterModal() {
        document.getElementById('chapter-name-input').value = '';
        this.showModal('add-chapter-modal');
        document.getElementById('chapter-name-input').focus();
    }
    
    showAddDeckModal() {
        document.getElementById('deck-name-input').value = '';
        this.selectedColor = '#FF9800';
        document.querySelectorAll('.deck-colors .color-option').forEach(b => b.classList.remove('selected'));
        document.querySelector('.deck-colors [data-color="#FF9800"]').classList.add('selected');
        this.showModal('add-deck-modal');
        document.getElementById('deck-name-input').focus();
    }
    
    saveSubject() {
        const name = document.getElementById('subject-name-input').value.trim();
        if (!name) {
            alert('Please enter a subject name!');
            return;
        }
        
        const newSubject = {
            id: this.generateId(),
            name: name,
            color: this.selectedColor,
            chapters: []
        };
        
        this.getCurrentUserData().subjects.push(newSubject);
        this.saveData();
        this.hideModal('add-subject-modal');
        this.updateSubjectList();
    }
    
    saveChapter() {
        const name = document.getElementById('chapter-name-input').value.trim();
        if (!name) {
            alert('Please enter a chapter name!');
            return;
        }
        
        const newChapter = {
            id: this.generateId(),
            name: name,
            decks: []
        };
        
        this.currentSubject.chapters.push(newChapter);
        this.saveData();
        this.hideModal('add-chapter-modal');
        this.updateChapterList();
    }
    
    saveDeck() {
        const name = document.getElementById('deck-name-input').value.trim();
        if (!name) {
            alert('Please enter a deck name!');
            return;
        }
        
        const newDeck = {
            id: this.generateId(),
            name: name,
            color: this.selectedColor,
            cards: []
        };
        
        this.currentChapter.decks.push(newDeck);
        this.saveData();
        this.hideModal('add-deck-modal');
        this.updateDeckList();
    }
    
    // Rename and Delete Methods
    renameItem() {
        let item, newName;
        
        if (this.selectedItemType === 'subject') {
            item = this.getCurrentUserData().subjects.find(s => s.id === this.selectedItemId);
            if (!item) return;
            newName = prompt('Enter new subject name:', item.name);
        } else if (this.selectedItemType === 'chapter') {
            item = this.currentSubject.chapters.find(c => c.id === this.selectedItemId);
            if (!item) return;
            newName = prompt('Enter new chapter name:', item.name);
        } else if (this.selectedItemType === 'deck') {
            item = this.currentChapter.decks.find(d => d.id === this.selectedItemId);
            if (!item) return;
            newName = prompt('Enter new deck name:', item.name);
        }
        
        if (newName && newName.trim()) {
            item.name = newName.trim();
            this.saveData();
            
            // Update the appropriate list
            if (this.selectedItemType === 'subject') {
                this.updateSubjectList();
            } else if (this.selectedItemType === 'chapter') {
                this.updateChapterList();
            } else if (this.selectedItemType === 'deck') {
                this.updateDeckList();
            }
        }
        
        this.hideModal('options-modal');
    }
    
    deleteItem() {
        let confirmMessage, item;
        
        if (this.selectedItemType === 'subject') {
            item = this.getCurrentUserData().subjects.find(s => s.id === this.selectedItemId);
            if (!item) return;
            confirmMessage = `Are you sure you want to delete the subject "${item.name}"? This will delete all chapters and cards within it.`;
        } else if (this.selectedItemType === 'chapter') {
            item = this.currentSubject.chapters.find(c => c.id === this.selectedItemId);
            if (!item) return;
            confirmMessage = `Are you sure you want to delete the chapter "${item.name}"? This will delete all decks and cards within it.`;
        } else if (this.selectedItemType === 'deck') {
            item = this.currentChapter.decks.find(d => d.id === this.selectedItemId);
            if (!item) return;
            confirmMessage = `Are you sure you want to delete the deck "${item.name}"? This will delete all cards within it.`;
        }
        
        if (confirm(confirmMessage)) {
            if (this.selectedItemType === 'subject') {
                this.getCurrentUserData().subjects = this.getCurrentUserData().subjects.filter(s => s.id !== this.selectedItemId);
                this.updateSubjectList();
            } else if (this.selectedItemType === 'chapter') {
                this.currentSubject.chapters = this.currentSubject.chapters.filter(c => c.id !== this.selectedItemId);
                this.updateChapterList();
            } else if (this.selectedItemType === 'deck') {
                this.currentChapter.decks = this.currentChapter.decks.filter(d => d.id !== this.selectedItemId);
                this.updateDeckList();
            }
            
            this.saveData();
        }
        
        this.hideModal('options-modal');
    }
    
    // Card Management
    addCard() {
        const front = document.getElementById('card-front').value.trim();
        const back = document.getElementById('card-back').value.trim();
        
        if (!front || !back) {
            alert('Please fill in both the front and back of the card!');
            return;
        }
        
        const newCard = {
            id: this.generateId(),
            front: front,
            back: back
        };
        
        this.currentDeck.cards.push(newCard);
        this.saveData();
        this.updateCardsList();
        this.clearCardInputs();
        
        // Focus back on front input for quick adding
        document.getElementById('card-front').focus();
    }
    
    quickAddCards() {
        const text = document.getElementById('quick-add-text').value.trim();
        if (!text) return;
        
        const lines = text.split('\n').filter(line => line.trim());
        let addedCount = 0;
        
        lines.forEach(line => {
            const parts = line.split('|').map(part => part.trim());
            if (parts.length >= 2 && parts[0] && parts[1]) {
                const newCard = {
                    id: this.generateId(),
                    front: parts[0],
                    back: parts[1]
                };
                this.currentDeck.cards.push(newCard);
                addedCount++;
            }
        });
        
        if (addedCount > 0) {
            this.saveData();
            this.updateCardsList();
            document.getElementById('quick-add-text').value = '';
            alert(`Added ${addedCount} card${addedCount !== 1 ? 's' : ''}!`);
        } else {
            alert('No valid cards found. Make sure each line has this format: Front | Back');
        }
    }
    
    deleteCard(cardId) {
        if (confirm('Are you sure you want to delete this card?')) {
            this.currentDeck.cards = this.currentDeck.cards.filter(card => card.id !== cardId);
            this.saveData();
            this.updateCardsList();
        }
    }
    
    clearCardInputs() {
        document.getElementById('card-front').value = '';
        document.getElementById('card-back').value = '';
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
            alert('This deck has no cards!');
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
        alert(`Great job! You studied all ${totalCards} cards in "${this.currentDeck.name}".`);
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
    
    // Info Modal
    showInfoModal() {
        this.showModal('info-modal');
    }
    
    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
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