import Page from './lib/Page.js';

window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();

    console.log("Unhandled promise rejection");
    console.log(event.reason);
});

window.addEventListener("load", () => {
    const page = window.PAGE = new Page();
    page.create();
});
