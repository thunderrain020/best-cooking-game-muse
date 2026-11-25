// Ember & Tide — data/recipes.js
// The pantry: 8 shared raw ingredients combine into 12 original harbour dishes.
// Every ingredient names the station that prepares it; every dish names the
// components a plate needs, in the order the ledger teaches them.

export const INGREDIENTS = {
  prawn: { id: 'prawn', name: 'Prawn', key: '1', station: 'wok', color: '#ff8a5c', dark: '#c94f2a', emoji: '🍤' },
  fish: { id: 'fish', name: 'Fish Fillet', key: '2', station: 'wok', color: '#9fd8e8', dark: '#3f7d92', emoji: '🐟' },
  rice: { id: 'rice', name: 'Rice', key: '3', station: 'pot', color: '#f5ecd7', dark: '#b8a67c', emoji: '🍚' },
  noodle: { id: 'noodle', name: 'Noodles', key: '4', station: 'pot', color: '#f2c14e', dark: '#a97c1e', emoji: '🍜' },
  egg: { id: 'egg', name: 'Egg', key: '5', station: 'wok', color: '#ffd94d', dark: '#c98f1b', emoji: '🥚' },
  chilli: { id: 'chilli', name: 'Chilli', key: '6', station: 'board', color: '#e8442e', dark: '#8f1d10', emoji: '🌶️' },
  lime: { id: 'lime', name: 'Lime', key: '7', station: 'board', color: '#a8d94a', dark: '#5d8a1e', emoji: '🍋' },
  herbs: { id: 'herbs', name: 'Herbs', key: '8', station: 'board', color: '#4caf6d', dark: '#22663a', emoji: '🌿' },
};

export const INGREDIENT_ORDER = ['prawn', 'fish', 'rice', 'noodle', 'egg', 'chilli', 'lime', 'herbs'];

// A component is one prepared ingredient on the plate. `station` is where the
// raw ingredient is prepared; `fresh` components skip cooking and go straight
// from the board to the plate once chopped.
export const DISHES = [
  { id: 'prawn-rice', name: 'Harbour Prawn Rice', price: 14, comps: ['rice', 'prawn', 'lime'], blurb: 'Simmered rice, sizzled prawn, lime over the top.' },
  { id: 'fish-noodles', name: 'Sunset Fish Noodles', price: 15, comps: ['noodle', 'fish', 'chilli'], blurb: 'Silky noodles, crisp fish, a chilli kick.' },
  { id: 'ember-prawns', name: 'Ember Chilli Prawns', price: 16, comps: ['prawn', 'chilli', 'herbs'], blurb: 'Prawns kissed by the wok, chilli and fresh herbs.' },
  { id: 'egg-rice', name: 'Golden Egg Fried Rice', price: 12, comps: ['rice', 'egg', 'herbs'], blurb: 'Golden egg folded through harbour rice.' },
  { id: 'citrus-fish', name: 'Citrus Fish Plate', price: 13, comps: ['fish', 'lime', 'herbs'], blurb: 'Pan-seared fish, lime, a herb shower.' },
  { id: 'spicy-noodles', name: 'Spicy Noodle Bowl', price: 13, comps: ['noodle', 'chilli', 'egg'], blurb: 'Noodles with chilli heat and a soft egg.' },
  { id: 'prawn-egg-noodles', name: 'Prawn & Egg Noodles', price: 16, comps: ['noodle', 'prawn', 'egg'], blurb: 'Prawn and egg tangled in warm noodles.' },
  { id: 'fish-rice', name: 'Harbour Fish Rice', price: 14, comps: ['rice', 'fish', 'lime'], blurb: 'Flaky fish over steamed rice, lime bright.' },
  { id: 'chilli-lime-noodles', name: 'Chilli Lime Prawn Noodles', price: 19, vip: true, comps: ['noodle', 'prawn', 'chilli', 'lime'], blurb: 'The house signature: four-way harbour heat.' },
  { id: 'omelette', name: 'Golden Harbour Omelette', price: 13, comps: ['egg', 'herbs', 'chilli'], blurb: 'A puffed omelette, herbs and chilli inside.' },
  { id: 'sunset-bowl', name: 'Sunset Rice Bowl', price: 12, comps: ['rice', 'egg', 'chilli'], blurb: 'Rice, egg and chilli under the evening light.' },
  { id: 'tide-special', name: 'Tide & Ember Special', price: 22, vip: true, comps: ['fish', 'prawn', 'lime', 'herbs'], blurb: 'Fish and prawn, lime and herbs: the whole tide.' },
];

export function dishById(id) {
  return DISHES.find((d) => d.id === id);
}
