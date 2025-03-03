# Color Swatches

## Installation

Requires: node@20.10.0; you can delete `.node-version` to try another version.

Clone the repository and install dependencies:

```sh
git clone git@github.com:RyanMulready/color-swatches.git
cd color-swatches
npm install
```

## Running the Development Server

Start the Nuxt development server:

```sh
npm run dev -- --open
```

## Design Decisions

For this prototype I used Nuxt@3, a Vue@3 framework and PrimeVue for the UI components. This is my go to
[typescript template](https://github.com/RyanMulready/nuxt-boilerplate) for building prototypes as it allows me to
quickly scaffold a project.

The prototype is split into three main layers:

- Components → View (Handles UI and user interactions)
- Services → Model (Handles data fetching)
- Composables → ViewModel (Manages state and logic)

The API intereaction was the most unique part of this project. I am looping over all possible hues and making
361 requests to the API to get named color swatches using the `id` endpoint. Given the API, tiem limit, and requirements it didn't
seem possible to reduce the number of requests needed. Instead I focused on making the first request on the server and
caching all subsequent requests in the client.

If we were to theorize that the named color won't repeat out of order, I could have used a step approach to reduce the number of requests.

For example we could step over the hues by 50:

- First request: `hsl=0,100,50`
    - Find the first named color
- Next request: `hsl=50,100,50`
    - If we find a different named color
        - Step backwards until we find the previous named color; `hsl=49,100,50`
        - Step forwards until we find the next named color; `hsl=51,100,50`
    - If we don't find a different named color continue; `hsl=100,100,50`
- Repeat next request in steps of 50 until we reach 360
