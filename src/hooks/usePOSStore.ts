import { useState, useEffect } from 'react';
import { Product, Category, Transaction, CashierStat, Employee, StoreConfig, DEFAULT_STORE_CONFIG } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_CASHIERS,
  INITIAL_EMPLOYEES
} from '../data/mockData';

export function usePOSStore() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('grizo_pos_products');
    if (saved) {
      const parsed: Product[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].price < 1000) {
        return INITIAL_PRODUCTS;
      }
      return parsed;
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('grizo_pos_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('grizo_pos_transactions');
    if (saved) {
      const parsed: Transaction[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].total < 1000) {
        return INITIAL_TRANSACTIONS;
      }
      return parsed;
    }
    return INITIAL_TRANSACTIONS;
  });

  const [cashierStats, setCashierStats] = useState<CashierStat[]>(() => {
    const saved = localStorage.getItem('grizo_pos_cashier_stats');
    if (saved) {
      const parsed: CashierStat[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].totalSales < 1000) {
        return INITIAL_CASHIERS;
      }
      return parsed;
    }
    return INITIAL_CASHIERS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('grizo_pos_employees');
    if (saved) {
      const parsed: Employee[] = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].totalSalesToday > 0 && parsed[0].totalSalesToday < 1000) {
        return INITIAL_EMPLOYEES;
      }
      return parsed;
    }
    return INITIAL_EMPLOYEES;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('grizo_pos_store_config');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_CONFIG;
  });

  const [taxRate, setTaxRate] = useState<number>(() => storeConfig.taxRate || 0.085);

  const handleSaveConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    setTaxRate(newConfig.taxRate);
    localStorage.setItem('grizo_pos_store_config', JSON.stringify(newConfig));
  };

  // Safe Persistence Handlers with Quota Error Handling
  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_products', JSON.stringify(products));
    } catch (err) {
      console.warn('Storage quota exceeded when saving products:', err);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_categories', JSON.stringify(categories));
    } catch (err) {
      console.warn('Storage quota exceeded when saving categories:', err);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_transactions', JSON.stringify(transactions));
    } catch (err) {
      console.warn('Storage quota exceeded when saving transactions:', err);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_cashier_stats', JSON.stringify(cashierStats));
    } catch (err) {
      console.warn('Storage quota exceeded when saving cashier stats:', err);
    }
  }, [cashierStats]);

  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_employees', JSON.stringify(employees));
    } catch (err) {
      console.warn('Storage quota exceeded when saving employees:', err);
    }
  }, [employees]);

  return {
    products,
    setProducts,
    categories,
    setCategories,
    transactions,
    setTransactions,
    cashierStats,
    setCashierStats,
    employees,
    setEmployees,
    storeConfig,
    taxRate,
    handleSaveConfig
  };
}
