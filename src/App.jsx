import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ciudadesNacimiento } from '../ciudades.js';



// Añade esta función aquí
const applyImageEffects = (imageUrl, effectType, callback) => {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Permite manipular imágenes de diferentes dominios
  img.src = imageUrl;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    // Dibuja la imagen en el canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Aplica los efectos según el tipo
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Aplicar contraste reducido a la imagen grande
      if (effectType === 'contrast') {
        const contrast = 0.6; // Contraste reducido (menor que 1)
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = factor * (data[i] - 128) + 128; // Rojo
        data[i + 1] = factor * (data[i + 1] - 128) + 128; // Verde
        data[i + 2] = factor * (data[i + 2] - 128) + 128; // Azul
      }

      // Aplicar blanco y negro y opacidad a las imágenes pequeñas
      if (effectType === 'blackWhiteOpacity') {
        // Convertir a blanco y negro
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // Rojo
        data[i + 1] = avg; // Verde
        data[i + 2] = avg; // Azul

        // Aplicar opacidad (30%)
        data[i + 3] = data[i + 3] * 0.3; // 30% de opacidad
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Convierte el canvas a una URL de imagen
    const modifiedImageUrl = canvas.toDataURL('image/png');
    callback(modifiedImageUrl);
  };
};


const styles = {
  idCardContainer: {
    width: '892px',
    height: '1770px',
    position: 'relative',
    overflow: 'hidden'
  },
  cc1Container: {
    width: '792px', // Ancho específico para la opción 4 (ajusta según el tamaño de fondo_papel)
    height: '1070px', // Alto específico para la opción 4 (ajusta según el tamaño de fondo_papel)
    position: 'relative',
    overflow: 'hidden',
  },
  // Replace the photoCC1 style with this updated version:
  photoCC1: {
    position: 'absolute',
    top: '82px',
    left: '40px',
    width: '260px',
    height: '325px',
    zIndex: 2,
    objectFit: 'cover',
    objectPosition: 'center',
    
  },
  // Estilo para foto con 30% de opacidad
  photoCC1Opacity: {
    position: 'absolute',
    top: '782px',
    left: '53px',
    width: '40px',
    height: '50px',
    zIndex: 6,
    objectFit: 'cover',
    objectPosition: 'center',
    // Elimina esta línea:
    // filter: 'grayscale(100%) opacity(10%)',
  },

// Estilo para foto en blanco y negro con 30% de opacidad
photoCC1BlackWhite: {
  position: 'absolute',
  top: '195px',
  left: '694px',
  width: '40px',
  height: '50px',
  zIndex: 6,
  objectFit: 'cover',
  objectPosition: 'center',
  // Elimina esta línea:
  // filter: 'grayscale(100%) opacity(10%)',
},
  marcaCC: {
    position: 'absolute',
    top: '70px',
    left: '40px',
    width: '260px',
    height: '325px',
    zIndex: 3
  },
  okImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    zIndex: 2, // Capa inferior (debajo de cuerpo_cc)
  },
  mariposaCC: {
    position: 'absolute',
    top: '392px',
    right: '41px',
    width: '88px',
    height: '60px',
    zIndex: 5
  },
  layeredBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/id-background.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 1
  },
  cuerpoCC: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    zIndex: 5, // Capa superior
  },
  paperBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/fondo_papel.png)',
    backgroundSize: 'auto', // Mantiene el tamaño original
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 2, // Fondo debajo
  },
  grayBackground: {
    position: 'absolute',
    top: 328,
    left: 115,
    width: '26.9%',
    height: '17%',
    backgroundImage: 'url(/background-gray.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 2
  },
  watermark: {
    position: 'absolute',
    left: '116px',
    top: '328px',
    width: '26.9%',
    height: '17%',
    opacity: '0.6',
    zIndex: 4
  },
  registraduriaLogo: {
    position: 'absolute',
    top: 625,
    left: 115,
    width: '26.9%',
    height: '4.8%',
    zIndex: 4
  },
  content: {
    position: 'relative',
    zIndex: 4,
    height: '100%'
  },
  photoContainer: {
    position: 'absolute',
    left: '115px',
    top: '324px',
    width: '26.9%',
    height: '17%',
    zIndex: 3,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrContainer: {
    position: 'absolute',
    bottom: '50px',
    right: '65px',
    textAlign: 'center',
    zIndex: 4
  },
  validityContainer: {
    position: 'absolute',
    bottom: '50px',
    left: '25px',
    fontFamily: 'Arial',
    fontSize: '31px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    textAlign: 'center',
    width: '60%'
  },
  cc1TextLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5, // Capa de texto por encima de cuerpo_cc
  },
  textStyles: {
    primeraVezText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '31px',
      top: 360,
      left: 517
    },
    numeroCCText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '31px',
      top: 400,
      left: 550,
      textAlign: 'center'
    },
    apellidosText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '16px',
      top: 798,
      left: 44
    },
    nameText: {
      fontSize: '31px',
      marginTop: '1px',
      whiteSpace: 'pre-line',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      lineHeight: '1'
    },
    fechaNacimientoTitleText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '16px',
      top: 905,
      left: 44  
    },
    fechaText: {
      fontSize: '31px',
      marginTop: '1px',
      whiteSpace: 'pre-line',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      lineHeight: '1'
    },
    lugarNacimientoText: {
      fontSize: '31px',
      marginTop: '1px',
      whiteSpace: 'pre-line',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      lineHeight: '1'
    },
    sexoText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '16px',
      top: 1105,
      left: 44
    },
    lugarPreparacionText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '16px',
      top: 1205,
      left: 44
    },
    oficinaEntregaText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '16px',
      top: 1305,
      left: 44
    },
    fechaExpedicionText: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '16px',
      top: 1005,
      left: 44
    },
    idNumber: {
      fontSize: '31px',
      marginTop: '5px',
      fontFamily: 'Arial',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    firmaText: {
      position: 'absolute',
      fontFamily: '"Ink Free", "Segoe Script", "Comic Sans MS", cursive',
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '39px',
      top: 643,
      left: '26.5%',
      transform: 'translateX(-50%)',
      zIndex: 5,
      textAlign: 'center',
      maxWidth: '36.9%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    },
    // Estilos para el texto de CC-1 (posiciones y estilos temporales)
    cc1Text: {
      position: 'absolute',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontSize: '20px',
      color: 'black',
      zIndex: 6
    }
  }
};

function App() {
  const idCardRef = useRef(null);
  const [documentId, setDocumentId] = useState('851454622');
  const [selectedOption, setSelectedOption] = useState('');
  const [petData, setPetData] = useState({
    
    
    name: '',
    birthDate: '',
    birthPlace: 'BOGOTA D.C - CUNDINAMARCA',
    sex: 'MASCULINO',
    preparationPlace: 'BOGOTA D.C - ANTONIO NARIÑO',
    deliveryOffice: 'BOGOTA D.C - ANTONIO NARIÑO',
    id: '1.016.834.229',
    photo: null,
    modifiedPhoto: null, // Foto con opacidad
    blackWhitePhoto: null, // Nuevo campo para la foto en blanco y negro
    expeditionDate: new Date().toISOString().split('T')[0],
    firma: 'Firma',
    apellidos: '',
    nombres: '',
    altura: '',
    numeroId: ''
  });
  // Texto original pegado desde WhatsApp
const [whatsAppText, setWhatsAppText] = useState("");
  // ===============================
  // FUNCION: Procesar texto de WhatsApp y rellenar automáticamente petData
  // ===============================
 const handleParseWhatsApp = () => {
  if (!whatsAppText.trim()) {
    alert("Pega el mensaje de WhatsApp primero.");
    return;
  }

  // ====== 1) Separar líneas ======
  const lines = whatsAppText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Clasificamos cada línea por su contenido (para que el orden NO importe)
  let nameLine = "";
  let cityLine = "";
  let genderLine = "";
  let emailLine = "";
  let birthLine = "";
  let heightLine = "";
  let idLine = "";

  const remaining = [];

  const monthWords = [
    "ene",
    "enero",
    "feb",
    "febrero",
    "mar",
    "marzo",
    "abr",
    "abril",
    "may",
    "mayo",
    "jun",
    "junio",
    "jul",
    "julio",
    "ago",
    "agosto",
    "sep",
    "sept",
    "set",
    "septiembre",
    "oct",
    "octubre",
    "nov",
    "noviembre",
    "dic",
    "diciembre",
  ];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const digitsOnly = line.replace(/\D/g, "");

    // Correo
    if (!emailLine && line.includes("@")) {
      emailLine = line;
      continue;
    }

    // Género: m, f, masculino, femenino (sin confundir "maria", "maikol", etc.)
if (
  !genderLine &&
  (
    lower === "m" ||
    lower === "f" ||
    lower.startsWith("masculino") ||
    lower.startsWith("femenino")
  )
) {
  genderLine = line;
  continue;
}


    // Fecha: 12/06/2008, 12-06-2008, 12 jun 2008, 12 junio 2008
    const dateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;

// Separamos en palabras y limpiamos signos de puntuación
const tokens = lower
  .split(/\s+/)
  .map(t => t.replace(/[.,;:]/g, ""));

// Ahora sí: ¿alguna palabra es exactamente un mes?
const hasMonthWord = tokens.some((t) => monthWords.includes(t));

if (!birthLine && (dateRegex.test(lower) || hasMonthWord)) {
  birthLine = line;
  continue;
}


    // Cédula: muchos dígitos (>= 6)
    if (!idLine && digitsOnly.length >= 6) {
      idLine = line;
      continue;
    }

    // Altura: número con punto/coma y probablemente corto (ej: 1.20)
    const heightMatch = lower.match(/(\d+[.,]\d+)/);
    if (
      !heightLine &&
      heightMatch &&
      digitsOnly.length <= 4 && // evitar confundir con cédula
      !dateRegex.test(lower)
    ) {
      heightLine = line;
      continue;
    }

    // Lo que no encaja en nada se va a "remaining"
    remaining.push(line);
  }

      // ====== 3) De lo que sobró: elegir mejor línea para NOMBRE y posible CIUDAD ======
  if (remaining.length > 0) {
    // 1) Intentamos detectar líneas que "parezcan" un NOMBRE:
    // - sin números
    // - sin @
    // - al menos 3 palabras
    // - que NO contengan palabras tipo "lugar", "nacimiento", "expedicion", "correo"
    const candidateNameIndexes = remaining
      .map((ln, idx) => ({ ln, idx }))
      .filter(({ ln }) => {
        const lower = ln.toLowerCase();

        // quitamos viñetas tipo "- "
        const noBullet = lower.replace(/^[-•·]\s*/, "");

        if (/\d/.test(noBullet)) return false;      // no números
        if (noBullet.includes("@")) return false;   // no correos

        const wordCount = noBullet.split(/\s+/).filter(Boolean).length;
if (wordCount < 3) return false;            // al menos 3 palabras

        if (
          noBullet.includes("lugar") ||
          noBullet.includes("nacimiento") ||
          noBullet.includes("expedicion") ||
          noBullet.includes("expedición") ||
          noBullet.includes("correo")
        ) {
          return false; // descartamos líneas tipo "LUGAR DE NACIMIENTO", "CORREO", etc
        }

        return true;
      });

    if (candidateNameIndexes.length > 0) {
      // Calculamos un "score" para elegir el mejor candidato
      const cityWords = [
        "bogota",
        "bogotá",
        "tunja",
        "armenia",
        "quindio",
        "quindío",
        "medellin",
        "medellín",
      ];

      let best = candidateNameIndexes[0];
      let bestScore = -999;

      candidateNameIndexes.forEach((c) => {
        const lower = c.ln.toLowerCase();
        const noBullet = lower.replace(/^[-•·]\s*/, "");
        const words = noBullet.split(/\s+/).filter(Boolean);
        let score = words.length;

        if (words.length >= 3) score += 3;
        if (words.length >= 4) score += 2;

        // Penalizamos si parece nombre de ciudad
        if (cityWords.some((w) => noBullet.includes(w))) {
          score -= 6;
        }

        if (score > bestScore) {
          bestScore = score;
          best = c;
        }
      });

      // Usamos el mejor candidato como NOMBRE
      nameLine = best.ln;

      // Para ciudad, usamos otra línea distinta, sin números (si existe)
      const cityCandidate = remaining.find(
        (ln, idx) => idx !== best.idx && !/\d/.test(ln)
      );
      if (cityCandidate) {
        cityLine = cityCandidate;
      }
    } else {
      // 2) Si no encontramos nada "con pinta de nombre",
      // usamos la lógica simple anterior (máximo número de palabras).
      let nameIdx = 0;
      let maxWords = 0;

      remaining.forEach((ln, idx) => {
        const wc = ln.split(/\s+/).filter(Boolean).length;
        if (wc > maxWords) {
          maxWords = wc;
          nameIdx = idx;
        }
      });

      nameLine = remaining[nameIdx];

      const cityCandidate = remaining.find(
        (ln, idx) => idx !== nameIdx && !/\d/.test(ln)
      );
      if (cityCandidate) {
        cityLine = cityCandidate;
      }
    }
  }



  const isCC = selectedOption === "CC-1" || selectedOption === "CC-2";
  const isSimple =
    selectedOption === "1.014.668.661" ||
    selectedOption === "1.025.537.952" ||
    selectedOption === "1.150.184.946";

  if (!isCC && !isSimple) {
    alert("Primero selecciona una opción de documento.");
    return;
  }

  const toUpper = (str) => (str || "").toString().trim().toUpperCase();
    // Normalizar nombre de ciudad a un código que tu app entienda
    // Buscar dentro de ciudadesNacimiento la opción correcta
  const findCiudadNacimiento = (raw) => {
    if (!raw) return "";

    const normalize = (s) =>
      s
        .toString()
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // quita tildes

    const input = normalize(raw);

    let bestMatch = "";
    let bestScore = 0;

    ciudadesNacimiento.forEach((opcion) => {
      const opcionNorm = normalize(opcion); // ej: "MEDELLIN - ANTIOQUIA"
      const [cityPart] = opcionNorm.split(" - "); // "MEDELLIN" o "BOGOTA D.C"
      const firstWord = cityPart.split(/\s+/)[0]; // "MEDELLIN" o "BOGOTA"

      let score = 0;

      // Coincidencia muy fuerte (texto completo)
      if (input === cityPart) {
        score = 3;
      }
      // Coincidencia fuerte (incluye toda la ciudad, o al revés)
      else if (input.includes(cityPart) || cityPart.includes(input)) {
        score = 2;
      }
      // Coincidencia más suave (coincide al menos la primera palabra)
      else if (input.includes(firstWord)) {
        score = 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = opcion; // guardamos la opción completa, ej: "MEDELLIN - ANTIOQUIA"
      }
    });

    return bestMatch; // si no encontró nada, devolverá ""
  };



  // ====== (Nombre → separar partes) ======
const fullNameUpper = toUpper(nameLine);
// Quitamos viñetas tipo "- " al inicio
const cleanedFullName = fullNameUpper.replace(/^[-•·]\s*/, "");
const rawNameParts = cleanedFullName.split(/\s+/).filter(Boolean);


  let apellidos = "";
  let nombres = "";

  if (rawNameParts.length >= 3) {
    // DOS ÚLTIMAS palabras = apellidos, resto = nombres
    apellidos = rawNameParts.slice(-2).join(" "); // PEREZ RAMIREZ
    nombres = rawNameParts.slice(0, -2).join(" "); // MAXI EMILIANO
  } else if (rawNameParts.length === 2) {
    apellidos = rawNameParts[1];
    nombres = rawNameParts[0];
  } else if (rawNameParts.length === 1) {
    apellidos = rawNameParts[0];
    nombres = "";
  }
      // ====== 4.1) Construir FIRMA a partir de nombres y apellidos ======
  const buildSignature = (nombresRaw, apellidosRaw) => {
    const MAX = 11;

    // Función para poner en formato Título (Juan Perez / Alejandro S.)
    const toTitleCase = (str) =>
      str
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

    // Normalizar espacios
    const nombresClean = (nombresRaw || "")
      .toString()
      .trim()
      .replace(/\s+/g, " ");

    const apellidosClean = (apellidosRaw || "")
      .toString()
      .trim()
      .replace(/\s+/g, " ");

    const nameParts = nombresClean.split(" ").filter(Boolean);
    const surnameParts = apellidosClean.split(" ").filter(Boolean);

    const firstName = nameParts[0] || "";
    const secondName = nameParts[1] || "";
    const firstSurname = surnameParts[0] || "";

    const lengthOf = (str) => str.length;

    // --- 1) Si hay dos nombres: probar "Nombre1 Nombre2" ---
    if (firstName && secondName) {
      const optA = `${firstName} ${secondName}`;
      if (lengthOf(optA) <= MAX) {
        return toTitleCase(optA);
      }
    }

    // Elegir el nombre más corto
    let shortestName = firstName;
    if (secondName && secondName.length < shortestName.length) {
      shortestName = secondName;
    }

    // --- 2) "NombreMásCorto Apellido1" ---
    if (shortestName && firstSurname) {
      const optB = `${shortestName} ${firstSurname}`;
      if (lengthOf(optB) <= MAX) {
        return toTitleCase(optB);
      }
    }

    // --- 3) "NombreMásCorto A." ---
    if (shortestName && firstSurname) {
      const initial = firstSurname.charAt(0).toUpperCase();
      const optC = `${shortestName} ${initial}.`;
      return toTitleCase(optC);
    }

    // Último recurso
    return toTitleCase(nombresClean.slice(0, MAX));
  };


  // ====== 3) Ciudad (solo texto, no tocamos tus lugares predeterminados) ======
  const cityUpper = toUpper(cityLine);

  // ====== 4) Género ======
  const g = genderLine.toLowerCase();
  let genderSimple = ""; // texto completo para 1–2–3
  let genderCC = ""; // M / F para CC-1/CC-2

  if (g.startsWith("m")) {
    genderSimple = "MASCULINO";
    genderCC = "M";
  } else if (g.startsWith("f")) {
    genderSimple = "FEMENINO";
    genderCC = "F";
  }

  // ====== 5) Fecha flexible ======
  const parseDateFlexible = (raw, addOneDay) => {
    if (!raw) return "";
    let text = raw.toString().trim().toLowerCase();

    // Formato 12/06/2008 o 12-06-2008
    let m = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    let day, month, year;

    if (m) {
      day = parseInt(m[1]);
      month = parseInt(m[2]);
      year = parseInt(m[3]);
    } else {
      // Formato "12 jun 2008" o "12 junio 2008"
      const parts = text.split(/\s+/);
      if (parts.length >= 3) {
        day = parseInt(parts[0]);
        year = parseInt(parts[2]);

        const monthStr = parts[1];
        const months = {
          ene: 1,
          enero: 1,
          feb: 2,
          febrero: 2,
          mar: 3,
          marzo: 3,
          abr: 4,
          abril: 4,
          may: 5,
          mayo: 5,
          jun: 6,
          junio: 6,
          jul: 7,
          julio: 7,
          ago: 8,
          agosto: 8,
          sep: 9,
          sept: 9,
          set: 9,
          septiembre: 9,
          oct: 10,
          octubre: 10,
          nov: 11,
          noviembre: 11,
          dic: 12,
          diciembre: 12,
        };

        month = months[monthStr] || months[monthStr.slice(0, 3)];
      }
    }

    if (!day || !month || !year) return "";

    const d = new Date(year, month - 1, day);
    if (addOneDay) d.setDate(d.getDate() + 1); // +1 día SOLO para CC

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate() + 0).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const birthIso = parseDateFlexible(birthLine, isCC);

  // ====== 6) Altura (solo CC) ======
  const parseHeight = (raw) => {
    if (!raw) return "";
    const cleaned = raw.replace(",", ".").trim();
    const match = cleaned.match(/(\d+(\.\d+)?)/);
    return match ? match[1] : "";
  };

  const alturaValue = isCC ? parseHeight(heightLine) : "";

  // ====== 7) Cédula (solo CC) ======
  const parseId = (raw) => {
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    // insertar puntos cada 3 dígitos desde la derecha
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const cedulaValue = isCC ? parseId(idLine) : "";

  // ====== 8) Actualizar petData ======
  setPetData((prev) => {
    const updated = { ...prev };
      const ciudadDetectada = cityLine ? findCiudadNacimiento(cityLine) : "";

    


    // ----- Opciones 1–2–3 -----
    if (isSimple) {
      // Nombre en DOS renglones:
      // APELLIDOS
      // NOMBRES
      if (apellidos || nombres) {
        updated.name = nombres
          ? `${apellidos}\n${nombres}`
          : apellidos;
      }

      if (genderSimple) {
        // Intentamos cubrir cualquier clave de género que uses
        updated.genero = genderSimple;
        updated.sexo = genderSimple;
        updated.sex = genderSimple;
        updated.gender = genderSimple;
      }
          // Ciudad para formatos 1–2–3 (si tu estado se llama distinto, cámbialo)
      // Ciudad de nacimiento para opciones 1–2–3
    if (ciudadDetectada) {
      updated.birthPlace = ciudadDetectada;
    }



      if (cityUpper) {
        updated.ciudad = cityUpper;
      }
      // NO tocamos preparationPlace ni deliveryOffice
    }

    // ----- CC-1 / CC-2 -----
    if (isCC) {
      updated.apellidos = apellidos; // PEREZ RAMIREZ
      updated.nombres = nombres; // MAXI EMILIANO

      // NO tocamos birthPlace (lo maneja tu selector)
      if (genderCC) {
        updated.sex = genderCC; // M / F
      }
      if (birthIso) {
        updated.birthDate = birthIso; // con +1 día
      }
      if (alturaValue) {
        updated.altura = alturaValue; // 1.20
      }
      if (cedulaValue) {
        updated.numeroId = cedulaValue; // 1.234.567.890
      }
          // Ciudad para formatos CC-1 / CC-2
        // Ciudad de nacimiento para CC-1 / CC-2
    if (ciudadDetectada) {
      updated.birthPlace = ciudadDetectada;
    }


    }

    // Correo (en todos)
    if (emailLine) {
      updated.correo = emailLine.trim();
    }
        // ====== FIRMA (para todos los formatos) ======
    const firmaCalculada = buildSignature(nombres, apellidos);
    if (firmaCalculada) {
      // Si tu campo en petData se llama distinto (ej: 'signature'),
      // cambia 'firma' por ese nombre:
      updated.firma = firmaCalculada;
    }


    return updated;
  });

  alert("Datos rellenados automáticamente. Revisa que todo esté bien.");
};










  const options = [
  {
    id: '1.014.668.661',
    birthDate: '2008-03-10',
    expeditionDate: '2026-03-14',
    preparationPlace: 'BOGOTA D.C - KENNEDY',
    deliveryOffice: 'BOGOTA D.C - KENNEDY',
    qrNumber: '8518408077'
  },
  {
    id: '1.025.537.952',
    birthDate: '2008-03-2',
    expeditionDate: '2026-03-4',
    preparationPlace: 'BOGOTA D.C - TUNJUELITO ',
    deliveryOffice: 'BOGOTA D.C - TUNJUELITO ',
    qrNumber: '8518368974'
  },
  {
    id: '1.150.184.946',
    birthDate: '2008-03-11',
    expeditionDate: '2026-03-14',
    preparationPlace: 'BOGOTA D.C - 	CHAPINERO ',
    deliveryOffice: 'BOGOTA D.C - 	CHAPINERO ',
    qrNumber: '8518394670' 
  },
  {
    id: 'CC-1',
    birthDate: '2007-01-24',
    expeditionDate: '2025-01-01',
    preparationPlace: 'BOGOTA D.C - CHAPINERO',
    deliveryOffice: 'BOGOTA D.C - CHAPINERO',
    qrNumber: '8514500000'
  },
  {
    id: 'CC-2',
    birthDate: '2007-04-12',
    expeditionDate: '2025-01-01',
    preparationPlace: 'BOGOTA D.C - CHAPINERO',
    deliveryOffice: 'BOGOTA D.C - CHAPINERO',
    qrNumber: '8211300507'
  }
];

  const handleOptionChange = (e) => {
  const value = e.target.value;
  setSelectedOption(value);
  
  // Primero, reiniciar todos los datos al estado inicial
  const initialData = {
    name: '',
    birthDate: '',
    birthPlace: 'BOGOTA D.C - CUNDINAMARCA',
    sex: 'MASCULINO',
    preparationPlace: '',
    deliveryOffice: '',
    id: '',
    photo: null,
    modifiedPhoto: null,
    blackWhitePhoto: null,
    expeditionDate: '',
    firma: 'Firma',
    apellidos: '',
    nombres: '',
    altura: '',
    numeroId: ''
  };
  
  // Luego, buscar los datos de la opción seleccionada
  const selectedOptionData = options.find(opt => opt.id === value);
  
  // Si encontramos la opción, actualizamos los datos con los valores específicos
  if (selectedOptionData) {
    setPetData({
      ...initialData,
      id: selectedOptionData.id,
      birthDate: selectedOptionData.birthDate,
      expeditionDate: selectedOptionData.expeditionDate,
      preparationPlace: selectedOptionData.preparationPlace,
      deliveryOffice: selectedOptionData.deliveryOffice
    });
    setDocumentId(selectedOptionData.qrNumber);
  }
};

  const handleNameChange = (e) => {
    if (selectedOption !== 'CC-1' && selectedOption !== 'CC-2') {
      const fullName = e.target.value.toUpperCase();
      const nameParts = fullName.split(' ');
      
      if (nameParts.length >= 3) {
        const apellidos = nameParts.slice(0, 2); // Tomar los primeros dos elementos como apellidos
        const nombres = nameParts.slice(2); // El resto son nombres
        
        // No invertir los apellidos
        const apellidosOrdenados = apellidos.join(' '); // Unir los apellidos con un espacio
        const nombresOrdenados = nombres.join(' '); // Unir los nombres con un espacio
        
        setPetData(prev => ({
          ...prev,
          name: apellidosOrdenados + '\n' + nombresOrdenados
        }));
      } else {
        setPetData(prev => ({...prev, name: fullName}));
      }
    }
  };

  // Handlers para apellidos y nombres en la opción 4
  const handleApellidosChange = (e) => {
    setPetData({ ...petData, apellidos: e.target.value.toUpperCase() });
    
    // Actualizar también el campo name para mantener compatibilidad con el resto del código
    updateFullName(e.target.value, petData.nombres);
  };

  const handleNombresChange = (e) => {
    setPetData({ ...petData, nombres: e.target.value.toUpperCase() });
    
    // Actualizar también el campo name para mantener compatibilidad con el resto del código
    updateFullName(petData.apellidos, e.target.value);
  };

  // Nuevo handler para el número de ID
  const handleNumeroIdChange = (e) => {
    setPetData({ ...petData, numeroId: e.target.value });
  };

  // Función para actualizar el campo name combinando apellidos y nombres
  const updateFullName = (apellidos, nombres) => {
    if (apellidos || nombres) {
      setPetData(prev => ({
        ...prev,
        name: apellidos + '\n' + nombres
      }));
    }
  };

  const handleAlturaChange = (e) => {
    setPetData({ ...petData, altura: e.target.value });
  };

  const handleFirmaChange = (e) => {
    setPetData({ ...petData, firma: e.target.value });
  };

  const getFormattedDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  // No ajustar timezone para evitar el problema del día
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

  const getValidityDate = () => {
    if (!petData.expeditionDate) return '';
    const expDate = new Date(petData.expeditionDate);
    const validityDate = new Date(expDate);
    validityDate.setMonth(validityDate.getMonth() + 6);
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return `${String(validityDate.getDate()).padStart(2, '0')}-${months[validityDate.getMonth()]}-${validityDate.getFullYear()}`;
  };
  const calcularFechaExpedicion = () => {
    if (!petData.birthDate) return '';
    
    const fechaNacimiento = new Date(petData.birthDate);
    
    // Calcular fecha de expedición (cuando la persona cumpla 18 años + días adicionales)
    const fechaExpedicion = new Date(fechaNacimiento);
    fechaExpedicion.setFullYear(fechaExpedicion.getFullYear() + 18); // 18 años después
    fechaExpedicion.setDate(fechaExpedicion.getDate() + 10); // 10 días después
    
    // Si se debe ajustar para febrero (si es año bisiesto o no)
    if (fechaExpedicion.getMonth() === 1) { // febrero
      const ultimoDiaMes = new Date(fechaExpedicion.getFullYear(), 1, 29).getMonth() === 1 ? 29 : 28;
      if (fechaExpedicion.getDate() > ultimoDiaMes) {
        fechaExpedicion.setDate(1); // primer día del siguiente mes
        fechaExpedicion.setMonth(fechaExpedicion.getMonth() + 1);
      }
    }
    
    // Formatear la fecha
    const dia = String(fechaExpedicion.getDate()).padStart(2, '0');
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const mes = meses[fechaExpedicion.getMonth()];
    const año = fechaExpedicion.getFullYear();
    
    // Obtener solo la ciudad (sin departamento)
    const ciudad = petData.birthPlace.split(' - ')[0];
    
    return `${dia} ${mes} ${año}, ${ciudad}`;
  };
  const formatMRZ = () => {
    // Longitud estándar para cada línea
    const longitudLinea = 44;
    
    // Primera línea fija (cambia según la opción)
  const linea1 = selectedOption === 'CC-1' 
  ? "ICCOL000009839472452045<<<<<<<<<".padEnd(longitudLinea, '<') 
  : "ICCOL00000789023452045<<<<<<<<<".padEnd(longitudLinea, '<');
    
    // Segunda línea: Fecha nacimiento + M/F + altura + COL + numeroID + <5
    const fechaNacParte = petData.birthDate ? petData.birthDate.replaceAll('-', '').substring(2) : "000000";
    const sexoParte = petData.sex === "M" ? "M" : "F";
    const alturaParte = petData.altura ? petData.altura.replace('.', '') : "000";
    // Limpiar el número de ID de puntos
    const numeroIDLimpio = petData.numeroId.replace(/\./g, '');
    
    // Calcular cuántos caracteres tenemos hasta ahora
    const longitudBaseSegundaLinea = fechaNacParte.length + sexoParte.length + 
                                    alturaParte.length + 3 + numeroIDLimpio.length + 2;
    
    // Calcular cuántos '<' necesitamos añadir
    const rellenoNecesario = Math.max(0, longitudLinea - longitudBaseSegundaLinea);
    
    // Crear segunda línea con número correcto de '<'
    const linea2 = `${fechaNacParte}${sexoParte}${alturaParte}COL${numeroIDLimpio}<5${'<'.repeat(rellenoNecesario)}`;
    
    // Tercera línea: Apellidos y nombres con formato específico
    const apellidosParte = petData.apellidos.replace(/ /g, '<');
    const nombresParte = petData.nombres.replace(/ /g, '<');
    
    // Crear una tercera línea más compacta
    let linea3 = `${apellidosParte}<<${nombresParte}`;
    
    // Solo rellenar el espacio restante con '<'
    if (linea3.length < longitudLinea) {
      linea3 = linea3.padEnd(longitudLinea, '<');
    } else if (linea3.length > longitudLinea) {
      // Truncar si es demasiado largo
      linea3 = linea3.substring(0, longitudLinea);
    }
    
    return {
      linea1,
      linea2,
      linea3
    };
  };
  const formatearLugarNacimiento = (lugarNacimiento) => {
    if (!lugarNacimiento) return '';
  
    // Reemplazar " - " por " (" y añadir ")" al final
    return lugarNacimiento.replace(' - ', ' (') + ')';
  };
  const formatearNumeroId = (numeroId) => {
    if (!numeroId) return '';
  
    // Eliminar cualquier punto existente y formatear
    const numeroLimpio = numeroId.replace(/\./g, '');
    return numeroLimpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const calcularFechaCon10Anos = (fechaExpedicion) => {
    if (!petData.expeditionDate) return '';
    
    // Usamos la fecha de expedición calculada en lugar de la fecha directa
    const fechaExp = new Date(petData.expeditionDate);
    
    // Calcular fecha de expedición (cuando la persona cumpla 18 años + días adicionales)
    const fechaNacimiento = new Date(petData.birthDate);
    const fechaBase = new Date(fechaNacimiento);
    fechaBase.setFullYear(fechaBase.getFullYear() + 18); // 18 años después
    fechaBase.setDate(fechaBase.getDate() + 10); // 10 días después
    
    // Añadir 10 años a la fecha base para la expiración
    const fechaExpiracion = new Date(fechaBase);
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 10);
    
    // Formatear la fecha de expiración
    const dia = String(fechaExpiracion.getDate()).padStart(2, '0');
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const mes = meses[fechaExpiracion.getMonth()];
    const año = fechaExpiracion.getFullYear();
    
    return `${dia} ${mes} ${año}`;
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
  
        // Aplicar efecto de contraste a la foto principal
        applyImageEffects(imageUrl, 'contrast', (contrastImageUrl) => {
          // Aplicar efecto de blanco y negro y opacidad a la segunda foto
          applyImageEffects(imageUrl, 'blackWhiteOpacity', (blackWhiteOpacityImageUrl) => {
            // Aplicar efecto de blanco y negro y opacidad a la tercera foto
            applyImageEffects(imageUrl, 'blackWhiteOpacity', (blackWhiteOpacityImageUrl2) => {
              setPetData(prev => ({
                ...prev,
                photo: contrastImageUrl, // Foto principal con contraste
                modifiedPhoto: blackWhiteOpacityImageUrl, // Foto con blanco y negro y opacidad
                blackWhitePhoto: blackWhiteOpacityImageUrl2 // Otra foto con blanco y negro y opacidad
              }));
            });
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDownload = async () => {
  if (idCardRef.current) {
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(idCardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: '#ffffff',
        width: selectedOption === 'CC-1' || selectedOption === 'CC-2' ? 792 : 892,
        height: selectedOption === 'CC-1' || selectedOption === 'CC-2' ? 1070 : 1770,
      });

      const aspectRatio = canvas.height / canvas.width;
      const pdfWidth = 210;
      const pdfHeight = pdfWidth * aspectRatio;

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      let fileName;

      // Lógica para las opciones 4 y 5 (CC-1 y CC-2)
      if (selectedOption === 'CC-1' || selectedOption === 'CC-2') {
        fileName = petData.numeroId;
      } else {
        const cleanId = petData.id.replace(/\./g, '');
        switch (cleanId) {
          case '1014668661': // Actualizado para el nuevo ID
            fileName = 'Comprobante de documento en trÃ¡mite 1014668661';
            break;
          case '1025537952':
            fileName = 'Comprobante de documento en trÃ¡mite 1025537952';
            break;
          case '1150184946':
            fileName = 'Comprobante de documento en trÃ¡mite 1150184946';
            break;
          default:
            fileName = 'Comprobante de documento en trÃ¡mite';
        }
      }

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }
};

  const renderCardContent = () => {
    if (selectedOption === 'CC-1' || selectedOption === 'CC-2') {
      return (
        <div style={styles.cc1Container}>
          <div style={styles.paperBackground} />
          {/* Añadir la imagen "ok" */}
          <img 
            src="/ok.png" 
            alt="OK" 
            style={styles.okImage} 
          />
          
          {/* Colocar la foto ANTES de cuerpo_cc para que aparezca detrás */}
          {petData.photo && (
  <img 
    src={petData.photo}
    alt="Foto"
    style={styles.photoCC1}
  />
)}
          {/* Foto con 30% de opacidad */}
          {petData.modifiedPhoto && (
  <img 
    src={petData.modifiedPhoto}
    alt="Foto con blanco y negro y opacidad"
    style={styles.photoCC1Opacity}
  />
)}
          
          {/* Foto en blanco y negro con 30% de opacidadd */}
          {petData.blackWhitePhoto && (
  <img 
    src={petData.blackWhitePhoto}
    alt="Foto con blanco y negro y opacidad"
    style={styles.photoCC1BlackWhite}
  />
)}
          <img 
            src="/cuerpo_cc.png" 
            alt="Cuerpo CC" 
            style={styles.cuerpoCC} 
          />
          {/* Capa de texto sobre la imagen cuerpo_cc */}
          <div style={styles.cc1TextLayer}>
            {/* Apellidos */}
            <div style={{...styles.textStyles.cc1Text, top: '94px', left: '318px'}}>
              {petData.apellidos}
            </div>
            {/* Nombres */}
            <div style={{...styles.textStyles.cc1Text, top: '155px', left: '318px'}}>
              {petData.nombres}
            </div>
            
            {/* Número de ID formateado */}
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '62px', // Ajusta la posición vertical
          left: '614px', // Ajusta la posición horizontal
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {formatearNumeroId(petData.numeroId)}
        </div>
        
            {/* Fecha nacimiento */}
            <div style={{...styles.textStyles.cc1Text, top: '250px', left: '318px'}}>
              {getFormattedDate(petData.birthDate)}
            </div>
            {/* Lugar de nacimiento formateado */}
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '292px', // Ajusta la posición vertical
          left: '318px', // Ajusta la posición horizontal
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {formatearLugarNacimiento(petData.birthPlace)}
        </div>
            {/* Sexo */}
            <div style={{...styles.textStyles.cc1Text, top: '209px', left: '550px'}}>
              {petData.sex}
            </div>
            {/* Altura */}
            <div style={{...styles.textStyles.cc1Text, top: '209px', left: '463px'}}>
              {petData.altura}
            </div>
            {/* Firma */}
            <div style={{
              ...styles.textStyles.cc1Text,
              top: '418px',
              left: '22%',
              transform: 'translateX(-50%)',
              fontFamily: '"Ink Free", "Segoe Script", "Comic Sans MS", cursive',
              fontWeight: '400',
              fontSize: '32px'
            }}>
              {petData.firma}
            </div>
            {/* Añadir la marca CC */}
<img
  src="/marca_cc.png"
  alt="Marca CC"
  style={styles.marcaCC}
/>

{/* Añadir la mariposa CC */}
<img
  src="/mariposa_cc.png"
  alt="Mariposa CC"
  style={styles.mariposaCC}
/>
          {/* Nuevo texto estático "COL" */}
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '210px',          // Ajusta esta coordenada Y según necesites
          left: '318px',         // Ajusta esta coordenada X según necesites
          fontSize: '20px',      // Ajusta el tamaño de fuente según necesites
          fontWeight: 'normal'     // Puedes ajustar el peso de la fuente
        }}>
          COL
        </div>
        
        {/* Nuevo texto estático "O+" */}
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '245px',          // Ajusta esta coordenada Y según necesites
          left: '463px',         // Ajusta esta coordenada X según necesites
          fontSize: '20px',      // Ajusta el tamaño de fuente según necesites
          fontWeight: 'normal',    // Puedes ajustar el peso de la fuente
          color: 'black'           // Opcionalmente, puedes cambiar el color
        }}>
          O+
          </div>
          {/* Texto estático para la opción 4 y 5 */}
<div style={{
  ...styles.textStyles.cc1Text,
  fontFamily: 'OCRB, monospace',
  top: '680px',
  left: '20px',
  fontSize: '20px',
  transform: 'rotate(-90deg)',
  fontWeight: 'normal',
  color: 'black'
}}>
  {selectedOption === 'CC-1' ? '009839472' : '00789023'} {/* Cambia según la opción */}
</div>
          <div style={{
  position: 'absolute',
  fontFamily: 'OCRB, monospace',
  fontSize: '38px',  // Tamaño reducido
  letterSpacing: '0px',  // Sin espaciado adicional entre letras
  lineHeight: '1.1',  // Líneas más juntas
  bottom: '50px',  // Ajustado para que quede bien posicionado en la parte inferior
  left: '70px',    // Ajustado para centrar mejor el texto
  whiteSpace: 'pre',
  zIndex: 6,
  width: '660px',  // Ancho máximo para controlar que no se salga
  overflow: 'hidden'  // Ocultar cualquier desbordamiento
}}>
  {formatMRZ().linea1}{'\n'}
  {formatMRZ().linea2}{'\n'}
  {formatMRZ().linea3}
</div>
          {/* Nuevo texto: Fecha de expedición + 10 años */}
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '414px', // Ajusta la posición vertical
          left: '318px', // Ajusta la posición horizontal
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {calcularFechaCon10Anos(petData.expeditionDate)}
        </div>
        
        {/* Fecha de expedición calculada */}
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '354px',
          left: '318px',
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {calcularFechaExpedicion()}
        </div>
      </div>
    </div>
  );
} else if (selectedOption === 'CC-2') { // Nueva condición para la opción 5
  return (
    <div style={styles.cc1Container}>
      <div style={styles.paperBackground} />
      <img 
        src="/ok.png" 
        alt="OK" 
        style={styles.okImage} 
      />
      
      {petData.photo && (
        <img 
          src={petData.photo}
          alt="Foto"
          style={styles.photoCC1}
        />
      )}
      
      {petData.modifiedPhoto && (
        <img 
          src={petData.modifiedPhoto}
          alt="Foto con blanco y negro y opacidad"
          style={styles.photoCC1Opacity}
        />
      )}
      
      {petData.blackWhitePhoto && (
        <img 
          src={petData.blackWhitePhoto}
          alt="Foto con blanco y negro y opacidad"
          style={styles.photoCC1BlackWhite}
        />
      )}
      
      <img 
        src="/cuerpo_cc.png" 
        alt="Cuerpo CC" 
        style={styles.cuerpoCC} 
      />
      
      <div style={styles.cc1TextLayer}>
        <div style={{...styles.textStyles.cc1Text, top: '94px', left: '318px'}}>
          {petData.apellidos}
        </div>
        
        <div style={{...styles.textStyles.cc1Text, top: '155px', left: '318px'}}>
          {petData.nombres}
        </div>
        
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '62px',
          left: '614px',
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {formatearNumeroId(petData.numeroId)}
        </div>
        
        <div style={{...styles.textStyles.cc1Text, top: '250px', left: '318px'}}>
          {getFormattedDate(petData.birthDate)}
        </div>
        
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '292px',
          left: '318px',
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {formatearLugarNacimiento(petData.birthPlace)}
        </div>
        
        <div style={{...styles.textStyles.cc1Text, top: '209px', left: '550px'}}>
          {petData.sex}
        </div>
        
        <div style={{...styles.textStyles.cc1Text, top: '209px', left: '463px'}}>
          {petData.altura}
        </div>
        
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '418px',
          left: '22%',
          transform: 'translateX(-50%)',
          fontFamily: '"Ink Free", "Segoe Script", "Comic Sans MS", cursive',
          fontWeight: '400',
          fontSize: '32px'
        }}>
          {petData.firma}
        </div>
        
        <img
          src="/marca_cc.png"
          alt="Marca CC"
          style={styles.marcaCC}
        />
        
        <img
          src="/mariposa_cc.png"
          alt="Mariposa CC"
          style={styles.mariposaCC}
        />
        
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '210px',
          left: '318px',
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          COL
        </div>
        
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '245px',
          left: '463px',
          fontSize: '20px',
          fontWeight: 'normal',
          color: 'black'
        }}>
          O+
        </div>
        
        <div style={{
          ...styles.textStyles.cc1Text,
          fontFamily: 'OCRB, monospace',
          top: '680px',
          left: '20px',
          fontSize: '20px',
          transform: 'rotate(-90deg)',
          fontWeight: 'normal',
          color: 'black'
        }}>
          002940384 {/* Cambiado */}
        </div>
        
        <div style={{
          position: 'absolute',
          fontFamily: 'OCRB, monospace',
          fontSize: '38px',
          letterSpacing: '0px',
          lineHeight: '1.1',
          bottom: '50px',
          left: '70px',
          whiteSpace: 'pre',
          zIndex: 6,
          width: '660px',
          overflow: 'hidden'
        }}>
          {`ICCOL000002940384788394<<<<<<<<<\n${formatMRZ().linea2}\n${formatMRZ().linea3}`}
        </div>
        
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '414px',
          left: '318px',
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {calcularFechaCon10Anos(petData.expeditionDate)}
        </div>
        
        <div style={{
          ...styles.textStyles.cc1Text,
          top: '354px',
          left: '318px',
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {calcularFechaExpedicion()}
        </div>
      </div>
    </div>
  );
} else {

      return (
        <div style={styles.idCardContainer}>
          <div style={styles.layeredBackground} />
          <div style={styles.grayBackground} />
          
          {petData.photo && (
  <div style={{
    position: 'absolute',
    top: '328px', // Misma posición vertical que background-gray
    left: '115px', // Misma posición horizontal que background-gray
    width: '26.9%', // Mismo ancho que background-gray
    height: '17%', // Mismo alto que background-gray
    zIndex: 3, // Debajo de watermark (zIndex: 4)
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <img 
      src={petData.photo}
      alt="Foto"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover' // Ajusta la foto al contenedor
      }}
    />
  </div>
)}

          <img src="/watermark.png" alt="Watermark" style={styles.watermark} />
          <img src="/registraduria-text.png" alt="Registraduría" style={styles.registraduriaLogo} />

          <div style={styles.content}>
            <div style={styles.textStyles.primeraVezText}>PRIMERA VEZ CC</div>
            <div style={styles.textStyles.numeroCCText}>{petData.id}</div>

            <div style={styles.textStyles.apellidosText}>
              APELLIDOS / NOMBRES
              <div style={styles.textStyles.nameText}>{petData.name || ''}</div>
            </div>

            <div style={styles.textStyles.fechaNacimientoTitleText}>
              FECHA Y LUGAR DE NACIMIENTO
              <div style={styles.textStyles.fechaText}>
                {getFormattedDate(petData.birthDate)}
              </div>
              <div style={styles.textStyles.lugarNacimientoText}>
                {petData.birthPlace}
              </div>
            </div>

            <div style={styles.textStyles.fechaExpedicionText}>
              FECHA DE EXPEDICION
              <div style={styles.textStyles.nameText}>
                {getFormattedDate(petData.expeditionDate)}
              </div>
            </div>

            <div style={styles.textStyles.sexoText}>
              SEXO
              <div style={styles.textStyles.nameText}>{petData.sex}</div>
            </div>

            <div style={styles.textStyles.lugarPreparacionText}>
              LUGAR DE PREPARACION
              <div style={styles.textStyles.nameText}>{petData.preparationPlace}</div>
            </div>

            <div style={styles.textStyles.oficinaEntregaText}>
              OFICINA DE ENTREGA
              <div style={styles.textStyles.nameText}>{petData.deliveryOffice}</div>
            </div>

            <div style={styles.validityContainer}>
              <div>ESTE COMPROBANTE ES</div>
              <div>VÁLIDO HASTA EL {getValidityDate()}</div>
            </div>

            <div style={styles.qrContainer}>
              <img 
                src="/qr-code.png" 
                alt="QR Code"
                style={{
                  width: '210px',
                  height: '210px'
                }}
              />
              <div style={styles.textStyles.idNumber}>
                {documentId}
                <br />
                {getFormattedDate(petData.expeditionDate)}
              </div>
            </div>

            <div style={styles.textStyles.firmaText}>
              {petData.firma}
            </div>
          </div>
        </div>
      );
    }
  };

  // Renderizar formulario dinámico según la opción seleccionada
  const renderForm = () => {
    if (selectedOption === 'CC-1' || selectedOption === 'CC-2') {
      // Formulario para la opción 4 (CC-1)
      return (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Apellidos</label>
            <input
              type="text"
              value={petData.apellidos}
              onChange={handleApellidosChange}
              placeholder="Ingrese apellidos"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nombres</label>
            <input
              type="text"
              value={petData.nombres}
              onChange={handleNombresChange}
              placeholder="Ingrese nombres"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Nuevo campo para Número de ID */}
          <div>
            <label className="block text-sm font-medium mb-2">Número de ID</label>
            <input
              type="text"
              value={petData.numeroId}
              onChange={handleNumeroIdChange}
              placeholder="Ingrese número de identificación"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
{/* Nuevo campo para fecha de nacimiento */}
<div>
        <label className="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
        <input
          type="date"
          value={petData.birthDate}
          onChange={(e) => setPetData({ ...petData, birthDate: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ciudad de Nacimiento</label>
            <select
              value={petData.birthPlace}
              onChange={(e) => setPetData({ ...petData, birthPlace: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {ciudadesNacimiento.map((ciudad) => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sexo</label>
            <select
              value={petData.sex}
              onChange={(e) => setPetData({ ...petData, sex: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Altura</label>
            <input
              type="text"
              value={petData.altura}
              onChange={handleAlturaChange}
              placeholder="Ingrese altura (ej: 1.75)"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Firma</label>
            <input
              type="text"
              value={petData.firma}
              onChange={handleFirmaChange}
              placeholder="Ingrese la firma"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </>
      );
    } else {
      // Formulario para las opciones 1, 2 y 3 (mantener original)
      return (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Foto de la Mascota</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPetData(prev => ({...prev, photo: reader.result}));
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nombre de la Mascota</label>
            <input
              type="text"
              onChange={handleNameChange}
              placeholder="Ingrese el nombre"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ciudad de Nacimiento</label>
            <select
              value={petData.birthPlace}
              onChange={(e) => setPetData({ ...petData, birthPlace: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {ciudadesNacimiento.map((ciudad) => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sexo</label>
            <select
              value={petData.sex}
              onChange={(e) => setPetData({ ...petData, sex: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="MASCULINO">MASCULINO</option>
              <option value="FEMENINO">FEMENINO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Firma</label>
            <input
              type="text"
              value={petData.firma}
              onChange={handleFirmaChange}
              placeholder="Ingrese la firma"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-6 mb-8">
  <h2 className="text-xl font-bold mb-6">NUEVO GENERADOR DE IDENTIFICACIÓN 2025</h2>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">Seleccione una opción</label>
      <select
        onChange={handleOptionChange}
        value={selectedOption}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Seleccione una opción</option>
        <option value="1.014.668.661">Opción 1: 1.014.668.661</option>
        <option value="1.025.537.952">Opción 2: 1.025.537.952</option>
        <option value="1.150.184.946">Opción 3: 1.150.184.946</option>
        <option value="CC-1">Opción 4: cc 1</option>
        <option value="CC-2">Opción 5: cc 2</option> {/* Nueva opción */}
      </select>
    </div>
            {/* NUEVO: cuadro para pegar el mensaje de WhatsApp */}
<div>
  <label className="block text-sm font-medium mb-2">
    Pega aquí el mensaje de WhatsApp
  </label>
  <textarea
    className="w-full p-2 border border-gray-300 rounded h-32"
    value={whatsAppText}
    onChange={(e) => setWhatsAppText(e.target.value)}
    placeholder="Pega aquí el texto completo que te envían (nombre, fecha, sexo, etc.)"
  />

  <button
    type="button"
    onClick={handleParseWhatsApp}
    className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
  >
    Rellenar datos automáticamente
  </button>
</div>



    {/* Input para la foto en la opción 4 y 5 */}
{(selectedOption === 'CC-1' || selectedOption === 'CC-2') && (
  <div>
    <label className="block text-sm font-medium mb-2">Foto</label>
    <input
      type="file"
      accept="image/*"
      className="w-full p-2 border border-gray-300 rounded"
      onChange={handlePhotoChange}
    />
  </div>
)}

          {/* Renderizar formulario dinámicamente según la opción seleccionada */}
          {selectedOption && renderForm()}

          <button
            onClick={handleDownload}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            Descargar ID
          </button>
        </div>
      </div>

      <div ref={idCardRef}>
        {renderCardContent()}
      </div>
    </div>
  );
}

export default App;