import stats from "../data/stats.json"

function trapSidebarFocus(enabled: boolean) {
    let htmlMain = document.querySelector("#main") as HTMLElement;
    htmlMain.inert = enabled;
}

function toggleSidebar() {
    let htmlSidebar = document.querySelector("#sidebar");
    if (htmlSidebar?.getAttribute("data-visible") != null) {
        htmlSidebar?.removeAttribute("data-visible")
        trapSidebarFocus(false);
    } else {
        htmlSidebar?.setAttribute("data-visible", "");
        (htmlSidebar?.querySelector("li a") as HTMLElement)?.focus();
        trapSidebarFocus(true);
    }
}

function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function shouldAnimate() {
    return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches != true;
}

const COUNT_ANIMATION_DURATION = 2000;
const COUNT_ANIMATION_STAGGER = 500;
let formatLong = new Intl.NumberFormat("en-IN");
let formatShort = new Intl.NumberFormat("en-US", {
    notation: "compact", 
    compactDisplay: "short"
});

let allStats = document.querySelectorAll(".stats");

function updateStatElements(currentTime: number | undefined = undefined, animationStart: number | undefined = undefined) {
    allStats.forEach((element, index) => {
        let statName = element.getAttribute("data-stat");
        if (!statName) return;
        let progress = currentTime && animationStart ? easeOutExpo(Math.min((currentTime - animationStart) / (COUNT_ANIMATION_DURATION + COUNT_ANIMATION_STAGGER * index), 1)) : 1;
        let statValue: number = progress == 1 ? (stats as Record<string, number>)[statName] : Math.round((stats as Record<string, number>)[statName] * progress);

        let htmlStatDisplayElement = element.querySelector(".stat");
        if (!htmlStatDisplayElement) return;
        let formattedStatValue = statValue > 9999 ? formatShort.format(statValue) : formatLong.format(statValue);
        
        if (element.getAttribute("data-stat-format")) {
            formattedStatValue = element.getAttribute("data-stat-format")?.replaceAll("{v}", formattedStatValue) || ""
        }

        htmlStatDisplayElement.innerHTML = formattedStatValue;
    })
}

if (shouldAnimate()) {
    let animationStart = Date.now();
    let animationEnd = animationStart + COUNT_ANIMATION_DURATION + COUNT_ANIMATION_STAGGER * allStats.length
    let interval: NodeJS.Timeout
    interval = setInterval(() => {
        let currentTime = Date.now();
        if (currentTime > animationEnd) clearInterval(interval);
        
        updateStatElements(currentTime, animationStart)
    }, 20);
} else updateStatElements();