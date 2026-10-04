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
