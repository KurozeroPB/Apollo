let left = document.getElementsByClassName("left-container")[0];
let info = left.children[0];
let tags = left.nextElementSibling;
let tagsTitle = document.getElementsByClassName("bot-tags-title")[0];
let old = document.getElementsByClassName("columns")[1];
let stats = document.getElementById("bot-stats");

tagsTitle.innerText = "Tags:";

stats.style.display = "block";
stats.innerHTML = `${info.innerHTML}<br/>${tags.innerHTML}`;

old.innerHTML = "";
old.style.display = "none";
