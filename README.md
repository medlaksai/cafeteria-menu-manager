# YouCode Cafeteria Menu Manager

A web application built with HTML, Bootstrap and vanilla JavaScript that lets the YouCode cafeteria manager plan the weekly menu (Monday to Friday) from a recipe Pantry, while respecting category rules and a budget of 50 DH per day.

**Live demo:** https://cafeteria-menu-manager-mu.vercel.app/


## Screenshots
[cooming soon]

## Features
- Recipe Pantry: add, edit, delete through a modal
- Weekly menu with starter, main and dessert slots per day
- Rules: category must match the slot, 50 DH daily cap, no editing of assigned recipes
- Real-time form validation with regex
- Live stats: dishes in Pantry, days ready, day and week cost, balanced-diet badge
- Toast notifications and delete confirmations

## Tech stack
HTML5, TailWind, vanilla JavaScript (ES6), localStorage, Git and GitHub, Vercel

## Project structure

```
weekly-menu-manager/
├── index.html          # Single page: semantic layout, modal, toast area, confirm dialog , tailwind FrameWork For Styling  
├── js/
│   └── app.js          # Initialization and delegated event listeners 
├── docs/               # Task plan, architecture note, test results
└── README.md           # Project presentation and documentation
```

## How it works

### Data model
The app keeps two pieces of data. The **recipes** list holds every dish in the Pantry, and each recipe has a unique id, a name, a category (Starter, Main Course or Dessert), a price and a quality badge (Organic, Vegetarian or Classic). The **menu** holds the five days of the week (Monday to Friday), and each day has three slots (starter, main course, dessert) that contain either nothing or the id of a recipe. A recipe's "assigned" status is not stored anywhere. It is calculated by checking whether its id appears in the menu, so the data cannot get out of sync.

### Render function
The screen is always drawn from the data. After any change (adding, editing, deleting or assigning a recipe), the app updates the data first and then calls a single render function. This function rebuilds the Pantry cards, the day cards with their totals, and the statistics (dishes in the Pantry, days ready, week cost, balanced-diet badge). Assigned recipes are shown as transparent cards with the label "Assigned: Day - Dish". Because every update goes through the same function, the interface and the data always match.

### Event delegation
Instead of attaching a listener to every button and select, the app uses one listener on the main container for each type of event. Each interactive element carries a `data-action` attribute (for example edit, delete, assign) and a `data-id` attribute with the recipe id. When an event reaches the container, the handler uses `event.target.closest()` to find the element involved, reads its attributes, and calls the matching function. This keeps the code short, works for cards created after the page loads, and performs well because only a few listeners exist.

### Flow of a user action
1. The user acts (for example, picks a day in a recipe's select).
2. The delegated listener identifies the action and the recipe.
3. The rules are checked: category match first, then the 50 DH daily budget.
4. If a rule fails, an error toast is shown and nothing changes.
5. If all rules pass, the data is updated and saved to localStorage.
6. The render function redraws the interface, and a confirmation toast appears.

### Persistence
The recipes and the menu are converted to JSON strings and saved in localStorage after every change. When the page loads, they are read back, parsed and rendered, so nothing is lost on refresh.

## Business rules
| Rule | Behavior |
| --- | --- |
| Category match | A recipe can only be assigned to the slot of its own category. A Starter goes only in a starter slot, never in a main course or dessert slot. If the manager tries a mismatch, the assignment is rejected, an error toast explains why, and the select goes back to its previous value. |
| Budget cap | The total of a day (starter + main course + dessert) can never exceed 50 DH. Before each assignment, the app adds the recipe’s price to the day’s current total. If the result is above 50 DH, the assignment is blocked and an error toast shows the overrun. A total of exactly 50 DH is allowed. |
| Edit restriction | A recipe can be edited only while it is in the Pantry. If it is assigned to a day, the Edit action is blocked and a toast tells the manager to select “In reserve” first, edit the recipe in the modal, then assign it again. |

## Run locally
[Clone the repo, open index.html in a browser or use a local server.]


## Author
[Laksai Mohammed ]
