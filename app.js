// State
const state = {
    wardrobe: [],
    preferences: {
        weather: 'sunny',
        occasion: 'casual'
    }
};

// DOM Elements
const elements = {
    itemType: document.getElementById('itemType'),
    itemStyle: document.getElementById('itemStyle'),
    itemColor: document.getElementById('itemColor'),
    addItemBtn: document.getElementById('addItemBtn'),
    wardrobeList: document.getElementById('wardrobeList'),
    weatherSelect: document.getElementById('weatherSelect'),
    occasionSelect: document.getElementById('occasionSelect'),
    generateBtn: document.getElementById('generateBtn'),
    outfitDisplay: document.getElementById('outfitDisplay')
};

// Event Listeners
elements.addItemBtn.addEventListener('click', addItem);
elements.wardrobeList.addEventListener('click', deleteItem);
elements.generateBtn.addEventListener('click', generateOutfit);

// Functions
function addItem() {
    const type = elements.itemType.value;
    const style = elements.itemStyle.value;
    const color = elements.itemColor.value.trim();

    if (!type || !style || !color) {
        alert('Please fill in all fields to add an item.');
        return;
    }

    const newItem = {
        id: Date.now(),
        type,
        style,
        color
    };

    state.wardrobe.push(newItem);
    renderWardrobe();
    
    // Reset form
    elements.itemType.value = '';
    elements.itemStyle.value = '';
    elements.itemColor.value = '';
}

function deleteItem(e) {
    if (e.target.closest('.delete-btn')) {
        const id = Number(e.target.closest('.delete-btn').dataset.id);
        state.wardrobe = state.wardrobe.filter(item => item.id !== id);
        renderWardrobe();
    }
}

function renderWardrobe() {
    const list = elements.wardrobeList;
    list.innerHTML = '';

    if (state.wardrobe.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <p>Your wardrobe is empty. Add some items to get started!</p>
            </div>
        `;
        return;
    }

    state.wardrobe.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'wardrobe-item';
        itemEl.innerHTML = `
            <div class="info">
                <strong>${item.color} ${item.type}</strong>
                <span>${item.style}</span>
            </div>
            <button class="delete-btn" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        list.appendChild(itemEl);
    });
}

function generateOutfit() {
    const weather = elements.weatherSelect.value;
    const occasion = elements.occasionSelect.value;

    if (state.wardrobe.length === 0) {
        alert('Please add items to your wardrobe first!');
        return;
    }

    // Simple Suggestion Logic
    const suggestion = filterItems(weather, occasion);
    renderSuggestion(suggestion);
}

function filterItems(weather, occasion) {
    const items = state.wardrobe;
    
    // Basic Rules Engine
    let relevantItems = items.filter(item => {
        // Occasion Logic
        if (occasion === 'gym' && item.style !== 'sport') return false;
        if (occasion === 'date' && item.style === 'sport') return false;
        if (occasion === 'work' && (item.style === 'sport' || item.style === 'party')) return false;

        // Weather Logic (Simplified)
        if (weather === 'hot' && item.type === 'outerwear') return false;
        if (weather === 'cold' && item.type === 'shorts') return false; // Assuming shorts logic if we had it, but generic for now
        
        return true;
    });

    // Try to build a full outfit: Top + Bottom + Shoes
    const tops = relevantItems.filter(i => i.type === 'top');
    const bottoms = relevantItems.filter(i => i.type === 'bottom');
    const shoes = relevantItems.filter(i => i.type === 'shoes');
    const outerwear = relevantItems.filter(i => i.type === 'outerwear');

    // Fallback: if no specific match, just grab random from visible wardrobe to not show empty
    // But better to show "No match" if strict. For this demo, let's be lenient or random if empty.
    
    const selectedTop = tops.length > 0 ? getRandom(tops) : null;
    const selectedBottom = bottoms.length > 0 ? getRandom(bottoms) : null;
    const selectedShoes = shoes.length > 0 ? getRandom(shoes) : null;
    const selectedOuterwear = (weather === 'cold' || weather === 'rainy') && outerwear.length > 0 ? getRandom(outerwear) : null;

    return {
        top: selectedTop,
        bottom: selectedBottom,
        shoes: selectedShoes,
        outerwear: selectedOuterwear
    };
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function renderSuggestion(outfit) {
    const display = elements.outfitDisplay;
    display.innerHTML = '';

    const hasAnyItem = outfit.top || outfit.bottom || outfit.shoes;

    if (!hasAnyItem) {
        display.innerHTML = `
            <div class="placeholder-suggestion">
                <i class="fa-regular fa-face-frown"></i>
                <p>No suitable outfit found in your wardrobe for this occasion. Time to go shopping?</p>
            </div>
        `;
        return;
    }

    // Render cards
    if (outfit.outerwear) createCard(outfit.outerwear, 'fa-vest');
    if (outfit.top) createCard(outfit.top, 'fa-shirt');
    if (outfit.bottom) createCard(outfit.bottom, 'fa-user-astronaut'); // or pants icon
    if (outfit.shoes) createCard(outfit.shoes, 'fa-shoe-prints');
}

function createCard(item, iconClass) {
    const card = document.createElement('div');
    card.className = 'suggestion-card';
    card.innerHTML = `
        <div class="icon-box">
            <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="details">
            <h4>${item.color} ${item.type}</h4>
            <p>${item.style}</p>
        </div>
    `;
    elements.outfitDisplay.appendChild(card);
}

// Initial Render
renderWardrobe();
