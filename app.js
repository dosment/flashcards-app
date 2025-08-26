// Flashcard App - Kid-Friendly Design for Age 11
// This app helps kids create and study flashcards easily

class FlashcardApp {
    constructor() {
        this.data = {
            decks: [],
            settings: {
                darkMode: false,
                shuffle: true
            }
        };
        
        this.currentScreen = 'home';
        this.currentDeck = null;
        this.studyCards = [];
        this.currentCardIndex = 0;
        this.isCardFlipped = false;
        this.selectedColor = '#FF9800';
        this.selectedDeckId = null;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.applyTheme();
        this.showScreen('home');
        
        // Create sample data if no data exists
        if (this.data.decks.length === 0) {
            this.createSampleDeck();
        }
    }
    
    // Data Management
    loadData() {
        const savedData = localStorage.getItem('flashcardData');
        if (savedData) {
            try {
                this.data = JSON.parse(savedData);
                // Ensure settings exist
                if (!this.data.settings) {
                    this.data.settings = { darkMode: false, shuffle: true };
                }
            } catch (e) {
                console.error('Error loading data:', e);
                this.data = {
                    decks: [],
                    settings: { darkMode: false, shuffle: true }
                };
            }
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('flashcardData', JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving data:', e);
            alert('Error saving your cards. Please try again.');
        }
    }
    
    createSampleDeck() {
        const sampleDeck = {
            id: this.generateId(),
            name: 'Animals',
            color: '#4CAF50',
            cards: [
                { id: this.generateId(), front: 'Cat', back: 'A small domesticated carnivorous mammal.' },
                { id: this.generateId(), front: 'Dog', back: 'A loyal domesticated canine.' },
                { id: this.generateId(), front: 'Elephant', back: 'The largest land animal with a trunk.' },
                { id: this.generateId(), front: 'Lion', back: 'The king of the jungle with a mighty roar.' },
                { id: this.generateId(), front: 'Penguin', back: 'A black and white bird that cannot fly but swims well.' }
            ]
        };
        
        this.data.decks.push(sampleDeck);
        this.saveData();
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Home screen buttons
        document.getElementById('create-cards-btn').addEventListener('click', () => {
            this.showDeckList('create');
        });
        
        document.getElementById('study-cards-btn').addEventListener('click', () => {
            this.showDeckList('study');
        });
        
        // Header controls
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.getElementById('export-button').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('import-button').addEventListener('click', () => {
            this.importData();
        });
        
        // Navigation
        document.getElementById('back-to-home').addEventListener('click', () => {
            this.showScreen('home');
        });
        
        document.getElementById('back-to-decks-create').addEventListener('click', () => {
            this.showDeckList('create');
        });
        
        document.getElementById('back-to-decks-study').addEventListener('click', () => {
            this.showDeckList('study');
        });
        
        // Deck management
        document.getElementById('add-deck-btn').addEventListener('click', () => {
            this.showAddDeckModal();
        });
        
        document.getElementById('done-creating').addEventListener('click', () => {
            this.showDeckList('create');
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
            this.data.settings.shuffle = e.target.checked;
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
        
        // File import
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFileImport(e);
        });
    }
    
    setupModalListeners() {
        // Add Deck Modal
        document.getElementById('save-deck').addEventListener('click', () => {
            this.saveDeck();
        });
        
        document.getElementById('cancel-deck').addEventListener('click', () => {
            this.hideModal('add-deck-modal');
        });
        
        // Deck Options Modal
        document.getElementById('rename-deck').addEventListener('click', () => {
            this.renameDeck();
        });
        
        document.getElementById('delete-deck').addEventListener('click', () => {
            this.deleteDeck();
        });
        
        document.getElementById('cancel-options').addEventListener('click', () => {
            this.hideModal('deck-options-modal');
        });
        
        // Color picker
        document.querySelectorAll('.color-option').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
                button.classList.add('selected');
                this.selectedColor = button.dataset.color;
            });
        });
        
        // Modal backdrop clicks
        document.getElementById('add-deck-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('add-deck-modal');
            }
        });
        
        document.getElementById('deck-options-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('deck-options-modal');
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
        
        // Update screen content
        switch(screenName) {
            case 'home':
                this.updateHomeScreen();
                break;
            case 'deck-list':
                this.updateDeckList();
                break;
            case 'create-cards':
                this.updateCreateCardsScreen();
                break;
            case 'study':
                this.updateStudyScreen();
                break;
        }
    }
    
    showDeckList(mode) {
        this.deckListMode = mode;
        document.getElementById('deck-list-title').textContent = 
            mode === 'create' ? 'Choose a Deck to Edit' : 'Choose a Deck to Study';
        this.showScreen('deck-list');
    }
    
    updateHomeScreen() {
        // Home screen doesn't need dynamic updates
    }
    
    updateDeckList() {
        const deckList = document.getElementById('deck-list');
        
        if (this.data.decks.length === 0) {
            deckList.innerHTML = `
                <div class="empty-state">
                    <h3>No decks yet!</h3>
                    <p>Click "Add Deck" to create your first set of flashcards.</p>
                </div>
            `;
            return;
        }
        
        deckList.innerHTML = this.data.decks.map(deck => `
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
            
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const deckId = card.dataset.deckId;
                    this.selectDeck(deckId);
                }
            });
        });
        
        // Add event listeners for deck options
        deckList.querySelectorAll('.deck-options').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedDeckId = button.dataset.deckId;
                this.showModal('deck-options-modal');
            });
        });
    }
    
    updateCreateCardsScreen() {
        if (!this.currentDeck) return;
        
        document.getElementById('create-cards-title').textContent = 
            `Editing: ${this.currentDeck.name}`;
        
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
        
        document.getElementById('study-deck-name').textContent = this.currentDeck.name;
        document.getElementById('shuffle-checkbox').checked = this.data.settings.shuffle;
        
        this.setupStudySession();
        this.showCurrentCard();
    }
    
    // Deck Management
    selectDeck(deckId) {
        this.currentDeck = this.data.decks.find(deck => deck.id === deckId);
        if (!this.currentDeck) return;
        
        if (this.deckListMode === 'create') {
            this.showScreen('create-cards');
        } else {
            if (this.currentDeck.cards.length === 0) {
                alert('This deck has no cards yet! Add some cards first.');
                return;
            }
            this.showScreen('study');
        }
    }
    
    showAddDeckModal() {
        document.getElementById('deck-name-input').value = '';
        this.selectedColor = '#FF9800';
        document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
        document.querySelector('[data-color="#FF9800"]').classList.add('selected');
        this.showModal('add-deck-modal');
        document.getElementById('deck-name-input').focus();
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
        
        this.data.decks.push(newDeck);
        this.saveData();
        this.hideModal('add-deck-modal');
        this.updateDeckList();
    }
    
    renameDeck() {
        const deck = this.data.decks.find(d => d.id === this.selectedDeckId);
        if (!deck) return;
        
        const newName = prompt('Enter new deck name:', deck.name);
        if (newName && newName.trim()) {
            deck.name = newName.trim();
            this.saveData();
            this.updateDeckList();
        }
        
        this.hideModal('deck-options-modal');
    }
    
    deleteDeck() {
        const deck = this.data.decks.find(d => d.id === this.selectedDeckId);
        if (!deck) return;
        
        if (confirm(`Are you sure you want to delete "${deck.name}"? This cannot be undone.`)) {
            this.data.decks = this.data.decks.filter(d => d.id !== this.selectedDeckId);
            this.saveData();
            this.updateDeckList();
        }
        
        this.hideModal('deck-options-modal');
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
        
        if (this.data.settings.shuffle) {
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
        this.showDeckList('study');
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Theme Management
    toggleTheme() {
        this.data.settings.darkMode = !this.data.settings.darkMode;
        this.saveData();
        this.applyTheme();
    }
    
    applyTheme() {
        if (this.data.settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('theme-toggle').textContent = '☀️';
        } else {
            document.body.removeAttribute('data-theme');
            document.getElementById('theme-toggle').textContent = '🌙';
        }
    }
    
    // Import/Export
    exportData() {
        try {
            const dataStr = JSON.stringify(this.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `flashcards-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('Your flashcards have been exported! The file was downloaded.');
        } catch (e) {
            console.error('Export error:', e);
            alert('Error exporting data. Please try again.');
        }
    }
    
    importData() {
        document.getElementById('file-input').click();
    }
    
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!importedData.decks || !Array.isArray(importedData.decks)) {
                    throw new Error('Invalid file format');
                }
                
                if (confirm('This will replace all your current flashcards. Are you sure?')) {
                    this.data = importedData;
                    
                    // Ensure settings exist
                    if (!this.data.settings) {
                        this.data.settings = { darkMode: false, shuffle: true };
                    }
                    
                    this.saveData();
                    this.applyTheme();
                    
                    if (this.currentScreen === 'deck-list') {
                        this.updateDeckList();
                    }
                    
                    alert('Your flashcards have been imported successfully!');
                }
            } catch (e) {
                console.error('Import error:', e);
                alert('Error importing file. Please make sure it\'s a valid flashcard backup file.');
            }
            
            // Clear the file input
            event.target.value = '';
        };
        
        reader.readAsText(file);
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