import { useState } from 'react';
import { PhaseType } from '../../../types';
import { SignUpConfirmation } from '../SignUpConfirmation';
import { SignUpInput } from '../SignUpInput';
import { SignUpThanks } from '../SignUpThanks';

export const SignUpForm = () => {
  const [phase, setPhase] = useState<PhaseType>('input');
  const togglePhase = (newPhase: PhaseType) => setPhase(newPhase);

  const phaseComponent = () => {
    switch (phase) {
      case 'input':
        return <SignUpInput togglePhase={togglePhase} />;
      case 'confirmation':
        return <SignUpConfirmation togglePhase={togglePhase} />;
      case 'thanks':
        return <SignUpThanks />;
    }
  };

  return <>{phaseComponent()}</>;
};
