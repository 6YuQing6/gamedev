const contactButton = document.getElementById("contact-button");
const contactStatus = document.getElementById("contact-status");
const contactFallback = document.getElementById("contact-fallback");
const contactEmail = document.getElementById("contact-email");
let contactResetTimer;
let copyingEmail = false;

contactEmail.value = contactButton.dataset.email;
contactButton.setAttribute("title", `${contactButton.dataset.email} — Click to copy`);

function resetContactButton() {
  delete contactButton.dataset.copied;
  contactButton.setAttribute("aria-label", "Contact Me: copy email address");
  contactStatus.textContent = "";
}

contactButton.addEventListener("click", async () => {
  if (copyingEmail) return;
  copyingEmail = true;
  clearTimeout(contactResetTimer);
  resetContactButton();
  contactFallback.hidden = true;
  contactButton.setAttribute("aria-busy", "true");

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard access is unavailable");
    }
    await navigator.clipboard.writeText(contactButton.dataset.email);
    contactButton.dataset.copied = "true";
    contactButton.setAttribute("aria-label", "Email copied");
    contactStatus.textContent = "Email address copied to clipboard.";
    contactResetTimer = setTimeout(resetContactButton, 2000);
  } catch {
    contactFallback.hidden = false;
    contactStatus.textContent =
      "Couldn’t copy automatically. Select and copy the email address below.";
    contactEmail.focus();
    contactEmail.select();
  } finally {
    copyingEmail = false;
    contactButton.removeAttribute("aria-busy");
  }
});

contactEmail.addEventListener("focus", () => contactEmail.select());

const projectTabs = Array.from(document.querySelectorAll(".tabs [role='tab']"));

function activateProjectTab(selectedTab) {
  for (const tab of projectTabs) {
    const isSelected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden =
      !isSelected;
  }
}

for (const tab of projectTabs) {
  tab.addEventListener("click", () => activateProjectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const index = projectTabs.indexOf(tab);
    let nextIndex;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % projectTabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + projectTabs.length) % projectTabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = projectTabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    activateProjectTab(projectTabs[nextIndex]);
    projectTabs[nextIndex].focus();
  });
}

const statLinks = document.querySelectorAll(".profile-stats a");

for (const link of statLinks) {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const panelId = link.getAttribute("href").slice(1); // "panel-games"
    const tab = projectTabs.find(
      (t) => t.getAttribute("aria-controls") === panelId,
    );
    if (!tab) return;

    activateProjectTab(tab);
    document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
  });
}

function openTabFromHash() {
  const panelId = location.hash.slice(1);
  const tab = projectTabs.find(
    (t) => t.getAttribute("aria-controls") === panelId,
  );
  if (tab) activateProjectTab(tab);
}

openTabFromHash();
window.addEventListener("hashchange", openTabFromHash);

for (const gallery of document.querySelectorAll(".website-media-gallery")) {
  const track = gallery.querySelector(".website-media-image-wrapper");
  const previous = gallery.querySelector('[data-direction="previous"]');
  const next = gallery.querySelector('[data-direction="next"]');

  function updateGalleryButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    previous.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= maxScroll - 1;
  }

  function moveScreenshot(direction) {
    const positions = Array.from(track.children, (image) => image.offsetLeft - track.firstElementChild.offsetLeft);
    const target = direction > 0
      ? positions.find((position) => position > track.scrollLeft + 2)
      : positions.reverse().find((position) => position < track.scrollLeft - 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: target ?? (direction > 0 ? track.scrollWidth : 0),
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  previous.addEventListener("click", () => moveScreenshot(-1));
  next.addEventListener("click", () => moveScreenshot(1));
  track.addEventListener("scroll", updateGalleryButtons, { passive: true });
  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveScreenshot(event.key === "ArrowRight" ? 1 : -1);
  });
  for (const image of track.querySelectorAll("img")) {
    image.addEventListener("load", updateGalleryButtons);
  }
  new ResizeObserver(updateGalleryButtons).observe(track);
  updateGalleryButtons();
}
