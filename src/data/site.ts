/**
 * Conteúdo do site (textos) e imagens placeholder (Unsplash).
 * Troque as URLs por fotos reais quando tiver os arquivos.
 */

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const COUPLE = {
  names: 'Pedro & Thallyta',
  date: '25 de Abril de 2027',
  dateShort: '25 Abr 2027',
  dateUpper: '25 DE ABRIL DE 2027',
  city: 'Brazlândia, DF',
  time: '17h00',
  venue: 'INCRA 7 – Chácara 30',
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
    text: 'Viajamos juntos pela Europa pela primeira vez. Foi em Paris que Pedro pediu Thallyta em namoro, às margens do Sena.',
  },
  {
    year: '2024',
    text: 'Pedro surpreendeu Thallyta com um pedido de casamento durante um jantar íntimo em família, com um anel de família de três gerações.',
  },
  {
    year: '2027',
    text: 'E agora, estamos prontos para celebrar o nosso amor com as pessoas que mais amamos no mundo.',
  },
];

export const CEREMONY = {
  horario: ['Cerimônia: 17h00', 'Recepção: 19h00', 'Jantar: 20h30', 'Festa: até a aurora'],
  local: ['INCRA 7 – Chácara 30', 'Às margens da BR-080, Km 05', 'Brazlândia – DF'],
  data: ['Domingo', '25 de Abril', 'de 2027', 'Traje: Esporte Fino'],
};
