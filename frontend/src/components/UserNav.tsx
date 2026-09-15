'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function UserNav() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="text-sm text-gray-500">로딩 중...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          👋 {user.name || user.email}
        </span>
        <Button variant="outline" size="sm" onClick={logout}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="outline" size="sm">
          로그인
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">
          회원가입
        </Button>
      </Link>
    </div>
  );
}
