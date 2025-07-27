
import React from 'react';
import { MFAOverview } from './mfa/MFAOverview';
import { BackupCodesManager } from './mfa/BackupCodesManager';
import { AuthenticatorSetup } from './mfa/AuthenticatorSetup';

export function MultiFactorAuthManager() {
  const handleCodesGenerated = () => {
    // Handle backup codes generation
    console.log('Backup codes generated');
  };

  const handleSetupComplete = () => {
    // Handle MFA setup completion
    console.log('MFA setup completed');
  };

  return (
    <div className="space-y-6">
      <MFAOverview />
      <BackupCodesManager onCodesGenerated={handleCodesGenerated} />
      <AuthenticatorSetup onSetupComplete={handleSetupComplete} />
    </div>
  );
}
