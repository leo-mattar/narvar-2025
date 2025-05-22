document.addEventListener("DOMContentLoaded", function () {
  // --- FILTER GOALS BY CUSTOM DATE
  function goalsOrderDate() {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmscombine",
      listInstances => {
        document.querySelector(".fs_cmssort_button").click();
      },
    ]);
  }

  goalsOrderDate();
});