import { LatestKills } from '../components/LatestKills';

export const Character = (): JSX.Element => {
  return (
    <div className="container is-max-desktop mt-2">
      <LatestKills />
    </div>
  );
};
