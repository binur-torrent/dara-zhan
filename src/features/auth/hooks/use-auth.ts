"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchUserProfile,
  signIn,
  signOut,
} from "@/features/auth/api/auth";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  });
}
