const userName = document.getElementById("name");
const userN = document.getElementById("id");
const CertificateID = document.getElementById("IdC");
const submitBtn = document.getElementById("submitBtn");
const { PDFDocument, rgb, degrees } = PDFLib;

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", () => {
  const nameVal = capitalize(userName.value);
  const idVal = capitalize(userN.value);

  if (nameVal.trim() !== "" && idVal.trim() !== "" && userName.checkValidity() && userN.checkValidity()) {
    generatePDF(nameVal, idVal);
  } else {
    userName.reportValidity();
    userN.reportValidity();
  }
});

const generatePDF = async (name, id) => {
  const existingPdfBytes = await fetch("./Certificado.pdf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = await fetch("./CenturyGothic.ttf").then((res) =>
    res.arrayBuffer()
  );

  const CenturyGothic = await pdfDoc.embedFont(fontBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const textSize = 30;
  const pageWidth = firstPage.getWidth();
  const pageHeight = firstPage.getHeight();

  const nameTextWidth = CenturyGothic.widthOfTextAtSize(name, textSize);
  const nameTextHeight = CenturyGothic.widthOfTextAtSize(name, textSize);
  const idTextWidth = CenturyGothic.widthOfTextAtSize(id, textSize);
  const idTextHeight = CenturyGothic.widthOfTextAtSize(id, textSize);

  const IdC = generateUniqueIdC();

  const idCTextWidth = CenturyGothic.widthOfTextAtSize(IdC, textSize); 

  const totalTextWidth = Math.max(nameTextWidth, idTextWidth); 
  const totalTextHeight = Math.max(nameTextHeight, idTextHeight);
  const centerX = (pageWidth - totalTextWidth) / 2;
  const centerY = (pageHeight - totalTextHeight) / 2;

  firstPage.drawText(name, {
    x: centerX,
    y: 280,
    size: textSize,
  });

  firstPage.drawText(id, {
    x: 330,
    y: 245,
    size: 15,
  });

  firstPage.drawText(IdC, {
    x: 48,
    y: 75,
    size: 12,
    color: rgb(68/255, 124/255, 66/255), 
  });

  const pdfBytes = await pdfDoc.save();
  console.log("Certificado Creado");
  var file = new File(
    [pdfBytes], "Talleristas", {
      type: "application/pdf;charset=utf-8",
    }
  );
  saveAs(file);
};

const generateUniqueIdC = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const idLength = 20; 
  let id = "ID único del certificado: ";
  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
};
