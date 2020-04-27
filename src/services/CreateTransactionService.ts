import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import TransactionRespository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  title_category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    title_category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRespository);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Tipo não permitido!');
    }

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Saldo insuficiente para realizar a transaçã0!');
    }

    const createCategory = new CreateCategoryService();
    const category = await createCategory.execute({
      title_category,
    });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
