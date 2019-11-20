# Initial setup

Run `npm install`

# Development / Editing

## Start local web server

`npm run start` (or on Unix: `./serve_localhost.sh`)

## Generate Table of Contents

`npm run toc` (or on Unix: `./generate_toc.js`)


# Presenting

## Extra keybindings

### Key `a`: Go to the agenda

Pressing `a` will navigate to <./#/agenda>. For this to work, the index document must contain a slide with `id="agenda"`.

Example

```Markdown
---
<!-- .slide: id="agenda" -->
## Agenda 
```

### Key `T` and `t`: Toggle solution

Pressing `T` will toggle (show or hide) all elements marked as `class="solution"`. 

Pressing `t` will toggle only the elements on the current slide.

Example:

```Markdown
Important text <!-- .element: class="solution" --->
```

