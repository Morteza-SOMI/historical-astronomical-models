# Historical Astronomical Models

Interactive web visualizations of historical astronomical models created with **JavaScript and HTML5 Canvas** and deployed on the website of the **Institute for the History of Science, University of Tehran**.

The project explores how historical astronomical systems can be represented through lightweight, animated, web-based visualizations.

## Models

The current version includes simplified visual representations of four historical astronomical models:

* **Eudoxus** — Homocentric spheres
* **Ptolemy** — Eccentric, epicycle, and equant
* **Ṭūsī couple** — Maragha astronomical tradition
* **Ibn al-Shāṭir** — Double epicycle

Each model is rendered dynamically in the browser using the HTML5 Canvas API.

## Institutional Website

The visualizations have been implemented and published on the website of the **Institute for the History of Science, University of Tehran**:

**https://utihs.ut.ac.ir/**

The visualizations are currently placed at the top of the relevant web page as an interactive introduction to historical astronomical models.

In addition to this project, I have contributed to the **design, redesign, content presentation, and development of internal pages and interface components** across different sections of the institute's website.

## Technical Approach

The project is implemented using standard web technologies without a JavaScript framework or external visualization library.

### Technologies

* HTML5
* CSS3
* JavaScript
* HTML5 Canvas API
* Responsive Web Design

### Implementation

The visualization uses several browser APIs and techniques, including:

* `requestAnimationFrame` for animation
* `IntersectionObserver` to control animation based on viewport visibility
* `ResizeObserver` for responsive rendering
* Page Visibility API to pause animation when the browser tab is hidden
* Device Pixel Ratio handling for sharper Canvas rendering
* `prefers-reduced-motion` support
* Responsive layouts for different screen sizes

The code is organized into separate HTML, CSS, and JavaScript files, with each astronomical model implemented as an independent visualization function.

## Historical Context

The project is connected to an ongoing interest in the **history of astronomy and the digital presentation of historical scientific knowledge**.

The visualizations are intended to communicate the basic geometrical relationships and motions associated with historical astronomical models in an accessible web environment.

They are **simplified and interpretive visualizations**, rather than complete historical or numerical reconstructions of the original astronomical systems. They should therefore be used as educational and illustrative representations rather than substitutes for the study of historical astronomical texts, mathematical parameters, or manuscripts.

## Digital Humanities

This project sits at the intersection of:

* History of Science
* History of Astronomy
* Digital Humanities
* Web-based Visualization
* Computational Representation of Historical Knowledge

It demonstrates how web technologies can be used to create new ways of presenting and communicating historical scientific knowledge.

## AI-Assisted Development

Generative AI was used as an **AI-assisted programming and prototyping tool** during the development of the project.

The historical subject matter, conceptual direction, visual requirements, website implementation, testing, and final review were guided by the author.

The project therefore also represents an example of **AI-assisted development in Digital Humanities and History of Science**.

## Project Structure

```text
historical-astronomical-models/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── astronomical-models.js
│
└── README.md
```

## Future Development

Possible future developments include:

* Adding further historical astronomical models
* Adding interactive controls for model parameters
* Connecting visualizations to historical sources and manuscripts
* Adding explanatory annotations to the geometrical elements
* Developing more historically precise computational reconstructions
* Expanding multilingual support
* Linking visualizations to Digital Humanities research projects
* Exploring AI-assisted analysis and visualization of historical scientific diagrams

## Author

**Morteza Somi**

Historian of Science | History of Astronomy | Knowledge Transcultural History
