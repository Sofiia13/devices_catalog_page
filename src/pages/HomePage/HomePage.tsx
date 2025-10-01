import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';
import { Banner } from '../../components/Banner';
import { ProductsList } from '../../components/ProductsList';
import { Product } from '../../utils/Product';
import { CategoriesList } from '../../components/CategoriesList';

export const HomePage: React.FC = () => {
  const [newModels, setNewModels] = useState<Product[]>([]);
  const [hotPrices, setHotPrices] = useState<Product[]>([]);

  useEffect(() => {
    const getNewModels = async () => {
      try {
        const res = await fetch('api/phones.json');
        const json: Product[] = await res.json();

        const latestModels = json.slice(0, 20);

        setNewModels(latestModels);
      } catch (e) {}
    };

    const getHotPrices = async () => {
      try {
        const res = await fetch('api/phones.json');
        const json: Product[] = await res.json();

        const sortedByDiscount = json
          .filter(
            p => p.priceDiscount !== undefined && p.priceRegular !== undefined,
          )
          .sort(
            (a, b) =>
              b.priceRegular! -
              b.priceDiscount! -
              (a.priceRegular! - a.priceDiscount!),
          )
          .slice(0, 15);

        setHotPrices(sortedByDiscount);
      } catch (e) {}
    };

    getNewModels();
    getHotPrices();
  }, []);

  return (
    <>
      <h1 className={styles['visually-hidden']}>Product Catalog</h1>
      <p className={styles.title__h1}>Welcome to Nice Gadgets store!</p>

      <Banner />

      <ProductsList title="Brand new models" products={newModels} />

      <h2 className={styles.title__h2}>Shop by category</h2>

      <CategoriesList />

      <ProductsList title="Hot prices" products={hotPrices} />
    </>
  );
};
