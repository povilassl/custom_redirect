let redirect_rules = {};

fetch(chrome.runtime.getURL("settings.json"))
  .then((response) => response.json())
  .then((data) => {
    redirect_rules = data;

    let {
      redirect_from,
      wiki_redirect_to,
      facebook_redirect_from,
      facebook_redirect_to,
      freedium_redirect_from,
      freedium_redirect_to,
    } = redirect_rules;

    chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
      let current_url = details.url.toLowerCase();

      // fb redirect to messages
      if (url_equal(facebook_redirect_from, current_url)) {
        redirect(details, facebook_redirect_to);
      }

      // medium and towards data science redirect to freedium
      if (
        freedium_redirect_from.some(
          (url) => current_url.startsWith(url) && current_url != url
        )
      ) {
        let freedium_url = freedium_redirect_to + "/" + details.url;
        redirect(details, freedium_url);
      }

      // others redirect to wiki
      if (redirect_from.some((url) => url_equal(current_url, url))) {
        redirect(details, wiki_redirect_to);
      }
    });
  })
  .catch((error) => console.error("Error fetching redirect rules:", error));

function url_equal(src, trg) {
  let src_trimmed = src.replace(/\/$/, "");
  let trg_trimmed = trg.replace(/\/$/, "");

  return src_trimmed === trg_trimmed;
}

function redirect(details, new_url) {
  chrome.tabs.update(details.tabId, { url: new_url });
}
