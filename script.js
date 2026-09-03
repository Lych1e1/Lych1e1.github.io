const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const preferredTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (preferredTheme === "dark" || (!preferredTheme && systemPrefersDark)) {
  root.dataset.theme = "dark";
}

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateThemeButton() {
  const isDark = root.dataset.theme === "dark";
  themeToggle.innerHTML = `<i data-lucide="${isDark ? "sun" : "moon"}" aria-hidden="true"></i>`;
  themeToggle.setAttribute("aria-label", isDark ? "切换到浅色主题" : "切换到深色主题");
  themeToggle.setAttribute("title", isDark ? "切换到浅色主题" : "切换到深色主题");
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#141512" : "#f4f3ef";
  renderIcons();
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateThemeButton();
});

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dateValue));
}

function formatProjectDate(dateValue) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
  }).format(new Date(dateValue));
}

async function loadRepositories() {
  const status = document.querySelector("#repo-status");
  const activityList = document.querySelector("#activity-list");

  try {
    const response = await fetch(
      "https://api.github.com/users/Lych1e1/repos?sort=updated&per_page=100",
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const repositories = await response.json();
    const repositoryMap = new Map(repositories.map((repo) => [repo.name, repo]));

    document.querySelectorAll("[data-repo]").forEach((project) => {
      const repo = repositoryMap.get(project.dataset.repo);
      const updated = project.querySelector('[data-field="updated"]');

      if (repo && updated) {
        updated.textContent = `更新于 ${formatProjectDate(repo.updated_at)}`;
      }
    });

    const recent = repositories
      .filter((repo) => !repo.archived)
      .sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at))
      .slice(0, 5);

    activityList.innerHTML = recent
      .map(
        (repo) => `
          <li class="activity-item">
            <time class="activity-date" datetime="${repo.updated_at}">${formatDate(repo.updated_at)}</time>
            <span class="activity-mark" aria-hidden="true"></span>
            <a href="${repo.html_url}" target="_blank" rel="noreferrer">
              <span>${repo.name}</span>
              <i data-lucide="arrow-up-right" aria-hidden="true"></i>
            </a>
            <span class="activity-tag">${repo.language || "repository"}</span>
          </li>
        `,
      )
      .join("");

    status.textContent = `${recent.length} 个最近更新`;
    renderIcons();
  } catch (error) {
    activityList.innerHTML = `
      <li class="activity-item">
        <span class="activity-date">OFFLINE</span>
        <span class="activity-mark" aria-hidden="true"></span>
        <a href="https://github.com/Lych1e1?tab=repositories" target="_blank" rel="noreferrer">
          <span>前往 GitHub 查看公开仓库</span>
          <i data-lucide="arrow-up-right" aria-hidden="true"></i>
        </a>
        <span class="activity-tag">GitHub</span>
      </li>
    `;
    status.textContent = "暂时无法同步";
    renderIcons();
  }
}

document.querySelector("#year").textContent = new Date().getFullYear();

window.addEventListener("DOMContentLoaded", () => {
  updateThemeButton();
  loadRepositories();
});
