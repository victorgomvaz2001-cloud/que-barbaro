const mongoose = require("mongoose");

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const MONGO_URI = "mongodb+srv://victorgomvaz2001:EvHD1zIHC0ci0I6y@clusterklass.ovfquej.mongodb.net/que-barbaro";

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────
const categorySchema = new mongoose.Schema(
  {
    slug: String,
    nameEs: String,
    nameEn: String,
    descriptionEs: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    order: Number,
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: String,
    excerpt: String,
    author: String,
    featured: { type: Boolean, default: false },
    publishedAt: String,
    draft: { type: Boolean, default: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    coverImage: String,
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
const Blog = mongoose.model("Blog", blogSchema);

// ─── CATEGORIES (mismas que en tu colección) ─────────────────────────────────
const CATEGORIES_DATA = [
  { slug: "cortes-y-peinados", nameEs: "Cortes y peinados", nameEn: "Hair cuts and styling", order: 0 },
  { slug: "color",              nameEs: "Color",              nameEn: "Color",                 order: 1 },
  { slug: "tratamientos-capilares", nameEs: "Tratamientos capilares", nameEn: "Capilar treatments", order: 2 },
  { slug: "maquillaje",         nameEs: "Maquillaje",         nameEn: "Makeup",                order: 3 },
  { slug: "manicura",           nameEs: "Manicura",           nameEn: "Manicure",              order: 4 },
  { slug: "eventos",            nameEs: "Eventos",            nameEn: "Events",                order: 5 },
];

// ─── BLOGS POR CATEGORÍA ──────────────────────────────────────────────────────
// Imágenes de Picsum (seed determinista → misma imagen siempre)
// https://picsum.photos/seed/{seed}/1200/630
const picsumImg = (seed: string) => `https://picsum.photos/seed/${seed}/1200/630`;

const BLOGS_BY_CATEGORY = {
  "cortes-y-peinados": [
    {
      title: "Tendencias de corte para este otoño: lo que llevarán los más atrevidos",
      slug: "tendencias-corte-otono-2025",
      excerpt: "Del textured crop al wolf cut actualizado. Las propuestas que están marcando la temporada.",
      coverImage: picsumImg("haircut1"),
      publishedAt: "2025-07-05",
      content: "<p>Cada temporada trae nuevas propuestas estéticas y este otoño no es la excepción. El <strong>wolf cut</strong> evoluciona con capas más definidas, mientras el <strong>textured crop</strong> conquista a quienes buscan un look masculino moderno. Los salones apuestan por cortes que transmiten personalidad sin sacrificar versatilidad.</p><p>Además, el <strong>shag cut</strong> retorna con fuerza, adaptado a todo tipo de cabello y rostro. La clave está en la textura: volumen en la coronilla y puntas despeinadas con intención.</p>",
    },
    {
      title: "Bob clásico vs. bob asimétrico: cuál es el adecuado para ti",
      slug: "bob-clasico-vs-asimetrico",
      excerpt: "Analizamos las dos versiones del corte más icónico de la temporada para ayudarte a elegir.",
      coverImage: picsumImg("haircut2"),
      publishedAt: "2025-08-12",
      content: "<p>El <strong>bob</strong> lleva décadas reinventándose. En su versión clásica, las líneas rectas y el largo hasta la mandíbula ofrecen elegancia atemporal. La variante asimétrica, con un lado más largo, aporta dinamismo y actitud.</p><p>Para rostros ovalados ambas opciones funcionan. Si tu cara es redonda, el bob asimétrico alarga visualmente. Para caras cuadradas, el clásico suaviza los ángulos con sus líneas fluidas.</p>",
    },
    {
      title: "Pixie cut en 2025: evolución y cómo llevarlo con estilo",
      slug: "pixie-cut-2025-estilo",
      excerpt: "El corte más audaz de la temporada se renueva con texturas y acabados que sorprenden.",
      coverImage: picsumImg("haircut3"),
      publishedAt: "2025-09-01",
      content: "<p>El <strong>pixie cut</strong> no es un corte para todo el mundo, pero cuando encaja, transforma completamente. En 2025 lo vemos con <em>microflecos</em> laterales, textura en la nuca y acabados con cera mate que dan un toque urbano.</p><p>El secreto para llevarlo bien es la confianza: un pixie corto pide una actitud que lo respalde. Complementa con pendientes grandes o llamativos para equilibrar el conjunto.</p>",
    },
    {
      title: "Cortes para cabello rizado: respetar la naturaleza del pelo",
      slug: "cortes-cabello-rizado-guia",
      excerpt: "Los mejores cortes para potenciar tu rizo natural sin luchar contra él.",
      coverImage: picsumImg("haircut4"),
      publishedAt: "2025-09-18",
      content: "<p>El cabello rizado tiene sus propias reglas. Cortes como el <strong>DevaCut</strong> o el corte en seco están pensados para respetar el patrón del rizo, eliminando el exceso de volumen sin restar definición.</p><p>Evita los cortes en línea recta, que crean una silueta triangular poco favorecedora. Opta por capas largas que aligeren sin quitar cuerpo, y usa tijeras especiales para rizado que no dañen el frizz.</p>",
    },
    {
      title: "Undercut: el corte que nunca pasa de moda en hombres",
      slug: "undercut-hombres-tendencias",
      excerpt: "Versátil, atrevido y siempre vigente. Todo lo que necesitas saber sobre el undercut masculino.",
      coverImage: picsumImg("haircut5"),
      publishedAt: "2025-10-03",
      content: "<p>El <strong>undercut</strong> consiste en rapar o afeitar los laterales y la nuca, dejando volumen en la parte superior. Su versatilidad lo convierte en uno de los cortes masculinos más solicitados en peluquería.</p><p>Se puede combinar con un pompadour clásico, un quiff moderno o incluso dejado caído hacia adelante. El acabado depende del producto: cera brillante para un look pulido, o pasta mate para un estilo más casual.</p>",
    },
  ],

  "color": [
    {
      title: "Balayage vs. highlights: diferencias clave que debes conocer",
      slug: "balayage-vs-highlights-diferencias",
      excerpt: "Dos técnicas populares, resultados distintos. Te explicamos cuándo elegir cada una.",
      coverImage: picsumImg("color1"),
      publishedAt: "2025-07-20",
      content: "<p>El <strong>balayage</strong> es una técnica de pintura a mano libre que crea degradados naturales, imitando el efecto del sol. Los <strong>highlights</strong> o mechas clásicas se aplican con papel de aluminio para mayor precisión y contraste.</p><p>Si buscas un resultado natural que crezca sin línea de demarcación evidente, el balayage es tu opción. Si prefieres un cambio de color más impactante y definido, las mechas con papel dan mayor uniformidad y luminosidad.</p>",
    },
    {
      title: "Colores tendencia otoño-invierno 2025: apuesta por los tonos tierra",
      slug: "colores-tendencia-otono-invierno-2025",
      excerpt: "Del chocolate amargo al terracota cobrizo. Los tonos que dominan esta temporada.",
      coverImage: picsumImg("color2"),
      publishedAt: "2025-08-05",
      content: "<p>La temporada fría llega cargada de <strong>tonos tierra</strong>: el marrón chocolate, el castaño cobrizo y el rubio dorado oscuro lideran las solicitudes en los salones. Estos colores no solo están de moda, sino que además favorecen a una gran variedad de tonos de piel.</p><p>El <strong>bronde</strong> (entre rubio y castaño) sigue siendo uno de los más solicitados por su facilidad de mantenimiento y su efecto luminoso sin parecer artificial.</p>",
    },
    {
      title: "Tintes fantasía: cómo preparar el cabello para un color vibrante",
      slug: "tintes-fantasia-preparacion-cabello",
      excerpt: "Antes de teñirte de azul eléctrico o rosa fucsia, tu cabello necesita preparación.",
      coverImage: picsumImg("color3"),
      publishedAt: "2025-09-10",
      content: "<p>Los colores fantasía requieren una base lo más clara posible para que el pigmento se exprese al 100%. Eso significa decolorar el cabello en varias sesiones, respetando los tiempos entre tratamientos para no comprometer la estructura capilar.</p><p>Una vez alcanzado el tono base ideal (amarillo pálido o blanco), aplica el tinte de fantasía con abundante producto y déjalo actuar el tiempo recomendado. Usa champú sin sulfatos para prolongar la duración del color.</p>",
    },
    {
      title: "Cómo mantener el cabello rubio sin apagarlo",
      slug: "mantener-cabello-rubio-vibrante",
      excerpt: "Claves para que tu rubio no vire a amarillo y se mantenga luminoso entre visitas al salón.",
      coverImage: picsumImg("color4"),
      publishedAt: "2025-09-25",
      content: "<p>El mayor enemigo del rubio es el <strong>tono amarillo</strong> que aparece con el paso del tiempo. Para combatirlo, incorpora un <em>champú violeta</em> a tu rutina semanal: neutraliza los reflejos cálidos sin resecar el cabello.</p><p>Además, protege siempre el color del sol con sprays UV y evita el exceso de calor en el secado. Programa retoques cada 6-8 semanas para mantener la raíz impecable y la luminosidad uniforme.</p>",
    },
    {
      title: "Hair gloss: el tratamiento que devuelve el brillo al cabello opaco",
      slug: "hair-gloss-brillo-cabello",
      excerpt: "El secreto de los famosos para lucir un cabello brillante y saludable toda la semana.",
      coverImage: picsumImg("color5"),
      publishedAt: "2025-10-15",
      content: "<p>El <strong>hair gloss</strong> es un tratamiento semipermanente que sella la cutícula, aporta brillo y puede añadir un toque de color o reflejos. A diferencia del tinte, no penetra en el córtex, por lo que el daño es mínimo.</p><p>Ideal para cabello opaco, teñido o con frizz, el gloss dura entre 4 y 6 semanas. Puedes aplicarlo en el salón o con productos específicos en casa. El resultado inmediato es un cabello visiblemente más sano y luminoso.</p>",
    },
  ],

  "tratamientos-capilares": [
    {
      title: "Keratina vs. alisado japonés: ¿cuál es mejor para tu tipo de cabello?",
      slug: "keratina-vs-alisado-japones",
      excerpt: "Dos tratamientos alisadores con resultados diferentes. Te ayudamos a elegir el tuyo.",
      coverImage: picsumImg("tratamiento1"),
      publishedAt: "2025-07-15",
      content: "<p>La <strong>keratina</strong> es un tratamiento semipermanente que alisa, elimina el frizz y nutre el cabello. Dura entre 3 y 5 meses y permite cierta flexibilidad en el resultado (puedes ondular el cabello si quieres). El <strong>alisado japonés</strong>, en cambio, rompe los enlaces del cabello para alisarlo de forma permanente hasta que crezca nuevo cabello.</p><p>Si buscas un alisado total y permanente, el japonés es más efectivo. Si quieres control del frizz con opción a variedad de estilos, la keratina es más versátil y menos agresiva.</p>",
    },
    {
      title: "Nutrición capilar profunda: rutina de fin de semana para regenerar el cabello",
      slug: "nutricion-capilar-profunda-rutina",
      excerpt: "Una rutina de dos días para restaurar la hidratación y el brillo de tu melena.",
      coverImage: picsumImg("tratamiento2"),
      publishedAt: "2025-08-22",
      content: "<p>El cabello dañado por el calor, el tinte o el sol necesita un extra de hidratación. Una <strong>mascarilla capilar de nutrición profunda</strong> aplicada en cabello húmedo, cubierta con un gorro de calor durante 20-30 minutos, puede transformar la textura en una sola sesión.</p><p>Para maximizar el resultado, el día anterior aplica un aceite capilar en las puntas (argán, jojoba o coconut) y déjalo actuar toda la noche. El domingo, lava con champú hidratante y finaliza con un sérum sin aclarado.</p>",
    },
    {
      title: "Caída del cabello: causas y tratamientos más efectivos en 2025",
      slug: "caida-cabello-causas-tratamientos-2025",
      excerpt: "Desde el estrés hasta el déficit vitamínico: qué hay detrás de la caída y cómo frenarlo.",
      coverImage: picsumImg("tratamiento3"),
      publishedAt: "2025-09-05",
      content: "<p>La <strong>alopecia difusa</strong> o caída generalizada puede tener múltiples causas: estrés, déficit de hierro o vitamina D, cambios hormonales o dietas restrictivas. El primer paso es identificar el origen con un análisis capilar.</p><p>Los tratamientos más efectivos incluyen <em>mesoterapia capilar</em>, sueros con <strong>minoxidil</strong> o <strong>finasterida</strong> (bajo supervisión médica) y tratamientos con plasma rico en plaquetas (PRP). Complementar con una dieta rica en proteínas, zinc y vitaminas del grupo B acelera la recuperación.</p>",
    },
    {
      title: "Olaplex: ¿funciona de verdad? Análisis honesto del tratamiento estrella",
      slug: "olaplex-analisis-funciona",
      excerpt: "Desmontamos mitos y confirmamos verdades sobre el tratamiento reparador más famoso del mercado.",
      coverImage: picsumImg("tratamiento4"),
      publishedAt: "2025-09-20",
      content: "<p><strong>Olaplex</strong> actúa reparando los enlaces disulfuro rotos del cabello, los mismos que se dañan con la decoloración y el calor. Su principio activo, el <em>bis-aminopropyl diglycol dimaleate</em>, no tiene equivalente en el mercado, lo que lo hace único en su categoría.</p><p>¿Funciona? Sí, pero con matices. Olaplex repara la estructura interna del cabello, pero no reemplaza la hidratación ni la nutrición exterior. Para mejores resultados, combínalo con mascarillas hidratantes y evita el exceso de calor en el styling.</p>",
    },
    {
      title: "Champú sólido vs. champú líquido: ventajas, mitos y cómo elegir",
      slug: "champu-solido-vs-liquido-guia",
      excerpt: "¿El champú sólido limpia igual? ¿Es realmente más sostenible? Respondemos todas tus dudas.",
      coverImage: picsumImg("tratamiento5"),
      publishedAt: "2025-10-08",
      content: "<p>El <strong>champú sólido</strong> ha ganado popularidad como alternativa sostenible: menos plástico, mayor concentración de activos y mayor durabilidad por uso. Sin embargo, su formulación varía mucho entre marcas: algunos contienen sulfatos igual que los líquidos, y otros están basados en tensioactivos suaves como el <em>sodium cocoyl isethionate</em>.</p><p>Para cabello fino o graso, el sólido funciona muy bien. Para cabello teñido o muy seco, asegúrate de que la fórmula sea libre de sulfatos y contenga aceites o butters nutritivos. La clave está en leer el INCI, no en el formato.</p>",
    },
  ],

  "maquillaje": [
    {
      title: "Maquillaje 'no-makeup': cómo conseguir la piel perfecta sin que se note",
      slug: "maquillaje-no-makeup-look-natural",
      excerpt: "La tendencia que domina las redes: parecer que no llevas nada cuando en realidad está todo calculado.",
      coverImage: picsumImg("makeup1"),
      publishedAt: "2025-07-10",
      content: "<p>El look <strong>no-makeup makeup</strong> busca realzar las facciones sin parecer maquillado. La base debe ser ligera (BB cream o base satiné en tono exacto), el corrector aplicado solo donde hace falta y los labios en un nude que combine con el tono de piel natural.</p><p>La clave está en la preparación: una buena hidratación, primer y SPF dan la base perfecta. Después, un toque de blush cremoso en las mejillas y un poco de mascara en las pestañas superiores completan el look en minutos.</p>",
    },
    {
      title: "Delineado cat-eye: técnica paso a paso para principiantes",
      slug: "delineado-cat-eye-tutorial",
      excerpt: "Domina el trazo más icónico del maquillaje con estos trucos que nadie te había contado.",
      coverImage: picsumImg("makeup2"),
      publishedAt: "2025-08-03",
      content: "<p>El <strong>cat-eye</strong> intimida, pero con la técnica correcta es más sencillo de lo que parece. Empieza marcando el ángulo exterior del ojo con pequeños trazos hacia arriba, siguiendo la dirección natural de tu párpado inferior. Luego rellena hacia el lagrimal.</p><p>Truco profesional: usa cinta adhesiva de papel en el ángulo exterior como guía para conseguir un trazo simétrico. El delineador en gel con pincel fino da más control que el líquido con punta de fieltro para principiantes.</p>",
    },
    {
      title: "Labiales de larga duración: los 5 mejores de 2025 probados",
      slug: "labiales-larga-duracion-2025",
      excerpt: "Probamos los labiales más resistentes del mercado. Estos son nuestros favoritos tras 8 horas de uso.",
      coverImage: picsumImg("makeup3"),
      publishedAt: "2025-09-14",
      content: "<p>Un buen labial de larga duración debe aguantar comidas, bebidas y horas sin necesitar retoques. En 2025 destacan fórmulas <em>lip stain</em> con acabado satinado que combinan color duradero con hidratación, superando a los clásicos líquidos mate que resecan.</p><p>Nuestra recomendación: exfolia los labios la noche anterior, aplica un lip liner en toda la superficie antes del labial, y finaliza con un toque de polvo traslúcido sobre papel de seda para fijar el color hasta 10 horas.</p>",
    },
    {
      title: "Contorno facial: errores comunes que te hacen parecer artificial",
      slug: "contorno-facial-errores-comunes",
      excerpt: "El contouring mal aplicado puede arruinar cualquier look. Aprende a hacerlo de forma natural.",
      coverImage: picsumImg("makeup4"),
      publishedAt: "2025-09-28",
      content: "<p>El mayor error en el <strong>contouring</strong> es usar un producto demasiado oscuro o con base gris, que crea sombras antinatural. El tono de contorno debe ser un marrón cálido, dos tonos más oscuro que tu base, siempre sin gris.</p><p>Otro error frecuente es aplicarlo en rayas visibles sin difuminar. La clave es difuminar hacia arriba en movimientos circulares hasta que no haya línea de demarcación. El contorno bien hecho no se ve, solo se percibe.</p>",
    },
    {
      title: "Rutina de maquillaje para pieles maduras: hidratación y luminosidad ante todo",
      slug: "maquillaje-pieles-maduras-rutina",
      excerpt: "Los productos y técnicas que mejor funcionan para pieles de más de 40 años.",
      coverImage: picsumImg("makeup5"),
      publishedAt: "2025-10-20",
      content: "<p>Las pieles maduras necesitan productos que potencien la luminosidad, no que acentúen las líneas de expresión. Evita los polvos compactos en exceso (marcan las arrugas) y apuesta por bases fluidas con acabado satinado que reflejan la luz.</p><p>El corrector en crema, aplicado en tapping suave con los dedos, funciona mejor que el líquido en pieles secas o maduras. Para los ojos, el lápiz beige en la línea de agua hace que parezcan más abiertos y descansados sin esfuerzo.</p>",
    },
  ],

  "manicura": [
    {
      title: "Manicura semipermanente: guía completa para que dure más de 3 semanas",
      slug: "manicura-semipermanente-guia-durabilidad",
      excerpt: "Todos los pasos y productos clave para que tu esmalte de gel no se despegue antes de tiempo.",
      coverImage: picsumImg("manicura1"),
      publishedAt: "2025-07-25",
      content: "<p>La <strong>manicura semipermanente</strong> puede durar hasta 4 semanas si el proceso de preparación es correcto. Los errores más comunes ocurren antes de aplicar el esmalte: no limpiar bien la placa ungueal con desengrasante o dejar humedad en la uña antes del gel base.</p><p>El orden correcto: lima, empuja cutículas, bónder (en uñas frágiles), base gel, color (2 capas finas), top coat. Cada capa debe curarse el tiempo correcto en la lámpara UV/LED. Un top coat sin limpieza da más brillo y durabilidad.</p>",
    },
    {
      title: "Nail art tendencia: las decoraciones que arrasan este otoño",
      slug: "nail-art-tendencias-otono-2025",
      excerpt: "Desde el efecto aurora hasta los diseños minimalistas con líneas doradas.",
      coverImage: picsumImg("manicura2"),
      publishedAt: "2025-08-18",
      content: "<p>El <strong>efecto aurora</strong> o nails cromadas sigue siendo furor: un top coat iridiscente sobre base nude o blanca crea un efecto holográfico que cambia con la luz. Es el preferido para eventos y fotografías.</p><p>Para quienes prefieren algo más sutil, los <em>thin line nail art</em> con nail liner dorado o plateado sobre base monocromática ofrecen elegancia minimalista. Geométricos, ondas o líneas asimétricas: simples pero muy impactantes.</p>",
    },
    {
      title: "Cómo cuidar las cutículas: rutina semanal para uñas perfectas",
      slug: "cuidado-cuticulas-rutina-semanal",
      excerpt: "Las cutículas bien cuidadas hacen que cualquier manicura luzca el doble de bien.",
      coverImage: picsumImg("manicura3"),
      publishedAt: "2025-09-08",
      content: "<p>Las <strong>cutículas</strong> son una barrera protectora natural: nunca las cortes en exceso. El objetivo es empujarlas suavemente hacia atrás tras el baño, cuando están ablandadas, usando un palito de naranjo. Corta solo el exceso de piel muerta con alicate de cutículas, con cuidado de no llegar a tejido vivo.</p><p>Para una rutina semanal, aplica aceite de cutículas (jojoba o vitamina E) cada noche con un ligero masaje circular. En 2-3 semanas notarás cutículas más flexibles y uñas de aspecto más cuidado.</p>",
    },
    {
      title: "Uñas acrílicas vs. uñas de gel: diferencias y cuál elegir",
      slug: "unas-acrilicas-vs-gel-diferencias",
      excerpt: "Te explicamos las diferencias reales entre ambas técnicas para que elijas con información.",
      coverImage: picsumImg("manicura4"),
      publishedAt: "2025-09-22",
      content: "<p>Las <strong>uñas acrílicas</strong> se crean mezclando polvo acrílico con monómero líquido, formando una extensión dura y resistente. Las <strong>uñas de gel</strong> se construyen con gel UV/LED que es más flexible y con mayor brillo natural.</p><p>El gel es menos dañino para la uña natural, más ligero y da un resultado más estético. Las acrílicas duran más, son más económicas y más fáciles de reparar si se rompen. Si buscas natural y cuidado, elige gel. Si priorizas durabilidad y presupuesto, las acrílicas son tu opción.</p>",
    },
    {
      title: "Pedicura en casa: cómo tener los pies perfectos sin ir al salón",
      slug: "pedicura-casa-guia-completa",
      excerpt: "Pasos, herramientas y productos para una pedicura profesional en la comodidad de tu hogar.",
      coverImage: picsumImg("manicura5"),
      publishedAt: "2025-10-12",
      content: "<p>Una buena <strong>pedicura en casa</strong> empieza con un remojo de 10-15 minutos en agua tibia con sal gruesa o aceites esenciales. Esto ablanda la piel y facilita la eliminación de durezas con lima pódica o piedra pómez.</p><p>Corta las uñas en línea recta (nunca en curva, para prevenir uñas encarnadas), empuja cutículas con palito de naranjo y finaliza con una crema de pies nutritiva. Si aplicas esmalte, usa base protectora para evitar que el pigmento amarillee la uña natural.</p>",
    },
  ],

  "eventos": [
    {
      title: "Maquillaje de boda: cómo conseguir un look que dure todo el día",
      slug: "maquillaje-boda-larga-duracion",
      excerpt: "Claves para un maquillaje de novia que aguante desde la ceremonia hasta la última canción.",
      coverImage: picsumImg("evento1"),
      publishedAt: "2025-07-08",
      content: "<p>El maquillaje de boda necesita resistir calor, lágrimas y horas de baile. La preparación es fundamental: una buena hidratación la noche anterior y una base con SPF y primer el día de son imprescindibles. Fija cada capa con spray fijador antes de continuar.</p><p>Para los ojos, elige sombras en polvo sobre base de sombra cream y un delineador waterproof. El labial debe ser semipermanente o fijado con técnica de polvo y papel de seda. Lleva productos de retoque en el bolso: polvo traslúcido, corrector y labial.</p>",
    },
    {
      title: "Peinados de madrina: los looks más elegantes para la temporada de bodas",
      slug: "peinados-madrina-temporada-bodas-2025",
      excerpt: "Recogidos, semirecogidos y ondas perfectas para brillar sin eclipsar a la novia.",
      coverImage: picsumImg("evento2"),
      publishedAt: "2025-08-01",
      content: "<p>Como madrina, el objetivo es lucir elegante sin robar protagonismo. Los <strong>moños bajos</strong> con trenzas laterales o flores naturales son una apuesta segura para bodas diurnas al aire libre. Para eventos nocturnos, las <em>ondas Hollywood</em> o el recogido alto con volumen aportan glamour sin exceso.</p><p>Evita los peinados demasiado elaborados que compitan con el de la novia. La regla de oro: cuanto más sencillo el vestido, más elaborado puede ser el peinado, y viceversa.</p>",
    },
    {
      title: "Look de Nochevieja: tendencias de maquillaje y peinado para fin de año",
      slug: "look-nochevieja-tendencias-maquillaje-peinado",
      excerpt: "Brillo, drama y personalidad. Así se maquilla y peina la noche más especial del año.",
      coverImage: picsumImg("evento3"),
      publishedAt: "2025-11-15",
      content: "<p>Nochevieja es la excusa perfecta para atreverse con algo que no llevarías cualquier día. El <strong>glitter gráfico</strong> en los ojos, los labios metálicos y los iluminadores en polvo de partículas grandes son protagonistas esta temporada.</p><p>Para el peinado, los <em>rhinestone hair pins</em> (horquillas con brillantes) convierten un moño o una melena suelta en un look de alfombra roja. Recoge un lado con clips joya o deja la melena semirrecogida con ondas amplias y un accesorio dorado.</p>",
    },
    {
      title: "Comuniones 2025: peinados infantiles y de madres que marcan tendencia",
      slug: "comuniones-2025-peinados-tendencias",
      excerpt: "Ideas para que tanto la niña como la mamá lleguen perfectas al gran día.",
      coverImage: picsumImg("evento4"),
      publishedAt: "2025-09-30",
      content: "<p>Para las comuniones de 2025 se imponen los peinados naturales sobre los excesivamente trabajados. En niñas, las <strong>trenzas con flores</strong> entretejidas, los semirecogidos con volumen y las ondas suaves sustituyen a los rizos marcados de años anteriores.</p><p>Las madres apuestan por moños estructurados con algún detalle joya o semirecogidos con ondas. El truco para que el peinado aguante toda la jornada: aplica laca de fijación media antes del acabado final y sella con laca brillante suave.</p>",
    },
    {
      title: "Beauty prep para una entrevista de trabajo: confianza desde el primer vistazo",
      slug: "beauty-prep-entrevista-trabajo",
      excerpt: "Un look pulido y natural para causar una primera impresión impecable en tu próxima entrevista.",
      coverImage: picsumImg("evento5"),
      publishedAt: "2025-10-25",
      content: "<p>En una entrevista de trabajo, el objetivo del maquillaje y el peinado es proyectar <strong>confianza y profesionalidad</strong> sin distracciones. Apuesta por una base de cobertura media que unifique sin enmascarar, cejas bien definidas (son el marco del rostro) y un labial nude o rosa natural.</p><p>El cabello debe estar limpio y ordenado: un recogido pulido o una melena lisa o con ondas suaves funcionan en todos los sectores. Evita accesorios excesivos o colores de cabello muy llamativos a menos que trabajar en un entorno creativo donde sea lo esperado.</p>",
    },
  ],
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Conectado a MongoDB:", MONGO_URI);

  // 1. Upsert categorías
  const categoryMap: Record<string, import("mongoose").Types.ObjectId> = {};
  for (const catData of CATEGORIES_DATA) {
    const cat = await Category.findOneAndUpdate(
      { slug: catData.slug },
      { $setOnInsert: catData },
      { upsert: true, new: true }
    );
    categoryMap[catData.slug] = cat._id;
    console.log(`📁 Categoría: ${catData.nameEs} → ${cat._id}`);
  }

  // 2. Insertar blogs
  let created = 0;
  let skipped = 0;
  for (const [categorySlug, blogs] of Object.entries(BLOGS_BY_CATEGORY)) {
    const categoryId = categoryMap[categorySlug];
    if (!categoryId) {
      console.warn(`⚠️  No se encontró categoría con slug: ${categorySlug}`);
      continue;
    }
    for (const blogData of blogs) {
      const exists = await Blog.findOne({ slug: blogData.slug });
      if (exists) {
        console.log(`⏭️  Skipped (ya existe): ${blogData.slug}`);
        skipped++;
        continue;
      }
      await Blog.create({
        ...blogData,
        category: categoryId,
        draft: false,
        featured: false,
        author: "Equipo Editorial",
      });
      console.log(`✍️  Creado: ${blogData.title}`);
      created++;
    }
  }

  console.log(`\n🎉 Seed completado: ${created} blogs creados, ${skipped} omitidos.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
