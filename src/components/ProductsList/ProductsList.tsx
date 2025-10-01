import React, { useEffect, useRef, useState } from 'react';
import styles from './ProductsList.module.scss';
import { Product } from '../../utils/Product';
import { ProductCard } from '../ProductCard';
import { ButtonScroll } from '../ButtonScroll';

type Props = {
  products: Product[];
  title: string;
};

export const ProductsList: React.FC<Props> = ({ products, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  const scrollGap = 16;
  const itemMinWidth = 272;

  const scrollContainerLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollContainerRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleResize = () => {
    if (!containerRef.current) {
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;

    const maxItems =
      Math.floor((containerWidth + scrollGap) / (itemMinWidth + scrollGap)) ||
      1;

    const itemWidth = (containerWidth - scrollGap * (maxItems - 1)) / maxItems;

    Array.from(containerRef.current.children).forEach(child => {
      const el = child as HTMLElement;

      el.style.width = `${itemWidth}px`;
      el.style.flex = `0 0 ${itemWidth}px`;
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [products]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [products]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setIsLeftDisabled(scrollLeft <= 0);
      setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    container.addEventListener('scroll', update);

    return () => container.removeEventListener('scroll', update);
  }, [products]);

  return (
    <>
      <div className={styles['header-row']}>
        <h2>{title}</h2>
        <div className={styles.arrow}>
          <ButtonScroll
            buttonText="img/icons/arrow-left.svg"
            clickFunc={scrollContainerLeft}
            disabled={isLeftDisabled}
          />
          <ButtonScroll
            buttonText="img/icons/arrow-right.svg"
            clickFunc={scrollContainerRight}
            disabled={isRightDisabled}
          />
        </div>
      </div>
      <div className={styles['products-list']} ref={containerRef}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};
