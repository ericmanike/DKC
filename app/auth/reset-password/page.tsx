import ResetSuspense from '@/components/resetSuspense'
import ResetPasswordForm from '@/components/resetPassword'

import React from 'react'

function PasswordReset() {
  return (
  

    <>
    <ResetSuspense>
      <ResetPasswordForm />
    </ResetSuspense>
    </>
  )
}

export default PasswordReset