import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ==============================================================================
 * 💡 [shadcn/ui 핵심 유틸리티: cn() 함수]
 * ==============================================================================
 * 1. shadcn/ui란?
 *    - npm으로 설치해서 가져오는 일체형 라이브러리(예: MUI, AntDesign)가 아닙니다.
 *    - 잘 만들어진 UI 컴포넌트 소스코드를 내 프로젝트(src/components/ui/)에 직접 복사해서
 *      소유하고 자유롭게 커스텀할 수 있게 해주는 "컴포넌트 레시피/부품 모음집"입니다.
 * 
 * 2. cn(...) 함수의 역할:
 *    - Tailwind CSS 클래스를 조건부로 덧붙이거나(clsx)
 *    - 클래스 간 충돌(예: 'px-2'와 'px-4'가 겹칠 때 뒤의 것 우선 적용: twMerge)을 
 *      깔끔하게 해결해 주는 필수 도구입니다.
 * 
 * 사용 예시:
 * <Button className={cn("bg-blue-500", isPrimary && "bg-red-500")} />
 * ==============================================================================
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

