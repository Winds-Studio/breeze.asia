/**
 * @author: Iris Shaders
 * 
 */

let fileindex = ["index.html"];
let trans = [
  "en",
  "zh_CN",
  "zh_TC",
];
let transNames = [
  "English",
  "简体中文",
  "繁體中文",
];
let fallbacklang;
let lang;
let currentpage;

document.addEventListener("DOMContentLoaded", initLangSelect);

//Loading the lang
let langData;
function setLang(name, page) {
  localStorage.setItem("lang", name);
  initLang(page);
}

function setSelectLang(page) {
  let select = document.getElementById("langselect");
  setLang(select.value, page);
}

function initLangSelect() {
  let select = document.getElementById("langselect");
  select.innerHTML = "";
  transNames.forEach(addOption);
  select.value = lang;
}

function addOption(item, index) {
  let select = document.getElementById("langselect");
  let option = document.createElement("option");
  option.value = trans[index];
  option.innerHTML = item;
  select.appendChild(option);
}

function initLang(page) {
  if (!localStorage.getItem("lang")) {
    localStorage.setItem("lang", navigator.language.replace("-", "_"));
  }
  lang = localStorage.getItem("lang");
  if (!trans.includes(lang)) {
    lang = lang.split("_")[0];
    if (!trans.includes(lang)) {
      lang = "en";
    }
  }

  fetch("./locales/zh_CN.json")
    .then((response) => response.json())
    .then((datafall) => {
      fallbacklang = datafall;
      fetch("./locales/" + lang + ".json")
        .then((response) => response.json())
        .then((data) => {
          langData = data;
          let realfallbacklang = {
            ...fallbacklang.data[page],
            ...fallbacklang.common,
          };
          let reallangdata = { ...langData.data[page], ...langData.common };
          for (let [key, value] of Object.entries(realfallbacklang)) {
            if (key in reallangdata) {
              value = reallangdata[key];
            }
            let el = document.querySelector(`[langfield="${key}"]`);
            if (el) {
              document
                .querySelectorAll(`[langfield="${key}"]`)
                .forEach((element) => (element.innerHTML = value));
            }
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}
