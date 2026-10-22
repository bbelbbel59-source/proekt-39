const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("open");
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }, 1700);
  setTimeout(() => {
    loader.classList.add("done");
  }, 3200);
});

const navbar = document.getElementById("navbar");
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const toTop = document.getElementById("toTop");
const toast = document.getElementById("toast");
const progress = document.getElementById("progress");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  toTop.classList.toggle("show", window.scrollY > 500);
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / height) * 100 + "%";
});

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  menu.classList.toggle("open");
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("open");
    menu.classList.remove("open");
  });
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const changeBtn = document.getElementById("changeBtn");
const dots = document.querySelectorAll("#dots span");

const slides = [
  {
    title: "Uyingiz <span>eshikdan</span> boshlanadi",
    text: "Sifatli, chiroyli va mustahkam eshiklar — har bir uy uchun."
  },
  {
    title: "Xavfsizlik va <span>uslub</span> birga",
    text: "Po'lat eshiklarimiz uyingizni ishonchli himoya qiladi."
  },
  {
    title: "Tabiiy <span>yog'och</span> iliqligi",
    text: "Eman va yong'oq daraxtidan qo'lda ishlangan eshiklar."
  },
  {
    title: "Zamonaviy <span>dizayn</span>",
    text: "Minimalist eshiklar — interyeringizga mukammal mos."
  }
];

let slideIndex = 0;

function goToSlide(index) {
  slideIndex = index;
  heroTitle.classList.add("fade-out");
  heroText.classList.add("fade-out");
  dots.forEach((d, i) => d.classList.toggle("active", i === index));
  setTimeout(() => {
    heroTitle.innerHTML = slides[index].title;
    heroText.textContent = slides[index].text;
    heroTitle.classList.remove("fade-out");
    heroText.classList.remove("fade-out");
  }, 400);
}

changeBtn.addEventListener("click", () => {
  goToSlide((slideIndex + 1) % slides.length);
});

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => goToSlide(i));
});

setInterval(() => {
  goToSlide((slideIndex + 1) % slides.length);
}, 7000);

const counters = document.querySelectorAll(".counter");

function runCounter(counter) {
  const target = Number(counter.dataset.target);
  let current = 0;
  const step = Math.ceil(target / 80);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    counter.textContent = current + "+";
  }, 20);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((f) => f.classList.remove("active"));
    btn.classList.add("active");
    const type = btn.dataset.filter;
    cards.forEach((card) => {
      const match = type === "all" || card.dataset.type === type;
      card.classList.remove("pop");
      card.classList.toggle("hide", !match);
      if (match) {
        void card.offsetWidth;
        card.classList.add("pop");
      }
    });
  });
});

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const cartBtn = document.getElementById("cartBtn");
const cartBadge = document.getElementById("cartBadge");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = JSON.parse(localStorage.getItem("doorluxCart") || "[]");

function saveCart() {
  localStorage.setItem("doorluxCart", JSON.stringify(cart));
}

function renderCart() {
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Savat hozircha bo\'sh</p>';
  }
  let total = 0;
  let count = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>$${item.price * item.qty}</span>
        <div class="qty">
          <button data-action="minus" data-id="${item.id}">-</button>
          <b>${item.qty}</b>
          <button data-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-action="remove" data-id="${item.id}">&times;</button>
    `;
    cartItems.appendChild(row);
  });
  cartTotal.textContent = "$" + total;
  cartBadge.textContent = count;
  saveCart();
}

function addToCart(card) {
  const id = card.dataset.id;
  const found = cart.find((item) => item.id === id);
  if (found) {
    found.qty++;
  } else {
    cart.push({
      id: id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      img: card.dataset.img,
      qty: 1
    });
  }
  renderCart();
}

function flyToCart(img) {
  const start = img.getBoundingClientRect();
  const end = cartBtn.getBoundingClientRect();
  const clone = img.cloneNode();
  clone.className = "fly-img";
  clone.style.left = start.left + "px";
  clone.style.top = start.top + "px";
  clone.style.width = start.width + "px";
  clone.style.height = start.height + "px";
  document.body.appendChild(clone);
  requestAnimationFrame(() => {
    clone.style.left = end.left + "px";
    clone.style.top = end.top + "px";
    clone.style.width = "30px";
    clone.style.height = "30px";
    clone.style.opacity = "0.3";
  });
  setTimeout(() => {
    clone.remove();
    cartBtn.classList.remove("shake");
    void cartBtn.offsetWidth;
    cartBtn.classList.add("shake");
  }, 800);
}

document.querySelectorAll(".btn-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".card");
    flyToCart(card.querySelector("img"));
    addToCart(card);
    btn.textContent = "Qo'shildi ✓";
    btn.classList.add("added");
    showToast(card.dataset.name + " savatga qo'shildi!");
    setTimeout(() => {
      btn.textContent = "Savatga";
      btn.classList.remove("added");
    }, 1500);
  });
});

cartItems.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  if (!action) {
    return;
  }
  const item = cart.find((i) => i.id === id);
  if (action === "plus") {
    item.qty++;
  }
  if (action === "minus") {
    item.qty--;
    if (item.qty === 0) {
      cart = cart.filter((i) => i.id !== id);
    }
  }
  if (action === "remove") {
    cart = cart.filter((i) => i.id !== id);
  }
  renderCart();
});

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

clearCart.addEventListener("click", () => {
  cart = [];
  renderCart();
  showToast("Savat tozalandi");
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Avval eshik tanlang!");
    return;
  }
  cart = [];
  renderCart();
  closeCart();
  showToast("Buyurtma qabul qilindi! Rahmat!");
});

renderCart();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".g-item img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("show");
  });
});

lightboxClose.addEventListener("click", () => lightbox.classList.remove("show"));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("show");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.classList.remove("show");
    closeCart();
  }
});

const door = document.getElementById("door");
const doorBtn = document.getElementById("doorBtn");

doorBtn.addEventListener("click", () => {
  door.classList.toggle("open");
  doorBtn.textContent = door.classList.contains("open") ? "Eshikni yop" : "Eshikni och";
});

const reviews = [
  { text: "\"Eshik juda sifatli, o'rnatish ham tez bo'ldi. Hammaga tavsiya qilaman!\"", name: "— Aziz, Toshkent" },
  { text: "\"Villa Arch eshigi uyimizning eng chiroyli qismi bo'ldi.\"", name: "— Madina, Samarqand" },
  { text: "\"Po'lat eshik juda mustahkam, endi xotirjammiz.\"", name: "— Bekzod, Buxoro" }
];

const reviewText = document.getElementById("reviewText");
const reviewName = document.getElementById("reviewName");
let reviewIndex = 0;

function showReview(index) {
  reviewText.style.opacity = 0;
  reviewName.style.opacity = 0;
  reviewText.style.transform = "translateY(15px)";
  setTimeout(() => {
    reviewText.textContent = reviews[index].text;
    reviewName.textContent = reviews[index].name;
    reviewText.style.opacity = 1;
    reviewName.style.opacity = 1;
    reviewText.style.transform = "translateY(0)";
  }, 400);
}

document.getElementById("nextReview").addEventListener("click", () => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  showReview(reviewIndex);
});

document.getElementById("prevReview").addEventListener("click", () => {
  reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
  showReview(reviewIndex);
});

const form = document.getElementById("form");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name === "" || phone === "" || message === "") {
    formMsg.textContent = "Iltimos, barcha maydonlarni to'ldiring!";
    formMsg.className = "form-msg error";
    return;
  }

  formMsg.textContent = "Rahmat, " + name + "! Tez orada siz bilan bog'lanamiz.";
  formMsg.className = "form-msg success";
  form.reset();
  showToast("Xabar yuborildi!");
});
