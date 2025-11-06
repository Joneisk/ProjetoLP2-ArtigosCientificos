// src/data/mockArticles.ts
export interface Article {
  id: string
  title: string
  abstract: string
  content: string
  authors: string[]
  keywords: string[]
  category: string
  publishedDate: string
  authorId: string
  authorName: string
  likes: number
  dislikes: number
}

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Inteligência Artificial na Medicina: Avanços e Desafios',
    abstract:
      'Este artigo explora os recentes avanços da inteligência artificial aplicada à medicina, discutindo suas aplicações práticas, benefícios e desafios éticos.',
    content:
      'A inteligência artificial tem revolucionado diversos setores da medicina moderna...',
    authors: ['Dr. Maria Santos', 'Dr. Pedro Oliveira'],
    keywords: ['Inteligência Artificial', 'Medicina', 'Machine Learning', 'Diagnóstico'],
    category: 'Medicina',
    publishedDate: '2025-01-15',
    authorId: '2',
    authorName: 'Dr. Maria Santos',
    likes: 45,
    dislikes: 3,
  },
  {
    id: '2',
    title: 'Computação Quântica: Uma Nova Era da Tecnologia',
    abstract:
      'Uma análise abrangente sobre o estado atual da computação quântica e suas potenciais aplicações em criptografia e simulações complexas.',
    content: 'A computação quântica representa um paradigma revolucionário...',
    authors: ['Prof. Carlos Mendes'],
    keywords: ['Computação Quântica', 'Física', 'Tecnologia', 'Qubits'],
    category: 'Física',
    publishedDate: '2025-01-10',
    authorId: '3',
    authorName: 'Prof. Carlos Mendes',
    likes: 67,
    dislikes: 5,
  },
  {
    id: '3',
    title: 'Mudanças Climáticas e Biodiversidade: Um Estudo Global',
    abstract:
      'Investigação sobre os impactos das mudanças climáticas na biodiversidade global, com foco em ecossistemas tropicais.',
    content:
      'As mudanças climáticas representam uma das maiores ameaças à biodiversidade...',
    authors: ['Dra. Ana Paula Costa', 'Dr. Roberto Lima'],
    keywords: ['Mudanças Climáticas', 'Biodiversidade', 'Ecologia', 'Conservação'],
    category: 'Biologia',
    publishedDate: '2025-01-05',
    authorId: '4',
    authorName: 'Dra. Ana Paula Costa',
    likes: 89,
    dislikes: 7,
  },
  {
    id: '4',
    title: 'Nanomateriais em Energia Renovável',
    abstract:
      'Estudo sobre a aplicação de nanomateriais no desenvolvimento de células solares mais eficientes e sustentáveis.',
    content:
      'Os nanomateriais têm mostrado grande potencial na área de energia renovável...',
    authors: ['Dr. Fernando Rodrigues'],
    keywords: ['Nanotecnologia', 'Energia Renovável', 'Células Solares', 'Sustentabilidade'],
    category: 'Engenharia',
    publishedDate: '2024-12-20',
    authorId: '5',
    authorName: 'Dr. Fernando Rodrigues',
    likes: 52,
    dislikes: 4,
  },
  {
    id: '5',
    title: 'Neuroplasticidade e Aprendizagem',
    abstract:
      'Uma revisão sobre os mecanismos de neuroplasticidade e suas implicações para processos de aprendizagem e reabilitação neurológica.',
    content:
      'A neuroplasticidade refere-se à capacidade do cérebro de reorganizar suas conexões...',
    authors: ['Dra. Juliana Martins', 'Dr. Lucas Ferreira'],
    keywords: ['Neurociência', 'Neuroplasticidade', 'Aprendizagem', 'Cérebro'],
    category: 'Neurociência',
    publishedDate: '2024-12-15',
    authorId: '6',
    authorName: 'Dra. Juliana Martins',
    likes: 73,
    dislikes: 2,
  },
]
