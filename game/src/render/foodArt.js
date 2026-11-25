// Ember & Tide — render/foodArt.js
// Dispatch for the ingredient art, split across foodIngredients*.js so
// no single file tops 6 KB. Callers import drawIngredientIcon from here
// unchanged; composed dishes live in foodDishes.js.

import { drawPrawn, drawFish } from './foodIngredients.js';
import { drawRice, drawNoodle, drawEgg } from './foodIngredientsB.js';
import { drawChilli, drawLime, drawHerbs } from './foodIngredientsC.js';
import { drawScallop, drawTofu } from './foodIngredientsD.js';

const DRAW = {
  prawn: drawPrawn,
  fish: drawFish,
  rice: drawRice,
  noodle: drawNoodle,
  egg: drawEgg,
  chilli: drawChilli,
  lime: drawLime,
  herbs: drawHerbs,
  scallop: drawScallop,
  tofu: drawTofu,
};

export function drawIngredientIcon(ctx, id, cx, cy, r) {
  const fn = DRAW[id];
  if (!fn) return;
  ctx.save();
  ctx.translate(cx, cy);
  fn(ctx, r);
  ctx.restore();
}
