import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth } from './firebase'
import { provider } from './firebase';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@mantine/core';
import { getAuth, signInWithRedirect } from "firebase/auth";

function hundleSignIn() {
  signInWithRedirect(auth, provider);
}

export default function SignInWithGoogle() {
  return (
    <Button leftIcon={<FcGoogle />} onClick={hundleSignIn} variant="default" color="gray">Googleでログイン</Button>
  )
}
