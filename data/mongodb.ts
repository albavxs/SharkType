import { Snippet } from '@/lib/types'

export const mongodbSnippets: Snippet[] = [
  {
    id: 'mongo-001',
    concept: { pt: 'insertOne e insertMany', en: 'insertOne and insertMany' },
    difficulty: 'easy',
    prompt: {
      pt: 'insertOne adiciona um documento e insertMany adiciona vários de uma vez no MongoDB. Insira um usuário e depois uma lista de produtos.',
      en: 'insertOne adds one document and insertMany adds several at once in MongoDB. Insert a user and then a list of products.',
    },
    code: `db.users.insertOne({
  name: "Paulo",
  email: "paulo@email.com",
  createdAt: new Date()
});

db.products.insertMany([
  { name: "Mouse", price: 59.90, stock: 150 },
  { name: "Teclado", price: 120.00, stock: 80 },
  { name: "Monitor", price: 899.00, stock: 30 },
]);`,
  },
  {
    id: 'mongo-002',
    concept: { pt: 'find com Filtro', en: 'find with Filter' },
    difficulty: 'easy',
    prompt: {
      pt: 'find() busca documentos que batem com o filtro usando operadores como $gt, $in e $regex. Busque produtos com preço acima de 100 e em estoque.',
      en: 'find() queries documents matching the filter using operators like $gt, $in, and $regex. Find products priced above 100 and in stock.',
    },
    code: `db.products.find({
  price: { $gt: 100 },
  stock: { $gte: 1 },
  name: { $regex: /^[A-Z]/, $options: "i" }
}).sort({ price: -1 }).limit(10);

db.users.find({
  role: { $in: ["admin", "moderator"] },
  active: true
});`,
  },
  {
    id: 'mongo-003',
    concept: { pt: 'find com Projeção', en: 'find with Projection' },
    difficulty: 'easy',
    prompt: {
      pt: 'O segundo argumento de find() controla quais campos retornar -- 1 pra incluir, 0 pra excluir. Busque usuários retornando só nome e email, sem _id.',
      en: 'The second argument of find() controls which fields to return -- 1 to include, 0 to exclude. Find users returning only name and email, without _id.',
    },
    code: `db.users.find(
  { active: true },
  { name: 1, email: 1, _id: 0 }
);

db.products.find(
  { category: "electronics" },
  { name: 1, price: 1, "specs.weight": 1 }
).sort({ name: 1 });`,
  },
  {
    id: 'mongo-004',
    concept: { pt: 'updateOne com $set', en: 'updateOne with $set' },
    difficulty: 'medium',
    prompt: {
      pt: '$set atualiza campos específicos sem sobrescrever o documento inteiro. Use updateOne com $set, $inc e $push pra modificar um usuário.',
      en: '$set updates specific fields without overwriting the entire document. Use updateOne with $set, $inc, and $push to modify a user.',
    },
    code: `db.users.updateOne(
  { email: "paulo@email.com" },
  {
    $set: { role: "admin", updatedAt: new Date() },
    $inc: { loginCount: 1 },
    $push: { tags: "premium" }
  }
);

db.products.updateMany(
  { stock: { $lte: 0 } },
  { $set: { available: false } }
);`,
  },
  {
    id: 'mongo-005',
    concept: { pt: 'deleteOne e deleteMany', en: 'deleteOne and deleteMany' },
    difficulty: 'easy',
    prompt: {
      pt: 'deleteOne remove o primeiro documento que bate com o filtro e deleteMany remove todos. Delete usuários inativos e um produto específico.',
      en: 'deleteOne removes the first matching document and deleteMany removes all. Delete inactive users and a specific product.',
    },
    code: `db.users.deleteMany({
  active: false,
  lastLogin: { $lt: new Date("2025-01-01") }
});

db.products.deleteOne({ _id: ObjectId("abc123") });

db.logs.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 30 * 86400000) }
});`,
  },
  {
    id: 'mongo-006',
    concept: { pt: 'Pipeline de Agregação', en: 'Aggregation Pipeline' },
    difficulty: 'medium',
    prompt: {
      pt: 'O pipeline de agregação processa documentos em estágios como $match, $group e $sort. Agrupe vendas por categoria e calcule totais.',
      en: 'The aggregation pipeline processes documents in stages like $match, $group, and $sort. Group sales by category and calculate totals.',
    },
    code: `db.orders.aggregate([
  { $match: { status: "completed" } },
  { $unwind: "$items" },
  { $group: {
    _id: "$items.category",
    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
    orderCount: { $sum: 1 },
    avgPrice: { $avg: "$items.price" }
  }},
  { $sort: { totalRevenue: -1 } },
  { $limit: 5 }
]);`,
  },
]
