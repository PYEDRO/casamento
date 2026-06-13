/**
 * Conteúdo do site (textos das imagens de referência) e imagens placeholder
 * (Unsplash). Troque as URLs por fotos reais quando tiver os arquivos.
 */

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const COUPLE = {
  names: 'Ana & Carlos',
  date: '14 de Setembro de 2025',
  city: 'São Paulo, Brasil',
  time: '17h00',
  venue: 'Quinta dos Ipês',
};

export const HERO_IMAGE = U('1519741497674-611481863552');
export const STORY_IMAGE = U('1606800052052-a08af7148866');
export const ARCH_IMAGE = U('1464366400600-7168b8af9bc3');
export const LOGIN_IMAGE = U('1465495976277-4387d4b0b4c6');

export const GALLERY: string[] = [
  U('1519741497674-611481863552'),
  U('1606800052052-a08af7148866'),
  U('1511285560929-80b456fea0bc'),
  U('1519225421980-715cb0215aed'),
  U('1583939003579-730e3918a45a'),
  U('1525258946800-98cfd641d0de'),
];

export const STORY = [
  {
    year: '2019',
    text: 'Nos conhecemos numa tarde de outono em São Paulo, numa livraria no bairro de Pinheiros. Um olhar, um sorriso, e o resto é história.',
  },
  {
    year: '2021',
    text: 'Viajamos juntos pela Europa pela primeira vez. Foi em Paris que Carlos pediu Ana em namoro, às margens do Sena.',
  },
  {
    year: '2024',
    text: 'Carlos surpreendeu Ana com um pedido de casamento durante um jantar íntimo em família, com um anel de família de três gerações.',
  },
  {
    year: '2025',
    text: 'E agora, estamos prontos para celebrar o nosso amor com as pessoas que mais amamos no mundo.',
  },
];

export const CEREMONY = {
  horario: ['Cerimônia: 17h00', 'Recepção: 19h00', 'Jantar: 20h30', 'Festa: até a aurora'],
  local: ['Quinta dos Ipês', 'Rua das Flores, 1200', 'Ibirapuera, São Paulo', 'SP, 04078-000'],
  data: ['Sábado', '14 de Setembro', 'de 2025', 'Traje: Esporte Fino'],
};
