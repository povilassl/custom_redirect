let redirect_rules = {};

fetch(chrome.runtime.getURL("settings.json"))
  .then((response) => response.json())
  .then((data) => {
    redirect_rules = data;

    let { full_redirect, partial_redirect } = redirect_rules;

    chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
      let current_url = new URL(details.url.toLowerCase());
      let hostname = current_url.hostname;

      let normalized_hostname =
        hostname && !hostname.startsWith("www.") ? `www.${hostname}` : hostname;

      let full_redirect_to = full_redirect[normalized_hostname];
      if (full_redirect_to && current_url != full_redirect_to) {
        redirect(details, full_redirect_to);
        return;
      }

      let partial_redirect_to = partial_redirect[normalized_hostname];

      if (!partial_redirect_to) {
        return;
      }

      partial_redirect_to += current_url.pathname + current_url.search;

      if (partial_redirect_to && current_url != partial_redirect_to) {
        redirect(details, partial_redirect_to);
      }
    });
  })
  .catch((error) => console.error("Error fetching redirect rules:", error));

function redirect(details, new_url) {
  chrome.tabs.update(details.tabId, { url: new_url });
}
