function toggleSidebar() {
    let htmlSidebar = document.querySelector("#sidebar");
    if (htmlSidebar?.getAttribute("data-visible") != null) {
        htmlSidebar?.removeAttribute("data-visible")
    } else {
        htmlSidebar?.setAttribute("data-visible", "");
    }
}

function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

const COUNT_ANIMATION_DURATION = 2000;
const COUNT_ANIMATION_STAGGER = 500;
let formatLong = new Intl.NumberFormat("en-IN");
let formatShort = new Intl.NumberFormat("en-US", {
    notation: "compact", 
    compactDisplay: "short"
});
fetch("/data/stats.json").then(res => {
    res.json().then(stats => {
        let allStats = document.querySelectorAll(".stats");
        
        let animationStart = Date.now();
        let animationEnd = animationStart + COUNT_ANIMATION_DURATION + COUNT_ANIMATION_STAGGER * allStats.length
        let interval: NodeJS.Timeout
        interval = setInterval(() => {
            let currentTime = Date.now();
            if (currentTime > animationEnd) clearInterval(interval);
            
            allStats.forEach((element, index) => {
                let statName = element.getAttribute("data-stat");
                if (!statName) return;
                let progress = easeOutExpo(Math.min((currentTime - animationStart) / (COUNT_ANIMATION_DURATION + COUNT_ANIMATION_STAGGER * index), 1));
                let statValue: number = progress == 1 ? stats[statName] : Math.round(stats[statName] * progress);

                let htmlStatDisplayElement = element.querySelector(".stat");
                if (!htmlStatDisplayElement) return;
                let formattedStatValue = statValue > 9999 ? formatShort.format(statValue) : formatLong.format(statValue);
                
                if (element.getAttribute("data-stat-format")) {
                    formattedStatValue = element.getAttribute("data-stat-format")?.replaceAll("{v}", formattedStatValue) || ""
                }

                htmlStatDisplayElement.innerHTML = formattedStatValue;
            })
        }, 20);
    })
})