import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth } from './firebase'
import { provider } from './firebase';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@mantine/core';

export default function SignInWithGoogle() {
  return (
    <Button leftIcon={<FcGoogle />} variant="default" color="gray">Googleでログイン</Button>
  )
}
