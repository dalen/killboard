import { Career } from '../types';
import { careerIcon } from '../utils';

export function CareerIcon({ career }: { career: Career }): JSX.Element {
  return (
    <p className="image is-32x32">
      <img src={careerIcon(career)} alt={career} />
    </p>
  );
}
