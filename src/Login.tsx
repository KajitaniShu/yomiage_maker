import React from 'react'
import SignInWithGoogle from './SignInWithGoogle';
import { Center } from '@mantine/core';


export function Login() {
  return (
    <Center style={{ width: "100%", height: "100%" }}>
      <SignInWithGoogle/>
    </Center>
  )
}
