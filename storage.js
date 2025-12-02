// Storage module - handles all localStorage operations

const STORAGE_KEYS = {
    USERS: 'mathChampion',
    MASTERY: 'mathChampionMastery'
};

function loadUsers() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {
        // Silent fail for storage issues
    }
}

function loadUserHistory(name) {
    const users = loadUsers();
    return users[name] || [];
}

function saveUserHistory(name, history) {
    const users = loadUsers();
    users[name] = history;
    saveUsers(users);
}

function loadMastery(name) {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.MASTERY);
        const all = data ? JSON.parse(data) : {};
        return all[name] || {};
    } catch {
        return {};
    }
}

function saveMastery(name, mastery) {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.MASTERY);
        const all = data ? JSON.parse(data) : {};
        all[name] = mastery;
        localStorage.setItem(STORAGE_KEYS.MASTERY, JSON.stringify(all));
    } catch {
        // Silent fail for storage issues
    }
}

export {
    STORAGE_KEYS,
    loadUsers,
    saveUsers,
    loadUserHistory,
    saveUserHistory,
    loadMastery,
    saveMastery
};
