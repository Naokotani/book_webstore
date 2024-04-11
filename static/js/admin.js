const adminForm = document.getElementById("admin-form");

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  handleSubmit(e);
});

async function handleSubmit(e) {
  let selections = [];
  for (let i = 0; i < e.target.length; i++) {
    if (e.target[i].type === e.target[0].type) {
      const obj = {
        id: e.target[i].id,
        value: e.target[i].value,
      };
      selections.push(obj);
    }
  }

  const res = await fetch("http://localhost:3000/admin", {
    method: "POST",
    body: JSON.stringify(selections),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const element = document.getElementById("post-result")

  if (res.status === 200) {
    element.innerHTML = "<p class=\"success\">Availability updated successfully</p>";
  } else {
    element.innerHTML = "<p class=\"danger\">Error updating availability</p>";
  }
}
