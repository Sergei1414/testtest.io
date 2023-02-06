const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });

  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }

  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
const style = "";

function roundToggle(val, calcId) {
  let roundInput = document.getElementById("round-value");
  roundInput.value = val;
  let curButton = document.getElementById("round-" + val + "-" + calcId);
  let roundButtons = document.querySelectorAll(".r-button-" + calcId);
  roundButtons.forEach(function (roundButton) {
    roundButton.classList.remove("bg-cred");
    roundButton.classList.add("bg-cbuttongray");
  });
  curButton.classList.remove("bg-cbuttongray");
  curButton.classList.add("bg-cred");
}

function setSelectedOption(elem, value) {
  for (let i = 0; i < elem.options.length; i++) {
    elem.options[i].selected = value === elem.options[i].value;
  }
}

function swapBySelectedIndex(selector1, selector2) {
  var elem1 = document.querySelector(selector1),
    elem2 = document.querySelector(selector2),
    selectedOption1 = elem1.selectedIndex;
  elem1.selectedIndex = elem2.selectedIndex;
  elem2.selectedIndex = selectedOption1;
}
document.getElementById("select-switcher-1").addEventListener("click", function () {
  swapBySelectedIndex("#convert-to-1", "#convert-from-1");
});
const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector("meta[name=viewport]");
  if (el !== null) {
    let content = el.getAttribute("content");
    let re = /maximum\-scale=[0-9\.]+/g;
    if (re.test(content)) {
      content = content.replace(re, "maximum-scale=1.0");
    } else {
      content = [content, "maximum-scale=1.0"].join(", ");
    }
    el.setAttribute("content", content);
  }
};
const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;
const checkIsIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (checkIsIOS()) {
  disableIosTextFieldZoom();
}
const formOne = document.getElementById("calc-form-1");
formOne.addEventListener("submit", function (e) {
  e.preventDefault();
  formSubmit(1);

  
  
});





function createCookie(name, value, minutes) {
  if (minutes) {
    var date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1e3);
    var expires = "; expires=" + date.toGMTString();
  } else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
const callAPI = async () => {
  let calc_id = getCookie("calc_id");
  if (calc_id == null || calc_id < 1) {
    roundToggle(4, 1);
    return;
  }
  let product;
  let value = getCookie("value-" + calc_id);
  let responseUnit = getCookie("from-" + calc_id);
  let roundValue = getCookie("round-" + calc_id);
  let unit_txt = getCookie("from-txt-" + calc_id);
  let to = getCookie("to-" + calc_id);
  let to_txt = getCookie("to-txt-" + calc_id);
  try {
    product = document.getElementById("product").value;
  } catch {
    product = "water";
  }
  if (responseUnit === "") {
    return;
  }
  let convertFromSelect = document.querySelector("#convert-from-" + calc_id);
  let convertToSelect = document.querySelector("#convert-to-" + calc_id);
  setSelectedOption(convertFromSelect, responseUnit);
  setSelectedOption(convertToSelect, to);
  let valueInput = document.querySelector("#amount-to-convert-" + calc_id);
  valueInput.value = value;
  roundToggle(roundValue, calc_id);
  document.querySelector("#form-result-" + calc_id).classList.remove("hidden");
  const body = {
    "value": value,
    "unit": responseUnit,
    "product": product
  };
  let config = {
    method: "post",
    url: "https://calculators-api-z5pyyufkoq-uc.a.run.app/api/v1/convert/area/",
    headers: {
      "Content-Type": "application/json"
    },
    data: body
  };

  document.querySelector('#form-result-' + calc_id).classList.remove('hidden');
  document.querySelector('#form-result-preloader-' + calc_id).classList.remove('hidden');
  // document.querySelector('#form-result-' + calc_id).scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'center'
  // });
  document.querySelector("#scroll-hook").scrollIntoView({
    behavior: "smooth"
  })

  axios(config).then((response) => {
    let responseData = response.data['result'];
    //console.log(data['value'])
    console.log(response)
    console.log(typeof responseData[to])
    // console.log(parseFloat(responseData[to].isInteger ? responseData[to] : responseData[to] < 1 ? responseData[to] : responseData[to].toFixed(roundValue)))

    let convertFromText = value + ' ' + unit_txt + ' into ' + to_txt;
    document.getElementById('response-result-' + calc_id).innerHTML = parseFloat(responseData[to].isInteger ? responseData[to] : responseData[to] < 0.00001 ? responseData[to] : responseData[to].toFixed(roundValue))
    // document.getElementById('response-result-' + calc_id).innerHTML = parseFloat(responseData[to]).toFixed(roundValue);
    document.getElementById('response-product-' + calc_id).innerHTML = convertFromText;
    let roundText = document.getElementById('round-text-' + calc_id);
    roundText.innerHTML = roundValue;
    document.querySelector('#form-result-preloader-' + calc_id).classList.add('hidden');
    //reset calc flag	
    createCookie('calc_id', 0, 1);

  }).catch((error) => {
    console.log(error);
    document.getElementById('button-init-' + calc_id).classList.toggle('hidden');
    document.getElementById('button-loading-' + calc_id).classList.toggle('hidden');
  });
}

//function that validates if input has numeric value
function numberValidation(event) {
  let inputValue = document.forms["calculateForm"]["value"].value;
  let regex = /^-?\d+\.?\d*$/;
  console.log(typeof inputValue)
  console.log(inputValue)
  if (!inputValue.match(regex)) {
    event.preventDefault();
    document.forms["calculateForm"]["value"].classList.toggle('tooltip');
    document.getElementById('form-submit-1').classList.remove('disabled')
    return false;
  } else {
    document.getElementById('form-submit-1').classList.add('disabled')
  }
}

// document.getElementById('amount-to-convert-1').oninput = function () {
//   this.value = this.value.substr(0, 7)
// }

function formSubmit(id) {
  let valueInput = document.getElementById("amount-to-convert-" + id);
  const isValid = valueInput.reportValidity();
  valueInput.setAttribute("aria-invalid", !isValid);
  if (isValid) {
    createCookie("calc_id", id, 1);
    createCookie("value-" + id, document.getElementById("amount-to-convert-" + id).value, 1);
    createCookie("from-" + id, document.getElementById("convert-from-" + id).value, 1);
    createCookie("from-txt-" + id, document.getElementById("convert-from-" + id).options[document.getElementById("convert-from-" + id).selectedIndex].text, 1);
    createCookie("to-" + id, document.getElementById("convert-to-" + id).value, 1);
    createCookie("to-txt-" + id, document.getElementById("convert-to-" + id).options[document.getElementById("convert-to-" + id).selectedIndex].text, 1);
    createCookie("round-" + id, document.getElementById("round-value").value, 1);
    document.getElementById("button-init-" + id).classList.toggle("hidden");
    document.getElementById("button-loading-" + id).classList.toggle("hidden");
  }
}
document.addEventListener( 'keyup', event => {
  if( event.code === 'Enter' ) callAPI();
});
callAPI();

