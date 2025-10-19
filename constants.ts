import { Client, ContentPost, PostStatus, User } from './types';

export const CURRENT_USER: User = { name: 'Martín Alfred', avatarInitial: 'M', avatarColor: 'bg-blue-500' };

export const CLIENTS: Client[] = [
  { id: 'ospoce', name: 'Ospoce', avatarUrl: 'https://placehold.co/32x32/1f2937/a3a3a3?text=O' },
  { id: 'integral', name: 'Integral', avatarUrl: 'https://placehold.co/32x32/1f2937/a3a3a3?text=I'  },
  { id: 'montserrat', name: 'Centro Médico Montserrat', avatarUrl: 'https://placehold.co/32x32/1f2937/a3a3a3?text=M'  },
];

export const STATUS_MAP: Record<PostStatus, { text: string; color: string; dotColor: string }> = {
  [PostStatus.Pendiente]: { text: 'Pendiente', color: 'text-red-400', dotColor: 'bg-red-500' },
  [PostStatus.EnRevision]: { text: 'En Revisión', color: 'text-yellow-400', dotColor: 'bg-yellow-500' },
  [PostStatus.Aprobado]: { text: 'Aprobado', color: 'text-green-400', dotColor: 'bg-green-500' },
};

export const POSTS: ContentPost[] = [
  {
    id: 'post-hepatitis-c',
    clientId: 'integral',
    platform: 'Instagram',
    format: 'Static',
    topic: 'Efeméride',
    objective: 'Awareness',
    date: '2025-10-01',
    brief: 'DÍA MUNDIAL DE LA HEPATITIS C',
    idea: 'Jugar con que la enfermedad es invisible y de esta manera darle visibilidad.',
    imagePrompt: 'Una fotografía conceptual y artística de unas manos sosteniendo un recorte de papel de un hígado. Sobre la imagen, el texto "IN-VI-SI-BLE" está superpuesto de forma creativa. La paleta de colores es suave, con verdes y tonos piel, transmitiendo un mensaje de salud y cuidado. Estilo minimalista y de alta calidad.',
    copyIn: 'INV\nIC\nIBLE',
    copyOut: `La Hepatitis C también se puede detectar fácilmente aunque no presente síntomas 💉\n➡️ Un análisis de sangre simple permite detectarla y acceder a tratamiento.\n\n¿Sabías que hay factores de riesgo que aumentan la posibilidad de tenerla?\n✔️ Transfusiones de sangre antes de 1992.\n✔️ Uso compartido de jeringas o elementos cortopunzantes.\n✔️ Tatuajes o piercings sin condiciones de higiene adecuadas.\n\nCuidate. La salud está en tus manos: pedí tus chequeos a tiempo.\n#HepatitisC #Prevención #IntegralCompromisoMédico`,
    mediaUrl: 'https://i.imgur.com/gC5a2rc.png', // Placeholder with the actual image from screenshot
    mediaType: 'image',
    status: PostStatus.Aprobado,
    comments: [
      {
        id: 'comment-1',
        user: { name: 'Martín Alfred', avatarInitial: 'M', avatarColor: 'bg-blue-500' },
        timestamp: '2:56 PM Oct 17',
        text: 'Les dejamos el video ajustado con los comentarios chicas!',
        mention: ['cinthiamr@ospoce.com.ar', 'florencia.cardarelli@ospoce.com.ar'],
        assignedTo: 'cinthiamr@ospoce.com.ar'
      },
      {
        id: 'comment-2',
        user: { name: 'Cinthia Vanesa Marmo', avatarInitial: 'C', avatarColor: 'bg-red-500' },
        timestamp: '3:40 PM Oct 17',
        text: 'Muy bueno!'
      }
    ],
  },
  // Adding a few more posts for calendar/list view
  {
    id: 'post-dia-madre',
    clientId: 'ospoce',
    platform: 'Instagram',
    format: 'Reel',
    topic: 'Efeméride',
    objective: 'Awareness',
    date: '2025-10-19',
    brief: 'DÍA DE LA MADRE. Cuidás a todos, que no se te olvide cuidarte.',
    idea: 'Reel: emos a diferentes mamás en situaciones cotidianas: haciendo la tarea con sus hijos, preparando las viandas, jugando, ordenando, dándole de comer a las mascotas.',
    imagePrompt: 'Un collage de videos cortos mostrando a madres en momentos tiernos y cotidianos con sus hijos, en alta definición, con una estética cálida y hogareña.',
    copyIn: 'Sobreimprime: Tenés tiempo para todos, tomate un tiempo para tu salud también.',
    copyOut: '✨ En este Día de la Madre, celebramos a quienes cuidan de todos, recordándoles lo importante que es cuidarse a sí mismas. Los chequeos médicos de rutina son la mejor manera de prevenir y detectar a tiempo.\n\nPorque la mejor manera de demostrar amor también es estar saludable. 💙\n➡️ Hacete el autoexamen mamario.\n➡️ Consultá con tu médico y agendá tus controles.\n\n#DíaDeLaMadre #CuidarseEsQuererse #ChequeosDeRutina #PrevenciónIntegral #SaludDeLaMujer',
    mediaUrl: 'https://i.imgur.com/u7fL2Ro.png',
    mediaType: 'image', // It's a reel, but we use an image as thumbnail
    status: PostStatus.EnRevision,
    comments: [],
  },
];
