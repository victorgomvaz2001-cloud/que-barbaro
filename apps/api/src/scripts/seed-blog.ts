import 'dotenv/config'
import mongoose from 'mongoose'
import { Blog } from '../models/Blog.model'
import { env } from '../config/env'

const AUTHOR = 'Qué Bárbaro'

const posts = [
  // ── Cuidado capilar ────────────────────────────────────────────────────────
  {
    title: 'Cómo hidratar el cabello en casa sin gastar una fortuna',
    slug: 'como-hidratar-el-cabello-en-casa',
    excerpt: 'Las claves para mantener el cabello hidratado entre visitas al salón, con productos sencillos y una rutina que de verdad funciona.',
    category: 'Cuidado capilar',
    publishedAt: '2025-03-01',
  },
  {
    title: 'GOA Organics: qué es y para qué tipo de cabello está pensado',
    slug: 'goa-organics-que-es-para-que-cabello',
    excerpt: 'Te explicamos en qué consiste el tratamiento GOA Organics que ofrecemos en Qué Bárbaro y cuándo tiene más sentido hacerlo.',
    category: 'Cuidado capilar',
    publishedAt: '2025-03-08',
  },
  {
    title: 'Keratin Infusion vs Softy Mood: ¿cuál es el tratamiento que necesitas?',
    slug: 'keratin-infusion-vs-softy-mood',
    excerpt: 'Dos tratamientos muy diferentes para objetivos parecidos. Te ayudamos a entender cuál encaja mejor con tu cabello y tu rutina.',
    category: 'Cuidado capilar',
    publishedAt: '2025-03-15',
  },
  {
    title: 'Encrespamiento: causas reales y cómo abordarlo desde el salón',
    slug: 'encrespamiento-causas-y-soluciones',
    excerpt: 'El encrespamiento no siempre tiene la misma causa. Entender por qué ocurre es el primer paso para tratarlo bien.',
    category: 'Cuidado capilar',
    publishedAt: '2025-03-22',
  },
  {
    title: 'Sublime 10.31 y Bae Berry: tratamientos intensivos para cabellos muy dañados',
    slug: 'sublime-10-31-bae-berry-cabellos-danados',
    excerpt: 'Cuando el cabello ha pasado por mucho color o calor, estos dos tratamientos marcan la diferencia. Te contamos cómo funcionan.',
    category: 'Cuidado capilar',
    publishedAt: '2025-03-29',
  },

  // ── Coloración ─────────────────────────────────────────────────────────────
  {
    title: 'Balayage: qué es y por qué sigue siendo la técnica más solicitada',
    slug: 'balayage-que-es-y-por-que-funciona',
    excerpt: 'El balayage lleva años siendo el favorito de muchos clientes. Te explicamos por qué, y cuándo es la mejor opción para tu cabello.',
    category: 'Coloración',
    publishedAt: '2025-03-02',
  },
  {
    title: 'Cómo alargar el tiempo entre visitas sin que el color pierda presencia',
    slug: 'alargar-tiempo-entre-visitas-color',
    excerpt: 'Con los cuidados correctos en casa, el color puede mantenerse mucho más vivo. Estas son las claves que funcionan de verdad.',
    category: 'Coloración',
    publishedAt: '2025-03-09',
  },
  {
    title: 'Estilo Brasileño: el rubio que se adapta a cada persona',
    slug: 'estilo-brasileno-rubio-personalizado',
    excerpt: 'El Estilo Brasileño no es un color concreto, sino una forma de entender los rubios. Te explicamos en qué se diferencia de otras técnicas.',
    category: 'Coloración',
    publishedAt: '2025-03-16',
  },
  {
    title: 'Corrección de color: cuándo es necesaria y qué implica',
    slug: 'correccion-de-color-cuando-y-que-implica',
    excerpt: 'Si el resultado no ha sido el esperado, la corrección de color puede devolver el cabello al punto que buscas. Pero hay que hacerlo bien.',
    category: 'Coloración',
    publishedAt: '2025-03-23',
  },
  {
    title: 'Mechas vs balayage: diferencias reales para elegir bien',
    slug: 'mechas-vs-balayage-diferencias',
    excerpt: 'Aunque a veces se usan como sinónimos, no son lo mismo. Te aclaramos las diferencias para que puedas pedir exactamente lo que quieres.',
    category: 'Coloración',
    publishedAt: '2025-03-30',
  },

  // ── Rizos y método curly ───────────────────────────────────────────────────
  {
    title: 'Método curly: principios básicos para empezar sin perderse',
    slug: 'metodo-curly-principios-basicos',
    excerpt: 'El método curly tiene mucha información en internet, no toda útil. Aquí va lo esencial para empezar con buen criterio.',
    category: 'Rizos y método curly',
    publishedAt: '2025-03-03',
  },
  {
    title: 'Danza de Rizos: por qué es diferente a un corte convencional',
    slug: 'danza-de-rizos-diferencia-corte-convencional',
    excerpt: 'El corte Danza de Rizos respeta la forma natural del rizo. Te explicamos en qué consiste y por qué el resultado es tan diferente.',
    category: 'Rizos y método curly',
    publishedAt: '2025-03-10',
  },
  {
    title: 'Cómo secar los rizos sin que pierdan definición',
    slug: 'como-secar-rizos-sin-perder-definicion',
    excerpt: 'El secado es uno de los momentos clave en la rutina curly. Estos son los pasos y los errores más habituales a evitar.',
    category: 'Rizos y método curly',
    publishedAt: '2025-03-17',
  },
  {
    title: 'Productos para rizos: qué buscar en el etiquetado',
    slug: 'productos-para-rizos-que-buscar',
    excerpt: 'No todos los productos etiquetados como "para rizos" funcionan igual. Aprende a leer los ingredientes y a elegir con criterio.',
    category: 'Rizos y método curly',
    publishedAt: '2025-03-24',
  },
  {
    title: 'Rizos en verano: cómo protegerlos del sol, el mar y el cloro',
    slug: 'rizos-en-verano-proteccion-sol-mar-cloro',
    excerpt: 'El verano es especialmente agresivo con los rizos. Estos son los cuidados concretos que marcan la diferencia en los meses de calor.',
    category: 'Rizos y método curly',
    publishedAt: '2025-03-31',
  },

  // ── Tendencias ─────────────────────────────────────────────────────────────
  {
    title: 'Cortes de cabello que están marcando este año',
    slug: 'cortes-de-cabello-tendencias-2025',
    excerpt: 'Repasamos los cortes que más estamos viendo en el salón y en la calle, con una mirada realista sobre cuáles de verdad funcionan.',
    category: 'Tendencias',
    publishedAt: '2025-03-04',
  },
  {
    title: 'El regreso del flequillo: tipos, caras y cómo mantenerlo',
    slug: 'regreso-del-flequillo-tipos-y-mantenimiento',
    excerpt: 'El flequillo vuelve con fuerza, pero no todos los flequillos son para todas las caras. Te ayudamos a encontrar el tuyo.',
    category: 'Tendencias',
    publishedAt: '2025-03-11',
  },
  {
    title: 'Tonos para este otoño-invierno: cálidos, naturales y con carácter',
    slug: 'tonos-otono-invierno-2025',
    excerpt: 'Los tonos cálidos y terrosos dominan la temporada. Te mostramos cuáles están funcionando mejor y en qué tipo de cabello quedan bien.',
    category: 'Tendencias',
    publishedAt: '2025-03-18',
  },
  {
    title: 'Texturas naturales: por qué cada vez más clientes abrazan su cabello real',
    slug: 'texturas-naturales-tendencia-2025',
    excerpt: 'La tendencia hacia lo natural no es solo estética, es también una forma de cuidar mejor el cabello. Hablamos de ello.',
    category: 'Tendencias',
    publishedAt: '2025-03-25',
  },
  {
    title: 'El bob: por qué sigue siendo el corte más versátil del momento',
    slug: 'bob-corte-versatil-tendencias',
    excerpt: 'El bob lleva décadas siendo relevante porque se adapta a todo. Te contamos sus versiones actuales y a quién le sienta mejor.',
    category: 'Tendencias',
    publishedAt: '2025-04-01',
  },

  // ── Eventos y ocasiones especiales ────────────────────────────────────────
  {
    title: 'Looks de novia: cómo preparar el cabello para el día más importante',
    slug: 'looks-de-novia-preparacion-capilar',
    excerpt: 'El día de la boda el cabello tiene que estar perfecto, y eso empieza mucho antes. Te contamos cómo planificarlo bien desde el salón.',
    category: 'Eventos y ocasiones especiales',
    publishedAt: '2025-03-05',
  },
  {
    title: 'Despedidas de soltera: peinados para un look de grupo con personalidad',
    slug: 'peinados-despedidas-de-soltera',
    excerpt: 'Una despedida es una ocasión especial y el look tiene que estar a la altura. Ideas y consejos para que todo el grupo luzca genial.',
    category: 'Eventos y ocasiones especiales',
    publishedAt: '2025-03-12',
  },
  {
    title: 'Looks de noche: cómo transformar tu cabello para una ocasión especial',
    slug: 'looks-de-noche-cabello-ocasion-especial',
    excerpt: 'Con los cambios correctos, el cabello puede transformar completamente un look de noche. Te mostramos qué pedir y cómo prepararte.',
    category: 'Eventos y ocasiones especiales',
    publishedAt: '2025-03-19',
  },
  {
    title: 'Cómo sacarle partido a tu cita en Qué Bárbaro antes de un evento',
    slug: 'aprovechar-cita-que-barbaro-antes-evento',
    excerpt: 'Si tienes un evento importante, hay formas de optimizar tu cita para que el resultado dure más y se adapte mejor a la ocasión.',
    category: 'Eventos y ocasiones especiales',
    publishedAt: '2025-03-26',
  },
  {
    title: 'Tratamientos exprés antes de un evento: qué tiene sentido hacer',
    slug: 'tratamientos-express-antes-de-evento',
    excerpt: 'No todos los tratamientos necesitan tiempo de espera para mostrar resultados. Te explicamos cuáles tienen más sentido antes de un evento.',
    category: 'Eventos y ocasiones especiales',
    publishedAt: '2025-04-02',
  },

  // ── Noticias de Qué Bárbaro ────────────────────────────────────────────────
  {
    title: 'Qué Bárbaro abre sus puertas en Torremolinos',
    slug: 'que-barbaro-abre-puertas-torremolinos',
    excerpt: 'Presentamos Qué Bárbaro: un espacio pensado para quienes quieren que su cabello esté bien, no solo el día del salón.',
    category: 'Noticias de Qué Bárbaro',
    publishedAt: '2025-07-01',
    featured: true,
  },
  {
    title: 'Incorporamos la Danza de Rizos a nuestro catálogo de servicios',
    slug: 'incorporamos-danza-de-rizos',
    excerpt: 'A partir de ahora ofrecemos el corte Danza de Rizos, una técnica específica para cabellos rizados que respeta la forma natural del rizo.',
    category: 'Noticias de Qué Bárbaro',
    publishedAt: '2025-07-15',
  },
  {
    title: 'Ya trabajamos con GOA Organics en el salón',
    slug: 'ya-trabajamos-con-goa-organics',
    excerpt: 'Hemos incorporado GOA Organics a nuestra oferta de tratamientos. Una línea de cuidado capilar con ingredientes naturales y resultados reales.',
    category: 'Noticias de Qué Bárbaro',
    publishedAt: '2025-08-01',
  },
  {
    title: 'Nuevo servicio de maquillaje profesional para eventos',
    slug: 'nuevo-servicio-maquillaje-profesional-eventos',
    excerpt: 'Ampliamos nuestra oferta de servicios para eventos con maquillaje profesional. Una forma de cubrir todo desde un solo espacio.',
    category: 'Noticias de Qué Bárbaro',
    publishedAt: '2025-08-20',
  },
  {
    title: 'Qué Bárbaro, referencia en peluquería en Torremolinos',
    slug: 'que-barbaro-referencia-peluqueria-torremolinos',
    excerpt: 'A pocos meses de abrir, Qué Bárbaro se consolida como una opción de referencia para quienes buscan calidad y atención personalizada en Torremolinos.',
    category: 'Noticias de Qué Bárbaro',
    publishedAt: '2025-09-10',
    featured: true,
  },
]

async function seed() {
  console.log('Connecting to MongoDB…')
  await mongoose.connect(env.MONGODB_URI)

  let created = 0
  let skipped = 0

  for (const data of posts) {
    const existing = await Blog.findOne({ slug: data.slug })
    if (existing) {
      console.log(`  skipped  ${data.slug}`)
      skipped++
      continue
    }
    await Blog.create({
      ...data,
      content: '',
      author: AUTHOR,
      locale: 'es',
      draft: false,
      featured: data.featured ?? false,
    })
    console.log(`  created  ${data.slug}`)
    created++
  }

  console.log(`\nDone — ${created} created, ${skipped} skipped (${posts.length} total)`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
