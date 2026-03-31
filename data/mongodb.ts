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
      pt: 'O segundo argumento de find() controla quais campos retornar — 1 pra incluir, 0 pra excluir. Busque usuários retornando só nome e email, sem _id.',
      en: 'The second argument of find() controls which fields to return — 1 to include, 0 to exclude. Find users returning only name and email, without _id.',
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
  {
    id: 'mongo-007',
    concept: { pt: '$lookup (Join)', en: '$lookup (Join)' },
    difficulty: 'hard',
    prompt: {
      pt: '$lookup faz o equivalente a um JOIN relacional, trazendo documentos de outra collection. Junte pedidos com dados dos usuários.',
      en: '$lookup performs the equivalent of a relational JOIN, bringing documents from another collection. Join orders with user data.',
    },
    code: `db.orders.aggregate([
  { $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user"
  }},
  { $unwind: "$user" },
  { $project: {
    orderDate: 1,
    total: 1,
    "user.name": 1,
    "user.email": 1
  }},
  { $sort: { orderDate: -1 } }
]);`,
  },
  {
    id: 'mongo-008',
    concept: { pt: 'Criação de Índice', en: 'Index Creation' },
    difficulty: 'medium',
    prompt: {
      pt: 'Índices aceleram queries ao evitar varredura completa da collection. Crie índices simples, compostos e com unique constraint.',
      en: 'Indexes speed up queries by avoiding full collection scans. Create simple, compound, and unique constraint indexes.',
    },
    code: `db.users.createIndex({ email: 1 }, { unique: true });

db.products.createIndex({ category: 1, price: -1 });

db.orders.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
);

db.products.createIndex(
  { name: "text", description: "text" },
  { weights: { name: 10, description: 5 } }
);

db.users.getIndexes();`,
  },
  {
    id: 'mongo-009',
    concept: { pt: '$unwind e $project', en: '$unwind and $project' },
    difficulty: 'hard',
    prompt: {
      pt: '$unwind desdobra arrays em documentos individuais e $project reformata a saída. Combine ambos pra analisar tags de produtos.',
      en: '$unwind unfolds arrays into individual documents and $project reshapes the output. Combine both to analyze product tags.',
    },
    code: `db.products.aggregate([
  { $unwind: "$tags" },
  { $group: {
    _id: "$tags",
    count: { $sum: 1 },
    avgPrice: { $avg: "$price" },
    products: { $push: "$name" }
  }},
  { $project: {
    tag: "$_id",
    _id: 0,
    count: 1,
    avgPrice: { $round: ["$avgPrice", 2] },
    topProducts: { $slice: ["$products", 3] }
  }},
  { $sort: { count: -1 } }
]);`,
  },
  {
    id: 'mongo-010',
    concept: { pt: 'Mongoose Schema e Model', en: 'Mongoose Schema and Model' },
    difficulty: 'medium',
    prompt: {
      pt: 'Mongoose define schemas tipados com validação pra modelar dados MongoDB em Node.js. Crie um schema de usuário com campos obrigatórios, defaults e um método de instância.',
      en: 'Mongoose defines typed schemas with validation to model MongoDB data in Node.js. Create a user schema with required fields, defaults, and an instance method.',
    },
    code: `import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);
export default User;`,
  },
]
