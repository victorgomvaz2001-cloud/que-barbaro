import 'dotenv/config'
import mongoose from 'mongoose'
import { Blog } from '../models/Blog.model'
import { env } from '../config/env'

const AUTHOR = 'Qué Bárbaro'
const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'

const posts = [
  // ── 1. Cuidado capilar ────────────────────────────────────────────────────
  {
    title: 'Keratin Infusion vs Softy Mood: ¿cuál es el tratamiento que necesitas?',
    slug: 'keratin-infusion-vs-softy-mood',
    excerpt: 'Dos tratamientos muy diferentes para objetivos parecidos. Te ayudamos a entender cuál encaja mejor con tu cabello y tu rutina.',
    category: 'Cuidado capilar',
    publishedAt: '2025-07-10',
    featured: false,
    image: `${S3}/keratin.webp`,
    content: `
<p>Cuando alguien viene al salón con el cabello encrespado, difícil de manejar o simplemente sin vida, la conversación suele derivar en tratamientos. Y dos de los que más preguntamos en Qué Bárbaro son el <strong>Keratin Infusion</strong> y el <strong>Softy Mood</strong>. Los dos son de la línea GOA Organics. Los dos mejoran el cabello. Pero no son lo mismo, y elegir mal puede significar gastar dinero en algo que no era lo que necesitabas.</p>

<h2>Qué hace el Keratin Infusion</h2>
<p>El Keratin Infusion trabaja sobre la fibra capilar desde dentro. Su objetivo principal es <strong>alisar, suavizar y reducir el encrespamiento</strong> de forma progresiva. No es un alisado permanente agresivo. Es un tratamiento que se aplica con calor y que va dejando el cabello más manejable, más brillante y con mucho menos frizz en cada lavado.</p>
<p>Es especialmente útil para cabellos que tienen dificultad de secado, que se esponjan con la humedad o que requieren mucho tiempo de peinado. Después del tratamiento, muchos clientes nos dicen que su cabello por fin les obedece.</p>

<h2>Qué hace el Softy Mood</h2>
<p>El Softy Mood es otro animal. Aquí el objetivo no es alisar ni controlar: es <strong>devolver la elasticidad, el tacto sedoso y la sensación de cabello sano</strong>. Es un tratamiento de hidratación profunda que trabaja especialmente bien en cabellos secos, apagados o castigados por el color o el calor.</p>
<p>Después del Softy Mood, el cabello no queda "liso". Queda suave, con movimiento natural, con brillo y con esa sensación de que acabas de lavártelo aunque lleves horas fuera. Muchos clientes lo definen como "cabello de anuncio".</p>

<h2>¿Cuál te conviene a ti?</h2>
<p>La respuesta rápida es esta: si tu problema es el <strong>encrespamiento y la falta de manejabilidad</strong>, el Keratin Infusion. Si tu problema es la <strong>sequedad, la falta de brillo o el cabello dañado</strong>, el Softy Mood.</p>
<p>Dicho esto, hay cabellos que necesitan los dos, y hay momentos del año en que uno tiene más sentido que el otro. En el salón siempre hacemos una consulta previa para entender qué necesita tu cabello antes de recomendar nada.</p>

<h2>¿Con qué frecuencia hay que hacerlos?</h2>
<p>El Keratin Infusion suele mantenerse entre 6 y 10 semanas dependiendo del tipo de cabello y de la rutina de lavado. El Softy Mood tiene un efecto más inmediato pero que también va desapareciendo con los lavados, por lo que se puede repetir con más frecuencia sin problema.</p>
<p>Lo importante es entender que estos tratamientos no son una solución permanente: son un complemento a una buena rutina de cuidado en casa. Y en eso también podemos orientarte cuando vengas al salón.</p>
    `.trim(),
  },

  // ── 2. Coloración ────────────────────────────────────────────────────────
  {
    title: 'Balayage: qué es y por qué sigue siendo la técnica más solicitada',
    slug: 'balayage-que-es-y-por-que-funciona',
    excerpt: 'El balayage lleva años siendo el favorito de muchos clientes. Te explicamos por qué, y cuándo es la mejor opción para tu cabello.',
    category: 'Coloración',
    publishedAt: '2025-07-17',
    featured: false,
    image: `${S3}/balayagebrasil.webp`,
    content: `
<p>Si hay una técnica que lleva años resistiendo el paso del tiempo y los cambios de tendencia, esa es el balayage. No es una moda. Es una forma de entender el color que se adapta a casi cualquier persona, cualquier tipo de cabello y cualquier tono base. Por eso sigue siendo, de lejos, la técnica más solicitada en Qué Bárbaro.</p>

<h2>Qué es exactamente el balayage</h2>
<p>Balayage viene del francés y significa "barrer". El nombre describe la técnica: el colorista aplica el decolorante o el color con un movimiento de barrido sobre el cabello, sin papel de aluminio, creando transiciones suaves y naturales entre el tono de la raíz y las puntas.</p>
<p>El resultado es una iluminación que imita lo que hace el sol de forma natural: más luz en las zonas superiores y en las puntas, con una raíz más oscura que crece de forma discreta. Nada de líneas de demarcación. Nada de raíces que "quedan mal" a las cuatro semanas.</p>

<h2>Por qué funciona tan bien</h2>
<p>Hay varios motivos por los que el balayage sigue siendo tan popular:</p>
<ul>
  <li><strong>Es de bajo mantenimiento.</strong> La raíz no necesita retocarse cada pocas semanas porque la transición es gradual y natural.</li>
  <li><strong>Se personaliza completamente.</strong> Puedes hacerlo más discreto o más intenso, más cálido o más frío, según lo que busques.</li>
  <li><strong>Favorece a casi todo el mundo.</strong> Funciona en rubias, morenas, pelirrojas. Se adapta al tono de piel y a los rasgos de cada persona.</li>
  <li><strong>El cabello queda en mejor estado.</strong> Al no aplicar el producto en toda la longitud, el daño es menor que en otras técnicas de coloración global.</li>
</ul>

<h2>Balayage estilo brasileño vs balayage rubio</h2>
<p>En Qué Bárbaro trabajamos dos estilos diferenciados. El <strong>Balayage Estilo Brasileño</strong> busca ese efecto de cabello iluminado por el sol: transiciones muy suaves, resultado muy natural, tonos cálidos y sin contraste brusco. El <strong>Balayage Rubio Deslumbrante</strong> va a otro registro: decoloración más controlada, matización precisa, para quienes quieren un rubio que brille pero que no parezca artificial.</p>
<p>Cuál te conviene depende de tu tono de base, de lo que quieras cambiar y de cuánto mantenimiento estás dispuesta a darle. Esa conversación la tenemos siempre antes de empezar.</p>

<h2>¿Cuánto dura y cómo se mantiene?</h2>
<p>Un balayage bien hecho puede durar entre 3 y 6 meses sin necesidad de retoque, dependiendo de la intensidad del tratamiento y de cómo lo cuides en casa. Lo más importante es usar champú para cabello con color, evitar el lavado diario y proteger el cabello del calor. El resto es muy sencillo.</p>
    `.trim(),
  },

  // ── 3. Rizos y método curly ───────────────────────────────────────────────
  {
    title: 'Método curly: principios básicos para empezar sin perderse',
    slug: 'metodo-curly-principios-basicos',
    excerpt: 'El método curly tiene mucha información en internet, no toda útil. Aquí va lo esencial para empezar con buen criterio.',
    category: 'Rizos y método curly',
    publishedAt: '2025-07-24',
    featured: false,
    image: `${S3}/metodocurly.webp`,
    content: `
<p>Si tienes el cabello rizado o con ondas y llevas tiempo oyendo hablar del método curly, probablemente también hayas intentado buscarlo en internet y hayas acabado más confundida que al principio. Hay demasiada información, mucha contradicción y un nivel de detalle que puede resultar abrumador para quien empieza. Este artículo va de lo esencial: los principios reales que hacen que el método funcione, sin más ruido del necesario.</p>

<h2>Qué es el método curly (de verdad)</h2>
<p>El método curly es una forma de cuidar el cabello rizado que parte de una idea sencilla: el cabello rizado tiene necesidades diferentes al liso. Es más seco por naturaleza, porque el sebo que produce el cuero cabelludo recorre peor la forma helicoidal del rizo. Necesita más hidratación, menos sulfatos agresivos y mucho menos calor del que estamos acostumbrados a aplicarle.</p>
<p>A partir de ahí, el método organiza una rutina de lavado, hidratación y secado pensada específicamente para mantener el rizo definido, sin frizz y con salud.</p>

<h2>Los tres principios que importan</h2>
<p>Si hay que quedarse con algo, es esto:</p>
<ol>
  <li><strong>Elimina los sulfatos agresivos.</strong> Los champús convencionales limpian demasiado y dejan el cabello seco. Busca productos sin sulfatos como SLS o SLES, o úsalos muy puntualmente.</li>
  <li><strong>Hidrata en cada lavado.</strong> El acondicionador no es opcional en el cabello rizado. Es el paso más importante. Aplícalo con generosidad, peina con él y enjuaga sin frotar.</li>
  <li><strong>No toques el rizo mientras seca.</strong> El frizz no viene solo del producto. Viene de manipular el cabello húmedo. Una vez que has definido el rizo, déjalo secar solo o usa difusor a temperatura baja.</li>
</ol>

<h2>El corte importa tanto como la rutina</h2>
<p>Uno de los errores más comunes al empezar con el método curly es cambiar toda la rutina de productos sin cambiar el corte. Y el corte, en cabello rizado, lo es casi todo. Un corte convencional en seco, en línea recta, aplana el rizo y le quita movimiento. La <strong>Danza de Rizos</strong>, la técnica que ofrecemos en Qué Bárbaro, se hace en mojado y respeta la forma natural de cada rizo. El resultado es completamente diferente.</p>

<h2>Por dónde empezar</h2>
<p>No hace falta tirarlo todo por la borda el primer día. Lo más sensato es empezar por el corte, luego cambiar el champú y el acondicionador, y a partir de ahí ir ajustando la rutina según cómo responde tu cabello. Cada rizo es diferente y lo que funciona a una persona puede no funcionar a otra. La paciencia forma parte del método.</p>
<p>Si tienes dudas o quieres empezar con el pie derecho, pasa por el salón. Hacemos una consulta antes del corte para entender tu patrón de rizo y orientarte sobre qué tiene más sentido para ti.</p>
    `.trim(),
  },

  // ── 4. Tendencias ─────────────────────────────────────────────────────────
  {
    title: 'Cortes de cabello que están marcando este año',
    slug: 'cortes-de-cabello-tendencias-2025',
    excerpt: 'Repasamos los cortes que más estamos viendo en el salón y en la calle, con una mirada realista sobre cuáles de verdad funcionan.',
    category: 'Tendencias',
    publishedAt: '2025-08-01',
    featured: false,
    image: `${S3}/cortediseño.webp`,
    content: `
<p>Cada año hay una lista de cortes "de tendencia" que circula por redes y revistas. La mayoría son variaciones de lo mismo con nombres distintos. Lo que de verdad nos interesa en Qué Bárbaro no es seguir la tendencia por seguirla, sino entender qué está funcionando realmente y por qué. Esto es lo que más estamos viendo este año, con una mirada honesta.</p>

<h2>El bob en todas sus versiones</h2>
<p>El bob no muere. Y tiene sentido: es versátil, tiene decenas de variantes y funciona en casi todos los tipos de cabello y de cara. Lo que estamos viendo más este año es el <strong>bob texturizado</strong>, con puntas irregulares y movimiento, lejos de la línea recta perfecta. También el <strong>bob asimétrico</strong>, con un lado ligeramente más largo que el otro. Ambos funcionan especialmente bien en cabellos con algo de volumen natural.</p>

<h2>El corte de diseño personalizado</h2>
<p>Cada vez más clientes vienen al salón con una idea clara: quieren un corte que les favorezca a ellos, no el que está de moda. El <strong>Artístico Design</strong> que trabajamos en Qué Bárbaro responde exactamente a eso: un corte avanzado y completamente personalizado que busca una forma que te favorezca, te identifique y que funcione en el día a día sin esfuerzo. No hay dos cortes iguales.</p>

<h2>El regreso del flequillo</h2>
<p>El flequillo lleva un par de temporadas volviendo con fuerza. Pero no es el flequillo de siempre. El que más vemos ahora es el <strong>flequillo cortina</strong>, partido en el centro y con caída natural hacia los lados, y el <strong>flequillo texturizado</strong>, con puntas abiertas y poco peso. Antes de pedirlo, vale la pena hablar con tu estilista: el flequillo que queda bien depende mucho de la forma de tu cara y de tu tipo de cabello.</p>

<h2>Las capas con movimiento</h2>
<p>Las capas vuelven en un formato muy diferente al de hace años. Nada de capas en escalera muy marcadas. Lo que funciona ahora son las <strong>capas suaves y largas</strong> que dan movimiento sin restar longitud de forma evidente. Funcionan especialmente bien para dar vida a cabellos lisos que tienden a aplastarse o para suavizar el peso en cabellos muy largos.</p>

<h2>Lo que une a todos estos cortes</h2>
<p>Hay una cosa en común: todos los cortes que están funcionando ahora tienen una dirección clara hacia lo <strong>natural y lo llevable</strong>. Nada de estructuras rígidas que requieren media hora de secado diario. La tendencia real es el corte que te hace quedar bien también los días en los que no te arreglas demasiado. Eso es lo que buscamos cuando trabajamos contigo en el salón.</p>
    `.trim(),
  },

  // ── 5. Eventos y ocasiones especiales ─────────────────────────────────────
  {
    title: 'Looks de novia: cómo preparar el cabello para el día más importante',
    slug: 'looks-de-novia-preparacion-capilar',
    excerpt: 'El día de la boda el cabello tiene que estar perfecto, y eso empieza mucho antes. Te contamos cómo planificarlo bien desde el salón.',
    category: 'Eventos y ocasiones especiales',
    publishedAt: '2025-08-08',
    featured: true,
    image: `${S3}/packnovionovia.webp`,
    content: `
<p>El día de la boda hay mucha presión sobre el cabello. Tiene que aguantar horas, tiene que quedar bien en las fotos, tiene que resistir el movimiento, el calor y posiblemente alguna lágrima. Y sobre todo, tiene que parecer tú: tu mejor versión, pero tú. Conseguir eso no ocurre por casualidad ni el mismo día de la boda. Ocurre porque antes has planificado bien.</p>

<h2>Empieza con tiempo: el cabello necesita estar en forma</h2>
<p>Lo primero que le decimos a todas las novias que vienen al salón es esto: el mejor peinado de boda empieza meses antes, con el estado del cabello. Si el cabello está seco, dañado o apagado, ningún recogido ni semirecogido va a quedar como en Pinterest.</p>
<p>Lo ideal es empezar con un tratamiento de acondicionamiento intensivo, como el <strong>Softy Mood</strong> o el <strong>Sublime 10.31</strong>, entre dos y cuatro meses antes de la boda. Así el cabello llega al día B en su mejor momento: con brillo, con elasticidad y con una textura que facilita el peinado.</p>

<h2>La prueba previa es imprescindible</h2>
<p>No se trata de ver si el estilista sabe hacer el peinado. Se trata de que tú lo veas puesto, con tu cara, con tu vestido (o al menos con la idea del vestido), y que puedas hacer ajustes con calma. La prueba debe hacerse entre una y cuatro semanas antes de la boda, nunca el mismo día ni la víspera.</p>
<p>En la prueba también se define cómo vas a llevar el cabello para que aguante mejor: qué base de preparación usar, si el resultado funciona mejor con el cabello más limpio o con un día de suciedad, y cómo fijar sin que quede apelmazado.</p>

<h2>Qué peinados aguantan mejor una jornada larga</h2>
<p>Los recogidos clásicos bien construidos tienen una ventaja clara: si están bien hechos, aguantan sin retoque. Los semirecogidos y las ondas sueltas requieren más mantenimiento a lo largo del día, pero pueden quedar preciosos si el cabello tiene la textura adecuada y se fijan bien.</p>
<p>Lo que no funciona bien en bodas largas es el liso perfecto sin ningún volumen: tiende a aplastarse con el sudor y la humedad. Si te gusta el liso, el liso con movimiento suave aguanta mucho mejor.</p>

<h2>El día de la boda: tiempos y logística</h2>
<p>Una cosa que siempre recomendamos: reserva más tiempo del que crees que necesitas. Un peinado de novia puede llevar entre 60 y 90 minutos. Si además hay maquillaje, peinados de damas de honor o cualquier imprevisto, los tiempos se estiran. Habla con tu estilista con antelación y haz un cálculo realista.</p>
<p>En Qué Bárbaro ofrecemos el <strong>Pack Novia</strong>, que incluye la prueba previa, el peinado y el maquillaje del día. Si tienes una boda en el horizonte y quieres hablar de opciones, escríbenos por WhatsApp y lo organizamos.</p>
    `.trim(),
  },

  // ── 6. Noticias de Qué Bárbaro ────────────────────────────────────────────
  {
    title: 'Qué Bárbaro abre sus puertas en Torremolinos',
    slug: 'que-barbaro-abre-puertas-torremolinos',
    excerpt: 'Presentamos Qué Bárbaro: un espacio pensado para quienes quieren que su cabello esté bien, no solo el día del salón.',
    category: 'Noticias de Qué Bárbaro',
    publishedAt: '2025-07-01',
    featured: true,
    image: `${S3}/sublime.jpg`,
    content: `
<p>Qué Bárbaro abre hoy sus puertas en Torremolinos. No es solo un salón de peluquería. Es un espacio pensado con cuidado para que cada persona que entre sepa exactamente qué va a recibir: atención real, técnica honesta y resultados que se mantienen más allá del día de la cita.</p>

<h2>Quiénes somos</h2>
<p>Detrás de Qué Bárbaro están <strong>Missael Lundqvist y Aurelio Tabares</strong>, dos estilistas con años de experiencia y una filosofía compartida: el trabajo bien hecho no necesita exageraciones. El cabello de cada cliente tiene su propia historia, su propio estado y sus propias necesidades. Entender eso antes de coger las tijeras es lo que hace la diferencia.</p>
<p>Hemos construido el salón alrededor de esa idea. El espacio, los productos que usamos, la forma en que organizamos cada cita. Todo está pensado para que la experiencia tenga sentido de principio a fin.</p>

<h2>Qué ofrecemos</h2>
<p>Trabajamos con cortes de diseño personalizados, técnicas de coloración avanzadas como el balayage en sus distintas versiones, el <strong>método curly con la Danza de Rizos</strong>, tratamientos de la línea <strong>GOA Organics</strong>, maquillaje profesional para eventos y packs específicos para bodas, despedidas y celebraciones.</p>
<p>No tenemos un menú infinito de servicios que nunca dominamos del todo. Tenemos los servicios que sabemos hacer bien.</p>

<h2>Dónde estamos y cómo reservar</h2>
<p>Estamos en Torremolinos, Málaga. Puedes reservar cita directamente desde la web o escribirnos por WhatsApp. Para eventos y packs especiales, preferimos hablar primero para entender qué necesitas y organizar los tiempos bien.</p>
<p>Si tienes cualquier duda sobre servicios, precios o disponibilidad, escríbenos. Estamos aquí.</p>
    `.trim(),
  },

  // ── 7. Cuidado capilar (segunda entrada) ─────────────────────────────────
  {
    title: 'Encrespamiento: causas reales y cómo abordarlo desde el salón',
    slug: 'encrespamiento-causas-y-soluciones',
    excerpt: 'El encrespamiento no siempre tiene la misma causa. Entender por qué ocurre es el primer paso para tratarlo bien.',
    category: 'Cuidado capilar',
    publishedAt: '2025-08-15',
    featured: false,
    image: `${S3}/softymood.jpg`,
    content: `
<p>El encrespamiento es probablemente la queja más habitual que escuchamos en el salón. "Mi cabello se esponja con la humedad", "no puedo sacarlo a la calle sin que se monte", "he probado de todo y nada funciona". Y casi siempre, el problema está en que se está tratando el síntoma sin haber entendido la causa. Porque el encrespamiento no siempre viene del mismo sitio.</p>

<h2>Las causas más comunes</h2>
<p>Hay tres fuentes principales de encrespamiento que vemos con frecuencia:</p>
<ul>
  <li><strong>Falta de hidratación.</strong> El cabello seco busca humedad en el ambiente. Cuando el exterior tiene más humedad que el propio cabello, el tallo capilar la absorbe y se hincha, creando frizz. La solución aquí no es un laca ni un sérum antifrizz: es hidratar bien el cabello desde dentro.</li>
  <li><strong>Daño por calor o químicos.</strong> El cabello que ha sufrido decoloraciones agresivas, alisados mal ejecutados o demasiado uso de plancha tiene la cutícula levantada. Una cutícula levantada atrapa la humedad exterior y genera encrespamiento incluso en cabellos que antes no lo tenían. Aquí los tratamientos de reconstrucción capilar marcan la diferencia.</li>
  <li><strong>Corte inadecuado.</strong> Un corte que elimina el peso de forma irregular, o que trabaja el cabello en seco sin respetar su caída natural, puede multiplicar el encrespamiento aunque el cabello esté sano. El corte importa mucho más de lo que parece.</li>
</ul>

<h2>Qué hacemos en el salón</h2>
<p>Antes de recomendar nada, evaluamos el estado del cabello y preguntamos sobre la rutina en casa. No tiene sentido aplicar un tratamiento de alisado si el problema es un corte inadecuado. Ni tiene sentido cambiar el corte si el cabello está tan deshidratado que no va a responder bien.</p>
<p>Para el encrespamiento por deshidratación, el <strong>Softy Mood</strong> de GOA Organics funciona muy bien: devuelve la elasticidad y sella la cutícula para que el cabello no absorba la humedad del ambiente. Para el encrespamiento por daño, el <strong>Keratin Infusion</strong> o el <strong>Sublime 10.31</strong> tienen resultados más específicos.</p>

<h2>Qué puedes hacer en casa</h2>
<p>Más allá de los tratamientos en el salón, hay hábitos que marcan la diferencia: secar el cabello con una toalla de microfibra en lugar de frotar con toalla normal, aplicar un acondicionador sin aclarado antes de salir a la calle cuando hay mucha humedad, y usar el difusor en lugar de secar a máxima temperatura son tres cambios que pueden reducir el encrespamiento significativamente sin gastar en nada especial.</p>
    `.trim(),
  },

  // ── 8. Coloración (segunda entrada) ──────────────────────────────────────
  {
    title: 'Babylights Silk Shine: la iluminación más discreta y natural',
    slug: 'babylights-silk-shine-iluminacion-natural',
    excerpt: 'Las babylights son mechas ultrafinas que dan luminosidad sin un cambio evidente. Te explicamos en qué consisten y para quién funcionan mejor.',
    category: 'Coloración',
    publishedAt: '2025-08-22',
    featured: false,
    image: `${S3}/babylight.webp`,
    content: `
<p>Si hay una técnica que lleva años siendo la favorita de quienes quieren un cambio de color que no se note demasiado, esa es las babylights. No es la técnica más rápida ni la más dramática. Pero cuando el objetivo es ganar luminosidad y dimensión sin que nadie sea capaz de señalar exactamente qué has cambiado, es difícil superarla.</p>

<h2>Qué son las babylights</h2>
<p>Las babylights son mechas muy finas, mucho más que las mechas convencionales, aplicadas con papel de aluminio en secciones pequeñas y distribuidas de forma muy precisa por toda la cabeza. El nombre viene de la idea de imitar la forma en que el sol aclara el cabello de los niños: con puntos muy concretos de luz, sin uniformidad, con una apariencia completamente natural.</p>
<p>El resultado no es "tengo mechas". Es "mi cabello tiene mucha vida y brillo". Y eso es exactamente lo que buscan quienes las piden.</p>

<h2>Para quién funcionan mejor</h2>
<p>Las babylights funcionan en casi todos los tonos de base, pero dan su mejor resultado en cabellos entre el castaño claro y el rubio oscuro. En tonos muy oscuros, el contraste puede ser menos visible a menos que se use una decoloración más intensa, lo que cambia el carácter del resultado.</p>
<p>Son especialmente recomendables para quienes quieren empezar a iluminar el cabello sin comprometerse con un cambio radical, para quienes necesitan un color de muy bajo mantenimiento, o para quienes tienen el cabello fino y no quieren sobrecargar la fibra con demasiado producto.</p>

<h2>Cómo se hace en Qué Bárbaro</h2>
<p>En el salón trabajamos las babylights con el concepto <strong>Silk Shine</strong>: aplicación precisa, secciones muy finas y acabado con matización para que el resultado tenga coherencia cromática y no quede "parcelado". El proceso lleva más tiempo que otras técnicas de iluminación porque requiere más paciencia, pero el resultado lo justifica.</p>
<p>Después del servicio recomendamos siempre un acondicionador de color para mantener el brillo y prolongar la vida del tratamiento entre visitas.</p>

<h2>¿Con qué frecuencia hay que retocarlas?</h2>
<p>Una de las ventajas de las babylights es que la raíz crece de forma muy discreta. No hay una línea de demarcación clara como en el tinte global. Dependiendo del ritmo de crecimiento del cabello y de la intensidad del resultado, se pueden espaciar los retoques entre 3 y 5 meses sin que el color pierda presencia.</p>
    `.trim(),
  },

  // ── 9. Eventos y ocasiones especiales (segunda entrada) ──────────────────
  {
    title: 'Despedidas de soltera: peinados para un look de grupo con personalidad',
    slug: 'peinados-despedidas-de-soltera',
    excerpt: 'Una despedida es una ocasión especial y el look tiene que estar a la altura. Ideas y consejos para que todo el grupo luzca genial.',
    category: 'Eventos y ocasiones especiales',
    publishedAt: '2025-09-01',
    featured: false,
    image: `${S3}/packdespedida.webp`,
    content: `
<p>Una despedida de soltera tiene su propia energía. No es una boda, no es una cena de empresa. Es un día (o una noche) en el que un grupo de personas quiere estar bien, divertirse y que las fotos queden bonitas. Y eso, desde el salón, se puede preparar perfectamente.</p>

<h2>El look de grupo: cómo coordinarlo sin que resulte uniforme</h2>
<p>Una de las cosas que más nos preguntan cuando viene un grupo es si tienen que llevar todas el mismo peinado. La respuesta es no, y de hecho sería un error. Lo que da coherencia visual a un grupo no es la uniformidad, es el <strong>nivel de acabado</strong>. Que todas lleven el cabello trabajado, con volumen o con definición, ya genera unidad en las fotos aunque cada una lleve un estilo diferente.</p>
<p>Lo que sí puede tener sentido es consensuar si el ambiente de la noche pide algo más arreglado (recogidos, semirecogidos, ondas) o algo más desenfadado (blow dry, texturas, melenas sueltas con acabado). A partir de ahí, cada una elige dentro de esa dirección.</p>

<h2>Peinados que funcionan para salidas nocturnas</h2>
<p>Hay algunos que aguantan especialmente bien una noche larga:</p>
<ul>
  <li><strong>Ondas al agua o beach waves.</strong> Duran bien, se mueven de forma bonita y quedan fotogénicas en todo tipo de ambiente.</li>
  <li><strong>Recogido bajo o semirrecogido.</strong> Elegante sin ser excesivamente formal. Funciona mucho en despedidas con cena incluida.</li>
  <li><strong>Blow dry con volumen.</strong> Para quienes prefieren el cabello suelto. Con los productos correctos aguanta bien varias horas.</li>
</ul>

<h2>Cómo organizarlo en el salón</h2>
<p>Lo más práctico es reservar un bloque de tiempo en el salón para todo el grupo. Cuántas personas vendrán, a qué hora tienen que estar listas, si hay maquillaje también... toda esa logística hay que organizarla con antelación para que no haya prisas. En Qué Bárbaro tenemos el <strong>Pack Despedida</strong> pensado exactamente para esto: peinado, maquillaje y ese detalle sorpresa que hace que la experiencia sea un poco más especial.</p>
<p>Si estás organizando una despedida y quieres saber qué podemos hacer por el grupo, escríbenos por WhatsApp y te contamos. Cuanto antes reserves, más fácil es cuadrar los tiempos.</p>
    `.trim(),
  },
]

async function seed() {
  console.log('Connecting to MongoDB…')
  await mongoose.connect(env.MONGODB_URI)

  let created = 0
  let skipped = 0
  let updated = 0

  for (const data of posts) {
    const existing = await Blog.findOne({ slug: data.slug })

    if (existing) {
      // Update content if the existing post has no content
      if (!existing.content) {
        await Blog.updateOne({ slug: data.slug }, {
          $set: {
            content:     data.content,
            image:       data.image,
            featured:    data.featured ?? false,
            publishedAt: data.publishedAt,
            draft:       false,
          },
        })
        console.log(`  updated  ${data.slug}`)
        updated++
      } else {
        console.log(`  skipped  ${data.slug}`)
        skipped++
      }
      continue
    }

    await Blog.create({
      ...data,
      author:   AUTHOR,
      locale:   'es',
      draft:    false,
      featured: data.featured ?? false,
    })
    console.log(`  created  ${data.slug}`)
    created++
  }

  console.log(`\nDone - ${created} created, ${updated} updated, ${skipped} skipped (${posts.length} total)`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
