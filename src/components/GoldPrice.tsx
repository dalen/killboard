import { ReactNode } from 'react';

export function GoldPrice({ price }: { price: number }): ReactNode {
  if (price === 0) {
    return null;
  }

  const gold = Math.floor(price / 10000);
  const silver = Math.floor((price % 10000) / 100);
  const copper = price % 100;

  return (
    <span>
      {gold > 0 && (
        <span className="icon-text mr-1">
          {gold}
          <figure className="image is-16x16 mt-1">
            <img
              src="https://armory.returnofreckoning.com/icon/46"
              alt="Gold"
            />
          </figure>
        </span>
      )}
      {silver > 0 && (
        <span className="icon-text mr-1">
          {silver}
          <figure className="image is-16x16 mt-1">
            <img
              src="https://armory.returnofreckoning.com/icon/47"
              alt="Silver"
            />
          </figure>
        </span>
      )}
      {copper > 0 && (
        <span className="icon-text mr-1">
          {copper}
          <figure className="image is-16x16 mt-1">
            <img
              src="https://armory.returnofreckoning.com/icon/47"
              alt="Copper"
            />
          </figure>
        </span>
      )}
    </span>
  );
}
