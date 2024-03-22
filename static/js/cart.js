async function handleCart(id) {
  const res = await fetch(`http://localhost:3000/cart/${id}`, {
    method: "POST",
  });

  if (res.status === 200) {
    document.getElementById("add-book").disabled = "true";
    document.getElementById("book-added").innerText = "Added to card";
  }
}

async function handleRemoveCart(id) {
  const res = await fetch(`http://localhost:3000/cart/${id}`, {
    method: "DELETE",
  });

  if (res.status === 200 || res.status === 400) {
    const element = document.getElementById(`${id}`);
    element.remove();
  }
}
