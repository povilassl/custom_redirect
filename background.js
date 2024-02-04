let redirect_from = [
  "https://www.reddit.com/",
  "https://www.reddit.com/r/memes/",
];

let wiki_redirect_to = "https://en.wikipedia.org/wiki/Special:Random";

let facebook_redirect_from = "https://www.facebook.com/";
let facebook_redirect_to = "https://www.facebook.com/messages/";

let freedium_redirect_from = [
  "https://medium.com/",
  "https://towardsdatascience.com/",
];

let freedium_redirect_to = "https://freedium.cfd/";

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  let current_url = details.url.toLowerCase();

  //fb redirect to messages
  if (facebook_redirect_from === current_url) {
    redirect(details, facebook_redirect_to);
  }

  //medium and towards data science redirect to freedium
  if (
    freedium_redirect_from.some(
      (url) => current_url.startsWith(url) && current_url != url
    )
  ) {
    let freedium_url = freedium_redirect_to + "/" + details.url;
    redirect(details, freedium_url);
  }

  //others redirect to wiki
  if (redirect_from.some((url) => current_url === url)) {
    redirect(details, wiki_redirect_to);
  }
});

function redirect(details, new_url) {
  chrome.tabs.update(details.tabId, { url: new_url });
}
