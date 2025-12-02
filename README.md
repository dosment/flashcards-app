# Math Champion

Multiplication tables practice app for students ages 11-13.

## Usage

Open `index.html` in a web browser. No server required for basic functionality.

For development with ES modules, serve locally:

```bash
python3 -m http.server 8080
# Then open http://localhost:8080
```

## Features

- Adaptive question selection based on mastery
- Per-table accuracy tracking
- Strategy hints for wrong answers
- Visual streak display
- Session break reminders
- Multiple difficulty levels (Beginner, Explorer, Champion)

## Project Structure

```
app.js          - Main application, event binding, game flow
storage.js      - localStorage operations
mastery.js      - Adaptive learning logic
game.js         - Game state and rules
strategies.js   - Multiplication strategy explanations
ui.js           - DOM manipulation and rendering
index.html      - Page structure
style.css       - Styling
```

## Data Storage

Progress is saved to browser localStorage under:
- `mathChampion` - Game history
- `mathChampionMastery` - Per-fact mastery data
