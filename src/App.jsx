import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ciudadesNacimiento } from '../ciudades.js';

const styles = {
  idCardContainer: {
    width: '892px',
    height: '1770px',
    position: 'relative',
    overflow: 'hidden'
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
    }
  }
};



function App() {
  const idCardRef = useRef(null);
  const [documentId, setDocumentId] = useState('851454622');
  const [petData, setPetData] = useState({
    name: '',
    birthDate: '',
    birthPlace: 'BOGOTA D.C - CUNDINAMARCA',
    sex: 'MASCULINO',
    preparationPlace: 'BOGOTA D.C - ANTONIO NARIÑO',
    deliveryOffice: 'BOGOTA D.C - ANTONIO NARIÑO',
    id: '1.016.834.229',
    photo: null,
    expeditionDate: new Date().toISOString().split('T')[0],
    firma: 'Firma'
  });

  const options = [
    {
      id: '1.025.533.107',
      birthDate: '2007-02-15',
      expeditionDate: '2025-02-19',
      preparationPlace: 'BOGOTA D.C - ANTONIO NARIÑO',
      deliveryOffice: 'BOGOTA D.C - ANTONIO NARIÑO',
      qrNumber: '8514541622'
    },
    {
      id: '1.011.323.064',
      birthDate: '2007-02-10',
      expeditionDate: '2025-02-13',
      preparationPlace: 'BOGOTA D.C - SUBA NIZA',
      deliveryOffice: 'BOGOTA D.C - SUBA NIZA',
      qrNumber: '8514474883'
    },
    {
      id: '1.141.515.448',
      birthDate: '2007-02-03',
      expeditionDate: '2025-02-08',
      preparationPlace: 'BOGOTA D.C - SUBA NIZA',
      deliveryOffice: 'BOGOTA D.C - SUBA NIZA',
      qrNumber: '8514436465'
    }
  ];

  const handleOptionChange = (e) => {
    const selectedOption = options.find(opt => opt.id === e.target.value);
    if (selectedOption) {
      setPetData({
        ...petData,
        id: selectedOption.id,
        birthDate: selectedOption.birthDate,
        expeditionDate: selectedOption.expeditionDate,
        preparationPlace: selectedOption.preparationPlace,
        deliveryOffice: selectedOption.deliveryOffice
      });
      setDocumentId(selectedOption.qrNumber);
    }
  };

  const handleNameChange = (e) => {
    const fullName = e.target.value.toUpperCase();
    const nameParts = fullName.split(' ');
    
    if (nameParts.length >= 3) {
      // Los dos primeros elementos son apellidos, el resto son nombres
      const apellidos = nameParts.slice(0, 2);
      const nombres = nameParts.slice(2);
      
      // Reorganizar para que los apellidos aparezcan en orden inverso
      const apellidosOrdenados = apellidos.reverse().join(' ');
      const nombresOrdenados = nombres.join(' ');
      
      setPetData(prev => ({
        ...prev,
        name: apellidosOrdenados + '\n' + nombresOrdenados
      }));
    } else {
      setPetData(prev => ({...prev, name: fullName}));
    }
  };

  const handleFirmaChange = (e) => {
    setPetData({ ...petData, firma: e.target.value });
  };

  const getFormattedDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const offset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - offset);
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return `${String(localDate.getDate()).padStart(2, '0')}-${months[localDate.getMonth()]}-${localDate.getFullYear()}`;
  };

  const getValidityDate = () => {
    if (!petData.expeditionDate) return '';
    const expDate = new Date(petData.expeditionDate);
    const validityDate = new Date(expDate);
    validityDate.setMonth(validityDate.getMonth() + 6);
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return `${String(validityDate.getDate()).padStart(2, '0')}-${months[validityDate.getMonth()]}-${validityDate.getFullYear()}`;
  };

  const handleDownload = async () => {
    if (idCardRef.current) {
      try {
        const canvas = await html2canvas(idCardRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
          backgroundColor: '#ffffff',
          width: 892,
          height: 1770
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
  
        // Determinamos el nombre del archivo según el ID
        const cleanId = petData.id.replace(/\./g, ''); // Removemos los puntos del ID
        let fileName;
        switch (cleanId) {
          case '1025533107':
            fileName = 'Comprobante de documento en trÃ¡mite 1025533107';
            break;
          case '1011323064':
            fileName = 'Comprobante de documento en trÃ¡mite 1011323064';
            break;
          case '1141515448':
            fileName = 'Comprobante de documento en trÃ¡mite 1141515448';
            break;
          default:
            fileName = 'documento';
        }
  
        pdf.save(`${fileName}.pdf`);
      } catch (error) {
        console.error('Error al generar PDF:', error);
      }
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
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione una opción</option>
              <option value="1.025.533.107">Opción 1: 1.025.533.107</option>
              <option value="1.011.323.064">Opción 2: 1.011.323.064</option>
              <option value="1.141.515.448">Opción 3: 1.141.515.448</option>
            </select>
          </div>

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

          <button
            onClick={handleDownload}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            Descargar ID
          </button>
        </div>
      </div>

      <div ref={idCardRef} style={styles.idCardContainer}>
        <div style={styles.layeredBackground} />
        <div style={styles.grayBackground} />
        
        {petData.photo && (
          <div style={styles.photoContainer}>
            <img 
              src={petData.photo}
              alt="Mascota"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
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
    </div>
  );
}

export default App;