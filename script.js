// Inicialização do cliente Supabase e scripts da lista de presentes.
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

// =============================================
// CONFIRMAÇÃO DE PRESENÇA - SUPABASE
// =============================================

const rsvpOverlay = document.getElementById("rsvp-overlay");
const rsvpOpenBtn = document.getElementById("rsvp-open-btn");
const rsvpCloseBtn = document.getElementById("rsvp-close-btn");
const rsvpForm = document.getElementById("rsvp-form");
const rsvpName = document.getElementById("rsvp-name");
const rsvpCompanions = [
  document.getElementById("rsvp-acompanhante-1"),
  document.getElementById("rsvp-acompanhante-2"),
  document.getElementById("rsvp-acompanhante-3")
];
const rsvpSubmitBtn = document.getElementById("rsvp-submit-btn");
const rsvpMessage = document.getElementById("rsvp-message");

// Abre o modal e impede a rolagem da página ao fundo.
function openRsvpModal() {
  rsvpOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  rsvpName.focus();
}

// Fecha o modal e restaura a rolagem da página.
function closeRsvpModal() {
  rsvpOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

rsvpOpenBtn.addEventListener("click", openRsvpModal);
rsvpCloseBtn.addEventListener("click", closeRsvpModal);

// Também permite fechar clicando fora da caixa do formulário.
rsvpOverlay.addEventListener("click", (event) => {
  if (event.target === rsvpOverlay) {
    closeRsvpModal();
  }
});

// Fecha o modal com a tecla ESC.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && rsvpOverlay.classList.contains("active")) {
    closeRsvpModal();
  }
});

// Mostra o formulário automaticamente quando a página é carregada.
openRsvpModal();

// Recebe os dados e envia uma nova confirmação ao Supabase.
rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Impede mais de um envio enquanto a requisição está em andamento.
  if (rsvpSubmitBtn.disabled) {
    return;
  }

  // Sanitiza os nomes: remove caracteres de controle, espaços extras
  // nas extremidades e reduz espaços repetidos.
  function sanitizarNome(valor) {
    return valor
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .replace(/\s+/g, " ");
  }

  const nome = sanitizarNome(rsvpName.value);
  const acompanhantes = rsvpCompanions.map(campo => sanitizarNome(campo.value));
  const resposta = rsvpForm.querySelector(
    'input[name="vai_comparecer"]:checked'
  );

  // Valida antes de qualquer chamada HTTP ao Supabase.
  // O nome do convidado principal é obrigatório; acompanhantes são opcionais.
  if (nome.length < 2 || nome.length > 120) {
    rsvpMessage.textContent = "Por favor, informe o nome de pelo menos uma pessoa no campo do convidado principal.";
    rsvpMessage.className = "rsvp-message error";
    rsvpName.focus();
    return;
  }

  if (acompanhantes.some(acompanhante => acompanhante.length === 1 || acompanhante.length > 120)) {
    rsvpMessage.textContent = "Cada nome de acompanhante deve ter pelo menos 2 caracteres e no máximo 120.";
    rsvpMessage.className = "rsvp-message error";
    return;
  }

  if (!resposta) {
    rsvpMessage.textContent = "Selecione se você poderá comparecer.";
    rsvpMessage.className = "rsvp-message error";
    return;
  }

  // O formulário fornece uma string; o banco espera um boolean.
  const vaiComparecer = resposta.value === "true";

  rsvpSubmitBtn.disabled = true;
  rsvpSubmitBtn.textContent = "Enviando...";
  rsvpMessage.textContent = "";
  rsvpMessage.className = "rsvp-message";

  try {
    const { error } = await supabaseClient
      .from("confirmacoes")
      .insert([
        {
          nome: nome,
          acompanhante_1: acompanhantes[0] || null,
          acompanhante_2: acompanhantes[1] || null,
          acompanhante_3: acompanhantes[2] || null,
          vai_comparecer: vaiComparecer
        }
      ]);

    if (error) {
      throw error;
    }

    rsvpMessage.textContent =
      "Confirmação enviada com sucesso! Muito obrigado pela resposta. ❤️";
    rsvpMessage.className = "rsvp-message success";

    rsvpForm.reset();

  } catch (error) {
    console.error("Erro ao enviar confirmação:", error);

    rsvpMessage.textContent =
      "Não foi possível enviar sua confirmação. Verifique sua conexão e tente novamente.";
    rsvpMessage.className = "rsvp-message error";

  } finally {
    rsvpSubmitBtn.disabled = false;
    rsvpSubmitBtn.textContent = "Enviar confirmação";
  }
});



function copyPixKey() {
  const pixInput = document.getElementById('pixKey');
  pixInput.select();
  pixInput.setSelectionRange(0, 99999); // Para dispositivos móveis

  navigator.clipboard.writeText(pixInput.value).then(() => {
    const btn = document.querySelector('.pix-copy-btn');
    const originalText = btn.innerText;
    btn.innerText = "Copiado! ✓";
    btn.style.background = "#5cb85c";

    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "#c9a96e";
    }, 2500);
  });
}

const gifts = {
  cozinha: [
    {
      name: "Moedor de café",
      link: "https://br.shp.ee/jVV7Q8Yx",
      status: "Hellen"
    },
    {
      name: "Kit porta guardanapos",
      link: "https://br.shp.ee/1upnbxZ5",
      status: ""
    },
    {
      name: "Organizador de pratos",
      link: "https://br.shp.ee/DU2VEX3B",
      status: ""
    },
    {
      name: "Organizador giratório",
      link: "https://br.shp.ee/ZRgw6vhp",
      status: ""
    },
    {
      name: "Kit 6 porta guardanapos",
      link: "https://br.shp.ee/8RFp5e2K",
      status: ""
    },
    {
      name: "Anel decorativo de porta guardanapos",
      link: "https://br.shp.ee/QjhFYuu5",
      status: ""
    },
    {
      name: "Talheres de aço",
      link: "https://br.shp.ee/NCCZG838",
      status: ""
    },
    {
      name: "Organizador de fios",
      link: "https://br.shp.ee/9cULfu49",
      status: ""
    },
    {
      name: "Prateleira",
      link: "https://br.shp.ee/yajhYr7k",
      status: ""
    },
    {
      name: "Caminho de mesa de algodão",
      link: "https://br.shp.ee/DJKYg8Su",
      status: ""
    },
    {
      name: "Caminho de mesa pompom",
      link: "https://br.shp.ee/ujessBBq",
      status: ""
    },
    {
      name: "Caminho de mesa bordado com flores",
      link: "https://br.shp.ee/uhzhgvtZ",
      status: ""
    },
    {
      name: "Toalha de mesa com babado",
      link: "https://br.shp.ee/2kqaaooJ",
      status: ""
    },
    {
      name: "Caminho de mesa artesanal",
      link: "https://br.shp.ee/m3RwMgbo",
      status: ""
    },
    {
      name: "Kit 3 bacias e 3 peneiras",
      link: "https://br.shp.ee/Mqi5R6Ya",
      status: ""
    },
    {
      name: "Jogo americano",
      link: "https://br.shp.ee/M4Qt4kzk",
      status: ""
    },
    {
      name: "Kit de mantimentos",
      link: "https://br.shp.ee/kEauHqTT",
      status: ""
    }
  ],

  quarto: [
    {
      name: "Prateleira de decoração",
      link: "https://br.shp.ee/bsdt5kq4",
      status: ""
    },
    {
      name: "Protetor para colchão",
      link: "https://br.shp.ee/6HF1FggE",
      status: ""
    }
  ],

  sala: [
    {
      name: "Quadro decorativo Salmos 23:6",
      link: "https://br.shp.ee/a1rgFrqS",
      status: ""
    },
    {
      name: "Puff baú bege",
      link: "https://br.shp.ee/MnFNpdPS",
      status: ""
    },
    {
      name: "Quadro decorativo Isaías 41:20",
      link: "https://br.shp.ee/jA7fHsAh",
      status: ""
    },
    {
      name: "Quadro decorativo Colossenses 3:14",
      link: "https://br.shp.ee/KRa7CopX",
      status: ""
    },
    {
      name: "Cortina de porta",
      link: "https://br.shp.ee/Ex1ntTX7",
      status: ""
    },
    {
      name: "Cortina de janela",
      link: "https://br.shp.ee/Ex1ntTX7",
      status: ""
    }
  ],

  diversos: [
    {
      name: "Mangueira",
      link: "https://br.shp.ee/89ujHoEC",
      status: ""
    },
    {
      name: "MOP",
      link: "https://br.shp.ee/cK18ZjsW",
      status: ""
    },
    {
      name: "Kit saco a vácuo",
      link: "https://br.shp.ee/nERasibG",
      status: ""
    },
    {
      name: "Kit organizador de acrílico",
      link: "https://br.shp.ee/XfUaHYYK",
      status: ""
    },
    {
      name: "Extensão",
      link: "https://br.shp.ee/nKUnkNkG",
      status: ""
    },
    {
      name: "Varal em espiral",
      link: "https://br.shp.ee/WSnZi1BW",
      status: ""
    },
    {
      name: "Varal de tênis",
      link: "https://br.shp.ee/JYo8GPda",
      status: ""
    },
    {
      name: "Umidificador de ar pequeno",
      link: "https://br.shp.ee/DMayWMcr",
      status: ""
    }
  ]
};

const categoryNames = {
  cozinha: "🍳 Cozinha",
  quarto: "🛏️ Quarto",
  sala: "🛋️ Sala",
  diversos: "🧼 Diversos"
};

const container = document.querySelector(".container");

Object.entries(gifts).forEach(([category, items]) => {

  const section = document.createElement("div");

  section.className = "category";

  section.id = category;

  section.innerHTML = `

    <h2>${categoryNames[category]}</h2>

    <div class="grid">

    ${items.map(item => {

      const chosen = item.status && item.status.trim() !== "";

      return `
        <div class="card-wrapper ${chosen ? "chosen" : ""}">

          <h3>${item.name}</h3>

          ${item.description ? `
            <p class="desc">
              ${item.description}
            </p>
          ` : ""}

          ${chosen ? `
            <p class="chosen-by">
              🎁 Escolhido por ${item.status}
            </p>
          ` : ""}

          <a
            class="btn ${chosen ? "chosen-btn" : ""}"
            href="${item.link}"
            target="_blank"
          >
            ${chosen ? "Ver presente" : "Comprar presente"}
          </a>

        </div>
      `;
    }).join("")}
    </div>

  `;

  container.appendChild(section);

});

const backToTop =
  document.getElementById('back-to-top');

window.addEventListener('scroll', () => {

  backToTop.style.display =
    window.scrollY > 200 ? 'block' : 'none';

});

backToTop.addEventListener('click', () => {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

});

const hero = document.getElementById("hero");

const photos = [

  {
    url: "fotos/2.webp",
    position: "center 10%",
    size: "cover"
  },

  {
    url: "fotos/3.webp",
    position: "center 80%",
    size: "100%"
  },

  {
    url: "fotos/4.webp",
    position: "center center",
    size: "cover"
  },

  {
    url: "fotos/1.webp",
    position: "center 10%",
    size: "100%"
  }

];

let currentPhoto = 0;

function changeHeroImage() {

  const photo =
    photos[currentPhoto];

  hero.style.backgroundImage =
    `url('${photo.url}')`;

  hero.style.backgroundPosition =
    photo.position;

  hero.style.backgroundSize =
    photo.size;

  currentPhoto =
    (currentPhoto + 1)
    % photos.length;

}

changeHeroImage();

setInterval(changeHeroImage, 5000);
