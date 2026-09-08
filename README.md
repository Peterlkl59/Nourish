# Step by Step! with Saucisse — V4 Draft

This draft consolidates the latest agreed changes.

- Home greeting is **Hello!** in both English and French.
- Tagline: **Step by step, for a healthier you.**
- Add Food opens on **Custom**, with Favourites and Essentials available as tabs.
- Daily charts: weekday above value, then bar, then `DD/MM`.
- Monthly charts: `MMM YY`; calorie/protein bars are average per logged day.
- Monthly calorie/protein charts include a small explanatory info note.
- Weight/waist charts only show dates on which a measurement exists.
- Badge cards are tappable.
- Locked badge modal shows name, unlock requirement and progress.
- Unlocked badge modal congratulates the user and stores an unlock date.
- Badge unlocks are permanent once earned.
- New badge unlocks trigger an in-app celebration.
- 20-badge system retained.
- Existing V2/V3 local data remains on the `nourish-v2` storage key.

Note: Essentials remain a provisional starter list until the curated CoFID values are integrated.

## V4.1 fixes
- Fixed badge tapping on mobile using delegated click/tap handling.
- Locked and unlocked badges now reliably open their detail modal.
- Removed fake `N/A` bars for weight and waist when no measurements exist.
- Added Saucisse measurement empty states instead.
- Increased spacing between chart columns and bottom date labels.

## V4.2 food system
- Essentials now state whether values are per 100g, per 100ml, or per item.
- Built-in starter values are CoFID-backed reference values.
- Essentials open an amount picker before adding.
- Gram/ml foods calculate kcal and protein proportionally to the entered amount.
- Unit foods such as eggs calculate by item quantity.
- Favourites also support amount/quantity before adding.
- Tapping a logged food now opens a full Edit Food sheet.
- Edit Food supports food name, meal, amount, calories, protein, save, and delete.
- Changing the amount recalculates calories/protein proportionally.
- Custom foods remain manual and can be saved as favourites.

Reference values are intended for generic foods; use packaging for branded/prepared foods when available.

## V4.3 badge interaction fix
- Badge taps now use document-level event delegation, which is more reliable on iOS/PWA.
- Badge child elements no longer intercept taps.
- Badge detail modal z-index increased to ensure it appears above navigation/sheets.

## V4.4 chart polish
- Increased the gap between the bottom of every chart bar and its date label.
- Added a subtle chart baseline so labels sit visually below the plotting area.
- Applied the same spacing treatment across calorie, protein, weight and waist charts.
- Keeps the V4.3 badge tap fix.

## V4.5
- Replaced the previous badge modal/tap system with a new standalone popup created directly on tap.
- Each badge button now binds its own click action after rendering.
- Locked badges show unlock requirement and progress.
- Unlocked badges show congratulations and unlock date.
- New badge celebrations use the same robust popup.
- Increased the visual gap below bars to 28px before the date label.
- Moved the chart baseline above the date-label area.

## V4.6
- Removed badge popups entirely.
- Every badge now shows its name, a short description, and either `✓ Unlocked` or live progress.
- Locked badges remain greyed out.
- Chart baseline only appears when the chart contains at least one actual data point.
- When present, the baseline sits below the columns and dates are clearly below the line.
- Empty/N/A-only charts do not show a baseline.
